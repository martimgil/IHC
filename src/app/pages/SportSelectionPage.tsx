import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getSportById, getSessionsBySport, getLobbiesBySport, getLevelLabel } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Euro,
  AlertCircle,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';

export default function SportSelectionPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [equipmentOpen, setEquipmentOpen] = useState(false);

  const mockEquipment = [
    { name: 'Raquete', price: 2 },
    { name: 'Bola', price: 1 },
    { name: 'Coletes', price: 0.5 },
    { name: 'Kit completo', price: 4 },
  ];

  const sport = getSportById(sportId || '');
  const sessions = getSessionsBySport(sportId || '');
  const lobbies = getLobbiesBySport(sportId || '');

  if (!sport) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Desporto não encontrado.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  const filteredSessions = selectedLevel === 'all'
    ? sessions
    : sessions.filter(s => s.level === selectedLevel);

  const filteredLobbies = selectedLevel === 'all'
    ? lobbies
    : lobbies.filter(l => l.level === selectedLevel || l.level === 'qualquer');

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Sport Header */}
      <div className="bg-primary rounded-xl p-6 text-primary-foreground">
        <div className="flex items-start gap-4">
          <div className="text-6xl">{sport.icon}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{sport.name}</h1>
            <p className="opacity-90 mb-4">{sport.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {sport.minPlayers}-{sport.maxPlayers} jogadores
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Required Materials Alert */}
      {sport.requiredMaterials.length > 0 && (
        <div className="space-y-2">
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 dark:text-blue-200">Não te Esqueças!</AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              Materiais necessários: {sport.requiredMaterials.join(', ')}
            </AlertDescription>
          </Alert>
          <Button variant="outline" size="sm" className="w-full" onClick={() => setEquipmentOpen(true)} aria-label="Ver equipamento para aluguer">
            🎽 Ver equipamento disponível para aluguer
          </Button>
        </div>
      )}

      {/* Level Filter */}
      <div>
        <h3 className="font-semibold mb-3">Filtrar por Nível</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLevel === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('all')}
            size="sm"
          >
            Todos
          </Button>
          {sport.difficulty.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? 'default' : 'outline'}
              onClick={() => setSelectedLevel(level)}
              size="sm"
            >
              {getLevelLabel(level)}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Available Sessions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Sessões Disponíveis</h2>
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((session) => (
              <Card
                key={session.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/booking?session=${session.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{session.locationName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {session.locationAddress}
                      </CardDescription>
                    </div>
                    {session.isUrgent && (
                      <Badge variant="destructive" className="ml-2">Urgente</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(session.date).toLocaleDateString('pt-PT')} às {session.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration} minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{session.availableSpots} vagas de {session.totalSpots}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 font-semibold text-success">
                      <Euro className="w-4 h-4" />
                      <span>{session.price.toFixed(2)}</span>
                    </div>
                    <Badge variant="outline">{getLevelLabel(session.level)}</Badge>
                  </div>
                  <Button className="w-full mt-2">
                    Reservar Agora
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <p>Nenhuma sessão disponível no momento.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Lobbies */}
      <div>
        <h2 className="text-xl font-bold mb-4">Grupos à Procura de Jogadores</h2>
        {filteredLobbies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLobbies.map((lobby) => (
              <Card
                key={lobby.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/lobby/${lobby.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{lobby.locationName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {lobby.locationAddress}
                      </CardDescription>
                    </div>
                    {lobby.status === 'full' && (
                      <Badge variant="secondary" className="ml-2">Completo</Badge>
                    )}
                    {lobby.isUrgent && (
                      <Badge variant="destructive" className="ml-2">Urgente</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lobby.scheduledDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(lobby.scheduledDate).toLocaleDateString('pt-PT')} às {lobby.scheduledTime}</span>
                    </div>
                  )}
                  {lobby.isRecurring && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Treino semanal às {lobby.recurringDay}s</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{lobby.currentPlayers.length}/{lobby.maxPlayers} jogadores</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(lobby.currentPlayers.length / lobby.maxPlayers) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 font-semibold text-success">
                      <Euro className="w-4 h-4" />
                      <span>{lobby.pricePerPerson.toFixed(2)} por pessoa</span>
                    </div>
                    <Badge variant="outline">{getLevelLabel(lobby.level)}</Badge>
                  </div>
                  <Button
                    className="w-full mt-2"
                    disabled={lobby.status === 'full'}
                  >
                    {lobby.status === 'full' ? 'Grupo Completo' : 'Juntar-me ao Grupo'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500 mb-4">Nenhum grupo ativo no momento.</p>
              <Button onClick={() => navigate('/create-urgent')}>
                Criar Novo Grupo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Equipment Rental Sheet (R02) */}
      <Sheet open={equipmentOpen} onOpenChange={o => { if (!o) setEquipmentOpen(false); }}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader className="mb-4">
            <SheetTitle>🎽 Equipamento para Aluguer</SheetTitle>
          </SheetHeader>
          <p className="text-sm text-muted-foreground mb-4">Equipamento disponível em {sport.name} por sessão:</p>
          <div className="space-y-2">
            {mockEquipment.map(e => (
              <div key={e.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="font-medium text-sm">{e.name}</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {e.price === 0 ? 'Grátis' : `${e.price.toFixed(2)}€/sessão`}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">* Reserva no local antes da sessão começar.</p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
