import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaArrowLeft, FaCalendarDays, FaCircleCheck, FaXmark } from 'react-icons/fa6';
import { sports } from '../data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export default function BookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([
        { id: 'lobby-1', sportId: 'voleibol', location: 'Pavilhão Universitário', date: '2026-03-05', time: '20:00' },
    ]);

    const cancelBooking = (id: string) => {
        setBookings(prev => prev.filter(b => b.id !== id));
        toast.success('Reserva cancelada.', { description: 'Receberá o reembolso em 3-5 dias úteis.' });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-5">
            <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" onClick={() => navigate(-1)} className="min-h-[44px] -ml-2 px-3">
                    <FaArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">As Minhas Reservas</h1>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FaCalendarDays className="w-5 h-5 text-primary" />Próximas Reservas
                            </CardTitle>
                            <CardDescription>Gerir atividades em agenda</CardDescription>
                        </div>
                        <Badge className="bg-green-600 text-white min-h-[24px]">
                            {bookings.length} ativa{bookings.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                    {bookings.length === 0 && (
                        <div className="text-center py-10">
                            <FaCalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">Sem reservas ativas.</p>
                            <p className="text-xs text-muted-foreground mt-1">Regressa ao mapa para encontrar atividades!</p>
                            <Button onClick={() => navigate('/')} className="mt-4" variant="outline">Procurar Atividades</Button>
                        </div>
                    )}
                    {bookings.map((booking, idx) => {
                        const sport = sports.find(s => s.id === booking.sportId);
                        const dateLabel = new Date(booking.date).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' });
                        return (
                            <div key={booking.id}>
                                <div
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors bg-card border shadow-sm cursor-pointer"
                                    onClick={() => navigate(`/lobby/${booking.id}`)}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">{sport?.icon}</div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <p className="font-bold text-sm leading-tight">{sport?.name}</p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{booking.location}</p>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                                                {dateLabel}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium border-primary/30 text-primary">
                                                {booking.time}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <FaCircleCheck className="w-5 h-5 text-green-500" />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Cancelar
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Cancelar reserva?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cancelas a reserva de <strong className="text-foreground">{sport?.name}</strong> em {booking.location} no dia {dateLabel}. Serás reembolsado em 100% se cancelares com 24h+ de antecedência.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Manter Reserva</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => cancelBooking(booking.id)}>
                                                        Confirmar Cancelamento
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
}
