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
    avatar?: string;
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

export function UserProvider({ children }: { readonly children: ReactNode }) {
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_SESSION);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const saveSession = useCallback((user: SessionUser) => {
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
    }, []);

    // Initialize with a demo user if empty
    useEffect(() => {
        const users = getUsers();
        if (users.length === 0) {
            saveUsers([{
                id: 'user-alice',
                name: 'Alice PineTree',
                email: 'alice@example.com',
                location: 'Aveiro',
                interestedSports: ['hidroginastica', 'basquetebol', 'pickleball', 'trilho'],
                experienceLevels: { hidroginastica: 'principiante', trilho: 'qualquer' },
                activityHistory: [
                    { id: 'act-1', date: '2026-03-04T18:00:00Z', type: 'Hidroginástica', duration: 60, calories: 300, location: 'Pavilhão Rosa Mota' },
                    { id: 'act-2', date: '2026-03-01T10:00:00Z', type: 'Trilho', duration: 120, calories: 420, location: 'Ria de Aveiro' },
                    { id: 'act-3', date: '2026-02-25T18:30:00Z', type: 'Pickleball', duration: 90, calories: 500, location: 'Centro Desportivo Municipal' },
                    { id: 'act-4', date: '2026-02-20T19:00:00Z', type: 'Hidroginástica', duration: 60, calories: 300, location: 'Pavilhão Rosa Mota' },
                ],
                unlockedAchievements: ['first-session', 'three-sports', 'early-bird'],
                achievementProgress: { 'twenty-sessions': 4, 'five-atividades': 2, 'all-sports': 4 }
            }, {
                id: 'p4',
                name: 'Eduardo OrangeTree',
                email: 'eduardo@example.com',
                location: 'Aveiro',
                interestedSports: ['voleibol', 'padel'],
                experienceLevels: { voleibol: 'senior-federado', padel: 'avancado' },
                activityHistory: [
                    { id: 'act-edu-1', date: '2026-03-05T20:00:00Z', type: 'Voleibol', duration: 90, calories: 800, location: 'Pavilhão Universitário' },
                ],
                unlockedAchievements: ['first-session', 'pro-player'],
                achievementProgress: { 'twenty-sessions': 15 }
            }]);
        }
    }, []);

    const login = useCallback((email: string, password?: string) => {
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
    }, [saveSession]);

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
            experienceLevels: interestedSports.reduce((acc, sport) => {
                acc[sport] = 'principiante';
                return acc;
            }, {} as Record<string, string>),
            activityHistory: [
                { id: `act-new-1`, date: new Date(Date.now() - 86400000 * 2).toISOString(), type: interestedSports[0] ? interestedSports[0].charAt(0).toUpperCase() + interestedSports[0].slice(1) : 'Atividade Inicial', duration: 60, calories: 300, location: location || 'Aveiro' },
            ],
            unlockedAchievements: ['first-session'],
            achievementProgress: { 'twenty-sessions': 1, 'five-atividades': 0, 'all-sports': 1 }
        };

        users.push(newUser);
        saveUsers(users);
        saveSession(newUser);

        return { success: true };
    }, [saveSession]);

    const updateUser = useCallback((updates: Partial<SessionUser>) => {
        if (sessionUser) {
            saveSession({ ...sessionUser, ...updates });
        }
    }, [sessionUser, saveSession]);

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
