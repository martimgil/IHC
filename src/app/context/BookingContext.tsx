import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export function BookingProvider({ children }: { children: ReactNode }) {
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

    const cancelBooking = (id: string) => {
        const newBookings = bookings.filter(b => b.id !== id);
        setBookings(newBookings);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(newBookings));
    };

    const addBooking = (booking: Booking) => {
        const newBookings = [...bookings, booking];
        setBookings(newBookings);
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(newBookings));
    };

    return (
        <BookingContext.Provider value={{ bookings, cancelBooking, addBooking }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBookings() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBookings must be used inside BookingProvider');
    return ctx;
}
