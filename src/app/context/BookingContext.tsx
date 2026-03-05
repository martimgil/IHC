import { createContext, useContext, useState, ReactNode } from 'react';

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
    const [bookings, setBookings] = useState<Booking[]>([
        { id: 'lobby-1', sportId: 'voleibol', location: 'Pavilhão Universitário', date: '2026-03-05', time: '20:00' },
        { id: '2', sportId: 'pickleball', location: 'Centro Desportivo Municipal', date: '2026-03-07', time: '18:30' },
        { id: '3', sportId: 'trilho', location: 'Passadiços de Aveiro', date: '2026-03-10', time: '10:00' },
    ]);

    const cancelBooking = (id: string) => {
        setBookings(prev => prev.filter(b => b.id !== id));
    };

    const addBooking = (booking: Booking) => {
        setBookings(prev => [...prev, booking]);
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
