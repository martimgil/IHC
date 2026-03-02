import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { getSessionById, getSportById, currentUser } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Euro,
  CheckCircle,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const sessionId = searchParams.get('session');
  const session = sessionId ? getSessionById(sessionId) : null;
  const sport = session ? getSportById(session.sportId) : null;

  if (!session || !sport) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sessão não encontrada.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setBookingConfirmed(true);

    toast.success('Pagamento confirmado!', {
      description: 'A tua vaga foi garantida.',
    });

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = 'Reserva confirmada com sucesso!';
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4" role="img" aria-label="Sucesso">
                <CheckCircle className="w-12 h-12 text-green-600" aria-hidden="true" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-900">Reserva Confirmada!</CardTitle>
            <CardDescription className="text-green-800">
              A tua vaga foi confirmada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="space-y-3" role="region" aria-label="Detalhes da reserva">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{session.locationName}</p>
                  <p className="text-sm text-gray-600">{session.locationAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" aria-hidden="true" />
                <span>{new Date(session.date).toLocaleDateString('pt-PT')} às {session.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" aria-hidden="true" />
                <span>{session.duration} minutos</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button
                className="w-full h-12 bg-green-700 hover:bg-green-800 text-white shadow"
                onClick={() => navigate('/')}
              >
                Voltar ao Início
              </Button>
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => navigate('/profile')}
              >
                Ver as minhas reservas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-2 min-h-[44px]"
        aria-label="Voltar à página anterior"
      >
        <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
        Voltar
      </Button>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="text-4xl" role="img" aria-label={`Ícone de ${sport.name}`}>
              {sport.icon}
            </div>
            <div>
              <CardTitle>Resumo da Reserva: {sport.name}</CardTitle>
              <CardDescription>Confirma os detalhes antes de efetuares o pagamento</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3" role="region" aria-label="Detalhes da sessão">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">{session.locationName}</p>
                <p className="text-sm text-gray-600">{session.locationAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600 shrink-0" aria-hidden="true" />
              <span>{new Date(session.date).toLocaleDateString('pt-PT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} às {session.time}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-600 shrink-0" aria-hidden="true" />
              <span>Duração: {session.duration} minutos</span>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-600 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <span>{session.availableSpots} vaga(s) disponível(eis) de {session.totalSpots}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={session.totalSpots - session.availableSpots} aria-valuemin={0} aria-valuemax={session.totalSpots} aria-label={`${session.totalSpots - session.availableSpots} de ${session.totalSpots} vagas ocupadas`}>
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${((session.totalSpots - session.availableSpots) / session.totalSpots) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-2">
            <span className="text-lg font-semibold">Total a Pagar</span>
            <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
              <Euro className="w-6 h-6" aria-hidden="true" />
              <span aria-label={`${session.price.toFixed(2)} euros`}>{session.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informação do Participante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Nome:</span>
            <span className="font-semibold">{currentUser.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold">{currentUser.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Nível:</span>
            <Badge>{currentUser.experienceLevels[session.sportId] || 'Não definido'}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Warning */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" aria-hidden="true" />
        <AlertTitle className="text-orange-950 font-bold">Importante</AlertTitle>
        <AlertDescription className="text-orange-900 font-medium">
          O pagamento garante a tua vaga. Em caso de cancelamento com mais de 24h de antecedência,
          serás reembolsado em 100% do valor.
        </AlertDescription>
      </Alert>

      {/* Payment Button */}
      <div className="space-y-2">
        <Button
          className="w-full h-14 text-lg"
          onClick={handlePayment}
          disabled={isProcessing}
          aria-label={isProcessing ? 'A processar pagamento' : `Confirmar e pagar ${session.price.toFixed(2)} euros`}
        >
          {isProcessing ? (
            <>
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                role="status"
                aria-label="A processar"
              />
              A Processar...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" aria-hidden="true" />
              Confirmar e Pagar {session.price.toFixed(2)}€
            </>
          )}
        </Button>
        <p className="text-xs text-center text-gray-500" role="note">
          Pagamento seguro processado através de plataforma encriptada
        </p>
      </div>
    </div>
  );
}