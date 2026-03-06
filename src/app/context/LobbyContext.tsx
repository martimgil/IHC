import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Lobby, Player } from '../types';
import { lobbies as initialLobbies } from '../data';
import { useUser } from './UserContext';

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
            return saved ? JSON.parse(saved) : initialLobbies;
        } catch {
            return initialLobbies;
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
                const newPlayers = [...lobby.currentPlayers, player];
                return {
                    ...lobby,
                    currentPlayers: newPlayers,
                    status: newPlayers.length >= lobby.maxPlayers ? 'full' : lobby.status
                };
            }
            return lobby;
        }));
    }, []);

    const leaveLobby = useCallback((lobbyId: string, playerId: string) => {
        setLobbies(prev => prev.map(lobby => {
            if (lobby.id === lobbyId) {
                const newPlayers = lobby.currentPlayers.filter(p => p.id !== playerId && p.name !== playerId);
                return {
                    ...lobby,
                    currentPlayers: newPlayers,
                    status: 'waiting' // Reset to waiting if someone leaves
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
