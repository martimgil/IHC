import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';

export interface PastActivity {
    id: string;
    date: string;
    type: string;
    duration: number;
    calories: number;
    location: string;
}

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    password?: string;
    location?: string;
    interestedSports?: string[];
    experienceLevels?: Record<string, string>;
    activityHistory?: PastActivity[];
    unlockedAchievements?: string[];
    achievementProgress?: Record<string, number>;
}

interface UserContextType {
    sessionUser: SessionUser | null;
    login: (email: string, password?: string) => { success: boolean, message?: string };
    register: (name: string, email: string, sports: string[], location?: string, password?: string) => { success: boolean, message?: string };
    updateUser: (updates: Partial<SessionUser>) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY_SESSION = 'matchin_session_user';
const STORAGE_KEY_USERS = 'matchin_registered_users';

export function UserProvider({ children }: { readonly children: ReactNode }) {
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_SESSION);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const getUsers = (): SessionUser[] => {
        try {
            const users = localStorage.getItem(STORAGE_KEY_USERS);
            return users ? JSON.parse(users) : [];
        } catch {
            return [];
        }
    };

    const saveUsers = (users: SessionUser[]) => {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    };

    const saveSession = (user: SessionUser) => {
        setSessionUser(user);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));

        // Update user in users list
        const users = getUsers();
        const existingIndex = users.findIndex(u => u.id === user.id);
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        saveUsers(users);
    };

    // Initialize with a demo user if empty
    useEffect(() => {
        const users = getUsers();
        if (users.length === 0) {
            saveUsers([{
                id: 'demo-alice',
                name: 'Alice PineTree',
                email: 'alice@example.com',
                password: 'password123',
                location: 'Aveiro',
                interestedSports: ['hidroginastica', 'basquetebol', 'pickleball', 'trilho'],
                experienceLevels: { hidroginastica: 'avancado', trilho: 'intermediario' },
                activityHistory: [
                    { id: 'act-1', date: '2026-03-04T18:00:00Z', type: 'Padel', duration: 90, calories: 650, location: 'Padel Centro Aveiro' },
                    { id: 'act-2', date: '2026-03-01T10:00:00Z', type: 'Ténis', duration: 60, calories: 420, location: 'Club Ténis Aveiro' },
                    { id: 'act-3', date: '2026-02-26T19:00:00Z', type: 'Futebol', duration: 120, calories: 950, location: 'Campo Universitário' },
                    { id: 'act-4', date: '2026-02-22T18:00:00Z', type: 'Padel', duration: 60, calories: 450, location: 'Padel Centro Aveiro' },
                    { id: 'act-5', date: '2026-02-15T10:00:00Z', type: 'Ténis', duration: 90, calories: 600, location: 'Club Ténis Aveiro' },
                ],
                unlockedAchievements: ['first-session', 'five-sessions', 'ten-sessions', 'first-lobby', 'first-sport', 'three-sports'],
                achievementProgress: { 'twenty-sessions': 12, 'five-lobbies': 3, 'all-sports': 4 }
            }]);
        }
    }, []);

    const login = (email: string, password?: string) => {
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: 'Email não encontrado.' };
        }

        if (password && user.password && user.password !== password) {
            return { success: false, message: 'A password está incorreta.' };
        }

        saveSession(user);
        return { success: true };
    };

    const register = useCallback((name: string, email: string, interestedSports: string[], location?: string, password?: string) => {
        const users = getUsers();
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'O email já está registado.' };
        }

        const newUser: SessionUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            interestedSports,
            location,
            experienceLevels: {},
            activityHistory: [],
            unlockedAchievements: [],
            achievementProgress: {}
        };

        users.push(newUser);
        saveUsers(users);
        saveSession(newUser);

        return { success: true };
    }, []);

    const updateUser = useCallback((updates: Partial<SessionUser>) => {
        if (sessionUser) {
            saveSession({ ...sessionUser, ...updates });
        }
    }, [sessionUser]);

    const logout = useCallback(() => {
        setSessionUser(null);
        localStorage.removeItem(STORAGE_KEY_SESSION);
    }, []);

    const contextValue = useMemo(() => ({
        sessionUser, login, register, updateUser, logout
    }), [sessionUser, login, register, updateUser, logout]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used inside UserProvider');
    return ctx;
}
