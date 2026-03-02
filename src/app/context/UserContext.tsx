import { createContext, useContext, useState, ReactNode } from 'react';

interface SessionUser {
    name: string;
    email: string;
    location?: string;
    interestedSports?: string[];
}

interface UserContextType {
    sessionUser: SessionUser | null;
    login: (name: string, email: string, location?: string) => void;
    register: (name: string, email: string, sports: string[], location?: string) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = 'matchin_session_user';

export function UserProvider({ children }: { children: ReactNode }) {
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const save = (user: SessionUser) => {
        setSessionUser(user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    };

    const login = (name: string, email: string, location?: string) =>
        save({ name, email, location });

    const register = (name: string, email: string, interestedSports: string[], location?: string) =>
        save({ name, email, interestedSports, location });

    const logout = () => {
        setSessionUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <UserContext.Provider value={{ sessionUser, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used inside UserProvider');
    return ctx;
}
