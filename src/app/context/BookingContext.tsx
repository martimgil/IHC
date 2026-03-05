import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useUser } from './UserContext';

export interface Booking {
    id: string;
    sportId: string;
    location: string;
    date: string;
    time: string;
}

interface BookingContextType {
    bookings: Booking[];
    cancelBooking: (id: string) => void;
    addBooking: (booking: Booking) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { readonly children: ReactNode }) {
    const { sessionUser } = useUser();
    const storageKey = sessionUser ? `matchin_bookings_${sessionUser.id}` : null;

    const [bookings, setBookings] = useState<Booking[]>(() => {
        if (!storageKey) return [];
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        if (!storageKey) {
            setBookings([]);
            return;
        }
        try {
            const saved = localStorage.getItem(storageKey);
            setBookings(saved ? JSON.parse(saved) : []);
        } catch {
            setBookings([]);
        }
    }, [storageKey]);

    const cancelBooking = useCallback((id: string) => {
        setBookings(prev => {
            const newBookings = prev.filter(b => b.id !== id);
            if (storageKey) localStorage.setItem(storageKey, JSON.stringify(newBookings));
            return newBookings;
        });
    }, [storageKey]);

    const addBooking = useCallback((booking: Booking) => {
        setBookings(prev => {
            const newBookings = [...prev, booking];
            if (storageKey) localStorage.setItem(storageKey, JSON.stringify(newBookings));
            return newBookings;
        });
    }, [storageKey]);

    const contextValue = useMemo(() => ({ bookings, cancelBooking, addBooking }), [bookings, cancelBooking, addBooking]);

    return (
        <BookingContext.Provider value={contextValue}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBookings() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBookings must be used inside BookingProvider');
    return ctx;
}
