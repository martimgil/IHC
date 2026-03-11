import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Lobby, Player } from '../types';
import { lobbies as initialLobbies, sports, mockUsers } from '../data';
import { useUser } from './UserContext';

function ensureAllSportsHaveLobbies(currentLobbies: Lobby[]): Lobby[] {
    const baseLobbies = currentLobbies.filter(l => !l.id.startsWith('auto-'));
    const updatedLobbies = [...baseLobbies];
    
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
        const sportLobbies = updatedLobbies.filter(l => l.sportId === sport.id);
        const hasUrgent = sportLobbies.some(l => l.isUrgent);
        const hasNormal = sportLobbies.some(l => !l.isUrgent);

        const availableUsers = mockUsers.slice(1, 12);
        
        const targetUrgentPlayersCount = Math.min(
            Math.max(1, (sport.maxPlayers || 10) - 1),
            Math.max(1, (sport.minPlayers || 4) - 1)
        );
        const urgentPlayers = availableUsers.slice(0, targetUrgentPlayersCount).map(u => ({
            id: u.id,
            name: u.name,
            level: 'intermedio' as any,
            skillRating: 6
        }));
        
        const normalPlayers = availableUsers.slice(3, 5).map(u => ({
            id: u.id,
            name: u.name,
            level: 'principiante' as any,
            skillRating: 5
        }));

        const randomLocation = generatedLocations[sport.name.length % generatedLocations.length];

        if (!hasUrgent) {
            const missingForMin = Math.max(0, (sport.minPlayers || 2) - urgentPlayers.length);
            updatedLobbies.push({
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
            updatedLobbies.push({
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

    return updatedLobbies;
}

interface LobbyContextType {
    lobbies: Lobby[];
    addLobby: (lobby: Lobby) => void;
    joinLobby: (lobbyId: string, player: Player) => void;
    leaveLobby: (lobbyId: string, playerId: string) => void;
    getLobbyById: (id: string) => Lobby | undefined;
}

const LobbyContext = createContext<LobbyContextType | null>(null);

const STORAGE_KEY = 'matchin_lobbies';

export function LobbyProvider({ children }: { readonly children: ReactNode }) {
    const { sessionUser } = useUser();

    const [lobbies, setLobbies] = useState<Lobby[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : initialLobbies;
            return ensureAllSportsHaveLobbies(parsed);
        } catch {
            return ensureAllSportsHaveLobbies(initialLobbies);
        }
    });

    // Save to localStorage whenever lobbies change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lobbies));
    }, [lobbies]);

    const addLobby = useCallback((lobby: Lobby) => {
        setLobbies(prev => [...prev, lobby]);
    }, []);

    const joinLobby = useCallback((lobbyId: string, player: Player) => {
        setLobbies(prev => prev.map(lobby => {
            if (lobby.id === lobbyId) {
                // Avoid duplicates
                if (lobby.currentPlayers.some(p => p.id === player.id || p.name === player.name)) {
                    return lobby;
                }
                // Enforce capacity so no lobby can exceed maxPlayers
                if (lobby.currentPlayers.length >= lobby.maxPlayers || lobby.status === 'full') {
                    return lobby;
                }
                const newPlayers = [...lobby.currentPlayers, player];
                const nextStatus =
                    newPlayers.length >= lobby.maxPlayers
                        ? 'full'
                        : newPlayers.length >= lobby.minPlayers
                            ? 'confirmed'
                            : 'waiting';
                return {
                    ...lobby,
                    currentPlayers: newPlayers,
                    status: nextStatus
                };
            }
            return lobby;
        }));
    }, []);

    const leaveLobby = useCallback((lobbyId: string, playerId: string) => {
        setLobbies(prev => prev.map(lobby => {
            if (lobby.id === lobbyId) {
                const newPlayers = lobby.currentPlayers.filter(p => p.id !== playerId && p.name !== playerId);
                const nextStatus =
                    newPlayers.length >= lobby.maxPlayers
                        ? 'full'
                        : newPlayers.length >= lobby.minPlayers
                            ? 'confirmed'
                            : 'waiting';
                return {
                    ...lobby,
                    currentPlayers: newPlayers,
                    status: nextStatus
                };
            }
            return lobby;
        }));
    }, []);

    const getLobbyById = useCallback((id: string) => {
        return lobbies.find(l => l.id === id);
    }, [lobbies]);

    const contextValue = useMemo(() => ({
        lobbies,
        addLobby,
        joinLobby,
        leaveLobby,
        getLobbyById
    }), [lobbies, addLobby, joinLobby, leaveLobby, getLobbyById]);

    return (
        <LobbyContext.Provider value={contextValue}>
            {children}
        </LobbyContext.Provider>
    );
}

export function useLobbies() {
    const ctx = useContext(LobbyContext);
    if (!ctx) throw new Error('useLobbies must be used inside LobbyProvider');
    return ctx;
}
