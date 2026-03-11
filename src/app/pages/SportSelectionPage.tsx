import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getSportById, getSessionsBySport, getLevelLabel } from '../data';
import { useLobbies } from '../context/LobbyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import StickyBackButton from '../components/StickyBackButton';
import {
  FaCalendarDays,
  FaLocationDot,
  FaUsers,
  FaClock,
  FaDumbbell,
  FaBolt,
  FaShirt
} from 'react-icons/fa6';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function SportSelectionPage() {
  const { sportId } = useParams<{ sportId: string }>();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [equipmentOpen, setEquipmentOpen] = useState(false);

  const { lobbies: allLobbies } = useLobbies();
  const sport = getSportById(sportId || '');

  const mockEquipment = sport?.requiredMaterials.map((material, index) => ({
    name: material,
    price: index === 0 ? 2 : index === 1 ? 1 : 0.5
  })) || [];

  const sessions = getSessionsBySport(sportId || '');
  const lobbies = allLobbies.filter(l => l.sportId === sportId);

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
    <main className="space-y-6" aria-label={`Página do desporto ${sport?.name}`}>
      <StickyBackButton to="/" />

      {/* Sport Header */}
      <div className="bg-primary rounded-xl p-6 text-primary-foreground">
        <div className="flex items-start gap-4">
          <div className="text-6xl" role="img" aria-label={sport.name}>{sport.icon}</div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-2 truncate">{sport.name}</h1>
            <p className="opacity-90 mb-4">{sport.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {sport.requiredMaterials.length > 0 && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 border-blue-400/30 whitespace-normal text-left h-auto py-1.5 px-3 leading-tight w-full sm:w-auto">
                  Materiais: {sport.requiredMaterials.join(', ')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Required Materials Button */}
      {sport.requiredMaterials.length > 0 && (
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full block" onClick={() => setEquipmentOpen(true)} aria-label="Ver equipamento para aluguer">
            <FaShirt className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" /> Ver equipamento disponível para aluguer
          </Button>
        </div>
      )}

      {/* Level Filter */}
      <div>
        <h3 className="font-semibold mb-3">Filtrar por Nível</h3>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Selecionar nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {sport.difficulty.map((level) => (
              <SelectItem key={level} value={level}>
                {getLevelLabel(level)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Activities Section */}
      <section aria-labelledby="activities-heading">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 id="activities-heading" className="text-xl font-bold">Atividades Disponíveis</h2>
            <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase">Aveiro</Badge>
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
                        <Badge variant="destructive" className="animate-pulse font-bold">FLAG URGENTE</Badge>
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
                  <Button
                    className="w-full h-10 font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lobby/${lobby.id}`);
                    }}
                  >
                    Entrar na atividade
                  </Button>
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
              <p className="text-muted-foreground mb-4">
                Não há atividades disponíveis, pode{' '}
                <button
                  onClick={() => navigate(`/create-urgent?sport=${sportId}`)}
                  className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-0.5"
                >
                  criar uma atividade
                </button>
                .
              </p>
              {selectedLevel !== 'all' && (
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedLevel('all')}>Limpar Filtros</Button>
                </div>
              )}
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
              <ul className="space-y-2" aria-label="Lista de equipamento disponível">
                {mockEquipment.map(e => (
                  <li key={e.name} className="flex items-center justify-between p-4 bg-muted/40 border-2 border-border/50 rounded-2xl transition-colors hover:border-primary/20">
                    <span className="font-bold text-sm">{e.name}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800">
                      {e.price === 0 ? 'Grátis' : `${e.price.toFixed(2)}€/sessão`}
                    </Badge>
                  </li>
                ))}
              </ul>
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
    </main>
  );
}
