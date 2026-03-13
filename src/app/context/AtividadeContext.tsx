import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Atividade, Player, ExperienceLevel } from '../lib/types';
import { atividades as initialAtividades, sports, mockUsers } from '../lib/data';
import { useUser } from './UserContext';

function ensureAllSportsHaveAtividades(currentAtividades: Atividade[]): Atividade[] {
    const baseAtividades = currentAtividades.filter(l => !l.id.startsWith('auto-'));
    const updatedAtividades = [...baseAtividades];
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const generatedLocations = [
        'Pavilhão Desportivo Municipal',
        'Complexo Desportivo Local',
        'Polidesportivo da Cidade',
        'Centro de Treinos',
        'Parque da Cidade'
    ];

    for (const sport of sports) {
        const sportAtividades = updatedAtividades.filter(l => l.sportId === sport.id);
        const hasUrgent = sportAtividades.some(l => l.isUrgent);
        const hasNormal = sportAtividades.some(l => !l.isUrgent);

        const availableUsers = mockUsers.slice(1, 12);
        
        const targetUrgentPlayersCount = Math.min(
            Math.max(1, (sport.maxPlayers || 10) - 1),
            Math.max(1, (sport.minPlayers || 4) - 1)
        );
        const urgentPlayers = availableUsers.slice(0, targetUrgentPlayersCount).map(u => ({
            id: u.id,
            name: u.name,
            level: 'intermedio' as ExperienceLevel,
            skillRating: 6
        }));
        
        const normalPlayers = availableUsers.slice(3, 5).map(u => ({
            id: u.id,
            name: u.name,
            level: 'principiante' as ExperienceLevel,
            skillRating: 5
        }));

        const randomLocation = generatedLocations[sport.name.length % generatedLocations.length];

        if (!hasUrgent) {
            const missingForMin = Math.max(0, (sport.minPlayers || 2) - urgentPlayers.length);
            updatedAtividades.push({
                id: `auto-urg-${sport.id}`,
                sportId: sport.id,
                locationName: randomLocation,
                locationAddress: 'Morada disponível após confirmação',
                scheduledDate: todayStr,
                scheduledTime: '21:00',
                level: 'qualquer',
                currentPlayers: urgentPlayers,
                minPlayers: sport.minPlayers || 2,
                maxPlayers: sport.maxPlayers || 10,
                pricePerPerson: 4.5,
                status: 'waiting',
                createdBy: urgentPlayers[0]?.id || 'sys',
                isUrgent: true,
                tags: ['Urgente', missingForMin > 0 ? `Faltam ${missingForMin}` : 'Quase completo']
            });
        }

        if (!hasNormal) {
            updatedAtividades.push({
                id: `auto-norm-${sport.id}`,
                sportId: sport.id,
                locationName: randomLocation,
                locationAddress: 'Morada disponível após confirmação',
                scheduledDate: dateStr,
                scheduledTime: '19:00',
                level: 'intermedio',
                currentPlayers: normalPlayers,
                minPlayers: sport.minPlayers || 2,
                maxPlayers: sport.maxPlayers || 10,
                pricePerPerson: 3,
                status: 'waiting',
                createdBy: normalPlayers[0]?.id || 'sys',
                isUrgent: false,
                tags: ['Amigável', 'Semanal']
            });
        }
    }

    return updatedAtividades;
}

interface AtividadeContextType {
    atividades: Atividade[];
    adicionarAtividade: (atividade: Atividade) => void;
    juntarAtividade: (atividadeId: string, player: Player) => void;
    sairAtividade: (atividadeId: string, playerId: string) => void;
    getAtividadeById: (id: string) => Atividade | undefined;
}

const AtividadeContext = createContext<AtividadeContextType | null>(null);

const STORAGE_KEY = 'matchin_atividades';

function computeStatus(playersLen: number, minPlayers: number, maxPlayers: number): 'full' | 'confirmed' | 'waiting' {
    if (playersLen >= maxPlayers) return 'full';
    if (playersLen >= minPlayers) return 'confirmed';
    return 'waiting';
}

function applyJoin(atividade: Atividade, player: Player): Atividade {
    if (atividade.currentPlayers.some(p => p.id === player.id || p.name === player.name)) return atividade;
    if (atividade.currentPlayers.length >= atividade.maxPlayers || atividade.status === 'full') return atividade;
    const newPlayers = [...atividade.currentPlayers, player];
    return { ...atividade, currentPlayers: newPlayers, status: computeStatus(newPlayers.length, atividade.minPlayers, atividade.maxPlayers) };
}

function applyLeave(atividade: Atividade, playerId: string): Atividade {
    const newPlayers = atividade.currentPlayers.filter(p => p.id !== playerId && p.name !== playerId);
    return { ...atividade, currentPlayers: newPlayers, status: computeStatus(newPlayers.length, atividade.minPlayers, atividade.maxPlayers) };
}

export function AtividadeProvider({ children }: { readonly children: ReactNode }) {
    useUser(); // ensure inside UserProvider

    const [atividades, setAtividades] = useState<Atividade[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : initialAtividades;
            return ensureAllSportsHaveAtividades(parsed);
        } catch {
            return ensureAllSportsHaveAtividades(initialAtividades);
        }
    });

    // Save to localStorage whenever atividades change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(atividades));
    }, [atividades]);

    const adicionarAtividade = useCallback((atividade: Atividade) => {
        setAtividades(prev => [...prev, atividade]);
    }, []);

    const juntarAtividade = useCallback((atividadeId: string, player: Player) => {
        setAtividades(prev => prev.map(atividade =>
            atividade.id === atividadeId ? applyJoin(atividade, player) : atividade
        ));
    }, []);

    const sairAtividade = useCallback((atividadeId: string, playerId: string) => {
        setAtividades(prev => prev.map(atividade =>
            atividade.id === atividadeId ? applyLeave(atividade, playerId) : atividade
        ));
    }, []);

    const getAtividadeById = useCallback((id: string) => {
        return atividades.find(l => l.id === id);
    }, [atividades]);

    const contextValue = useMemo(() => ({
        atividades,
        adicionarAtividade,
        juntarAtividade,
        sairAtividade,
        getAtividadeById
    }), [atividades, adicionarAtividade, juntarAtividade, sairAtividade, getAtividadeById]);

    return (
        <AtividadeContext.Provider value={contextValue}>
            {children}
        </AtividadeContext.Provider>
    );
}

export function useAtividades() {
    const ctx = useContext(AtividadeContext);
    if (!ctx) throw new Error('useAtividades must be used inside AtividadeProvider');
    return ctx;
}