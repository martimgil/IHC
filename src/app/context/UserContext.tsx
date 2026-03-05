import { createContext, useContext, useState, ReactNode } from 'react';

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    password?: string;
    location?: string;
    interestedSports?: string[];
    experienceLevels?: Record<string, string>;
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

export function UserProvider({ children }: { children: ReactNode }) {
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
    useState(() => {
        const users = getUsers();
        if (users.length === 0) {
            saveUsers([{
                id: 'demo-alice',
                name: 'Alice PineTree',
                email: 'alice@example.com',
                password: 'password123',
                location: 'Aveiro',
                interestedSports: ['hidroginastica', 'basquetebol', 'pickleball', 'trilho'],
                experienceLevels: { hidroginastica: 'avancado', trilho: 'intermediario' }
            }]);
        }
    });

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

    const register = (name: string, email: string, interestedSports: string[], location?: string, password?: string) => {
        const users = getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'O email já está registado.' };
        }

        const newUser: SessionUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            interestedSports,
            location,
            experienceLevels: {}
        };

        users.push(newUser);
        saveUsers(users);
        saveSession(newUser);

        return { success: true };
    };

    const updateUser = (updates: Partial<SessionUser>) => {
        if (sessionUser) {
            saveSession({ ...sessionUser, ...updates });
        }
    };

    const logout = () => {
        setSessionUser(null);
        localStorage.removeItem(STORAGE_KEY_SESSION);
    };

    return (
        <UserContext.Provider value={{ sessionUser, login, register, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used inside UserProvider');
    return ctx;
}
