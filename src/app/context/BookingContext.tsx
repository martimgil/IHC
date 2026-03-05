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
    const [bookings, setBookings] = useState<Booking[]>([]);

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
