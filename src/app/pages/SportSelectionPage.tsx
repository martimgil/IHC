import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getSportById, getSessionsBySport, getLobbiesBySport, getLevelLabel } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import StickyBackButton from '../components/StickyBackButton';
import {
  FaArrowLeft,
  FaCalendarDays,
  FaLocationDot,
  FaUsers,
  FaClock,
  FaEuroSign,
  FaCircleExclamation,
  FaCircleCheck,
  FaChevronRight,
  FaDumbbell,
  FaBolt
} from 'react-icons/fa6';
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
    <div className="space-y-6" role="main" aria-label={`Página do desporto ${sport?.name}`}>
      <StickyBackButton to="/" />

      {/* Sport Header */}
      <div className="bg-primary rounded-xl p-6 text-primary-foreground">
        <div className="flex items-start gap-4">
          <div className="text-6xl" role="img" aria-label={sport.name}>{sport.icon}</div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{sport.name}</h1>
            <p className="opacity-90 mb-4">{sport.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {sport.recommendedPlayers ? `${sport.recommendedPlayers} jogadores (recomendado)` : `${sport.minPlayers}-${sport.maxPlayers} jogadores`}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Required Materials Alert */}
      {sport.requiredMaterials.length > 0 && (
        <div className="space-y-2">
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800">
            <FaCircleExclamation className="h-4 w-4 text-blue-600" />
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

      {/* Activities Section */}
      <section aria-labelledby="activities-heading">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 id="activities-heading" className="text-xl font-bold">Atividades Disponíveis</h2>
            <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase">Aveiro</Badge>
          </div>

          <div className="flex gap-2.5">
            <Button
              variant="outline"
              className="flex-1 h-12 border-primary text-primary font-bold shadow-sm"
              onClick={() => navigate(`/create-urgent?sport=${sportId}`)}
            >
              Criar Sessão Normal
            </Button>
            <Button
              className="flex-1 h-12 font-bold shadow-lg shadow-primary/20"
              onClick={() => navigate(`/create-urgent?sport=${sportId}`)}
            >
              <FaBolt className="w-4 h-4 mr-1.5" /> Criar Urgente
            </Button>
          </div>
        </div>

        {[...filteredSessions, ...filteredLobbies].length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lobbies - Grouped first since they involve players */}
            {filteredLobbies.map((lobby) => (
              <Card
                key={lobby.id}
                className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-blue-500 active:scale-[0.98]"
                onClick={() => navigate(`/lobby/${lobby.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{lobby.locationName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-0.5">
                        <FaLocationDot className="w-3 h-3" />
                        {lobby.locationAddress}
                      </CardDescription>
                      <Badge variant="secondary" className="mt-2 text-[10px] uppercase font-extrabold tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Grupo de Jogadores</Badge>
                    </div>
                    {lobby.isUrgent && (
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="destructive" className="animate-pulse">URGENTE</Badge>
                        <FaBolt className="text-destructive w-4 h-4" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="p-2 bg-muted rounded-lg">
                      <FaCalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    <span>{new Date(lobby.scheduledDate!).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })} às {lobby.scheduledTime}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-tight">
                      <div className="flex items-center gap-1.5">
                        <FaUsers className="w-3.5 h-3.5" />
                        <span>Inscritos</span>
                      </div>
                      <span>{lobby.currentPlayers.length} / {lobby.maxPlayers}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(lobby.currentPlayers.length / lobby.maxPlayers) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Preço p/ pessoa</span>
                      <span className="font-extrabold text-lg text-primary">{lobby.pricePerPerson.toFixed(2)}€</span>
                    </div>
                    <Badge variant="outline" className="font-bold border-primary/20">{getLevelLabel(lobby.level)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Sessions - Listed next */}
            {filteredSessions.map((session) => (
              <Card
                key={session.id}
                className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-green-500 active:scale-[0.98]"
                onClick={() => navigate(`/booking?session=${session.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{session.locationName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-0.5">
                        <FaLocationDot className="w-3 h-3" />
                        {session.locationAddress}
                      </CardDescription>
                      <Badge variant="outline" className="mt-2 text-[10px] uppercase font-extrabold tracking-wider text-green-600 border-green-200">Aluguer de Campo</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="p-2 bg-muted rounded-lg">
                      <FaCalendarDays className="w-4 h-4 text-primary" />
                    </div>
                    <span>{new Date(session.date).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })} às {session.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="p-2 bg-muted rounded-lg">
                      <FaClock className="w-4 h-4 text-primary" />
                    </div>
                    <span>{session.duration} minutos · Individual ou Pares</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">Total Reserva</span>
                      <span className="font-extrabold text-lg text-primary">{session.price.toFixed(2)}€</span>
                    </div>
                    <Badge variant="outline" className="font-bold border-primary/20">{getLevelLabel(session.level)}</Badge>
                  </div>
                  <Button className="w-full h-10 font-bold bg-green-600 hover:bg-green-700">
                    Reservar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Sem atividades disponíveis para os filtros selecionados.</p>
              <div className="flex justify-center gap-2">
                <Button onClick={() => navigate('/create-urgent')}>Criar Grupo</Button>
                <Button variant="outline" onClick={() => setSelectedLevel('all')}>Limpar Filtros</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Equipment Rental Sheet (R02) */}
      <Sheet open={equipmentOpen} onOpenChange={o => { if (!o) setEquipmentOpen(false); }}>
        <SheetContent
          side="bottom"
          className="inset-x-4 bottom-4 w-[calc(100%-2rem)] mx-auto rounded-[2.5rem] border-2 border-border shadow-2xl p-6 px-1 transition-all duration-300"
          aria-label="Aluguer de equipamento"
        >
          <div className="overflow-y-auto max-h-[85dvh] px-5">
            <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-6" />
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FaDumbbell className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                Equipamento para Aluguer
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">Equipamento disponível em {sport.name} por sessão:</p>
              <div className="space-y-2" role="list" aria-label="Lista de equipamento disponível">
                {mockEquipment.map(e => (
                  <div key={e.name} role="listitem" className="flex items-center justify-between p-4 bg-muted/40 border-2 border-border/50 rounded-2xl transition-colors hover:border-primary/20">
                    <span className="font-bold text-sm">{e.name}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800">
                      {e.price === 0 ? 'Grátis' : `${e.price.toFixed(2)}€/sessão`}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic font-medium">
                * Reserva o equipamento no local antes da sessão começar.
              </p>
              <Button className="w-full mt-4 h-12 text-base font-bold shadow-lg shadow-primary/10 rounded-2xl active:scale-[0.98] transition-transform" onClick={() => setEquipmentOpen(false)}>
                Entendido
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
