import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getLobbyById, getSportById, currentUser, lobbies } from '../data';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import {
  FaArrowLeft, FaCalendarDay, FaMapPin, FaUsers, FaEuroSign, FaCircleCheck,
  FaClock, FaShieldHalved, FaCircleExclamation, FaPaperPlane, FaUserPlus, FaUserMinus,
  FaThumbsUp, FaStar, FaHeart, FaRightFromBracket, FaMessage
} from 'react-icons/fa6';
import StickyBackButton from '../components/StickyBackButton';
import { toast } from 'sonner';
import { Lobby } from '../types';

// ── Chat ──────────────────────────────────────────────────────────────
interface ChatMsg { id: string; sender: string; text: string; time: string; isMe: boolean; }
const initialMessages: ChatMsg[] = [
  { id: '1', sender: 'Eduardo OrangeTree', text: 'Olá! Estamos à espera de mais 1 jogador 👋', time: '18:45', isMe: false },
  { id: '2', sender: 'Ana Oliveira', text: 'Estou a caminho, chego em 5 min!', time: '18:46', isMe: false },
];

function LobbyChat() {
  const [msgs, setMsgs] = useState<ChatMsg[]>(initialMessages);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = () => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, {
      id: Date.now().toString(),
      sender: currentUser.name,
      text: text.trim(),
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }]);
    setText('');
  };

  return (
    <div className="flex flex-col" style={{ height: '320px' }}>
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-xl" role="log" aria-label="Mensagens do chat do grupo" aria-live="polite">
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border rounded-bl-sm'}`}>
              {!m.isMe && <p className="text-xs font-semibold text-muted-foreground mb-0.5">{m.sender}</p>}
              <p>{m.text}</p>
              <p className={`text-xs mt-0.5 ${m.isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-2">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escreve uma mensagem..."
          className="flex-1 h-10"
          aria-label="Mensagem"
        />
        <Button size="sm" onClick={send} disabled={!text.trim()} className="h-10 px-3" aria-label="Enviar">
          <FaPaperPlane className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Rating Sheet ──────────────────────────────────────────────────────
const RATING_CATS = [
  { key: 'friendly', label: 'Amigável', icon: <FaHeart className="w-4 h-4" /> },
  { key: 'teammate', label: 'Bom Colega', icon: <FaThumbsUp className="w-4 h-4" /> },
  { key: 'skilled', label: 'Habilidoso', icon: <FaStar className="w-4 h-4" /> },
];

function RatingSheet({ players, open, onClose }: { players: Lobby['currentPlayers'], open: boolean, onClose: () => void }) {
  const [ratings, setRatings] = useState<Record<string, Record<string, boolean>>>({});
  const toggle = (pid: string, cat: string) =>
    setRatings(r => ({ ...r, [pid]: { ...(r[pid] || {}), [cat]: !(r[pid]?.[cat]) } }));

  return (
    <Sheet open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <SheetContent
        side="bottom"
        className="inset-x-4 bottom-4 w-[calc(100%-2rem)] mx-auto rounded-[2.5rem] border-2 border-border shadow-2xl p-6 px-1 transition-all duration-300"
      >
        <div className="overflow-y-auto max-h-[75vh] px-5">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-6" />
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FaStar className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              Avaliar Jogadores
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            {players.map(p => (
              <div key={p.id} className="p-4 bg-muted/40 border-2 border-border/50 rounded-2xl space-y-3 transition-colors hover:border-primary/20">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-background shadow-sm">
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-base tracking-tight">{p.name}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RATING_CATS.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => toggle(p.id, key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all active:scale-[0.95] ${ratings[p.id]?.[key] ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20' : 'bg-card border-border/60 hover:border-primary/40'}`}
                      aria-pressed={!!ratings[p.id]?.[key]}
                      aria-label={`${label} para ${p.name}`}
                    >
                      {icon}{label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            className="w-full mt-8 h-12 text-base font-bold shadow-lg shadow-primary/10 rounded-2xl active:scale-[0.98] transition-transform"
            onClick={() => { toast.success('Avaliações guardadas!', { description: 'Obrigado!.' }); onClose(); }}
          >
            Guardar Avaliações
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function LobbyPage() {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { sessionUser } = useUser();
  const [hasJoined, setHasJoined] = useState(() => lobbyId === 'lobby-1' || lobbyId === 'lobby-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  // Sync state when navigating between lobbies
  useEffect(() => {
    if (lobbyId === 'lobby-1') setHasJoined(true);
    else setHasJoined(false);
    setShowChat(false);
    setShowRating(false);
  }, [lobbyId]);

  const [pendingRequests, setPendingRequests] = useState(() =>
    lobbyId === 'lobby-1'
      ? [
        { id: 'req-1', name: 'Marta Rodrigues', level: 'intermedio', skillRating: 6 },
        { id: 'req-2', name: 'Tiago Ferreira', level: 'avancado', skillRating: 8 },
      ]
      : []
  );
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  // If no lobbyId, show list of lobbies
  const lobby = lobbyId ? getLobbyById(lobbyId) : null;
  const sport = lobby ? getSportById(lobby.sportId) : null;

  if (!lobbyId) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <StickyBackButton />
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaUsers className="w-5 h-5 text-primary" aria-hidden="true" />Atividades de Última Hora
        </h1>
        <div className="space-y-3">
          {lobbies.map(l => {
            const s = getSportById(l.sportId);
            return (
              <button
                key={l.id}
                onClick={() => navigate(`/lobby/${l.id}`)}
                className="w-full flex items-center gap-3 p-4 bg-card border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={`${s?.name} em ${l.locationName}, ${l.currentPlayers.length} de ${l.maxPlayers} jogadores${l.isUrgent ? ', urgente' : ''}`}
              >
                <div className="text-3xl shrink-0" aria-hidden="true">{s?.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{s?.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{l.locationName}</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{l.scheduledDate} · {l.scheduledTime}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {l.isUrgent && <Badge variant="destructive" className="text-xs">Urgente</Badge>}
                  <span className="text-xs text-muted-foreground">{l.currentPlayers.length}/{l.maxPlayers} jogadores</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!lobby || !sport) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lobby não encontrado.</p>
        <Button onClick={() => navigate('/')} className="mt-4">Voltar ao Início</Button>
      </div>
    );
  }

  const myName = sessionUser?.name || currentUser.name;

  // Inject the active user if they have joined the lobby.
  const displayPlayers = [...lobby.currentPlayers];
  if (hasJoined && !displayPlayers.find(p => p.name.includes(myName))) {
    displayPlayers.unshift({ id: 'me', name: `${myName} (Tu)`, level: 'intermedio', skillRating: 7 });
  }

  const spotsLeft = Math.max(0, lobby.maxPlayers - displayPlayers.length);
  const progressPercentage = Math.min(100, (displayPlayers.length / lobby.maxPlayers) * 100);
  const canJoin = lobby.status !== 'full' && !hasJoined;

  const isCreator = !sessionUser && currentUser.id === lobby.createdBy;

  const handleJoin = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsProcessing(false);
    setHasJoined(true);
    if (lobby.isUrgent) {
      toast.success('Entraste no jogo!', { description: 'Sendo uma atividade urgente, a entrada é imediata.' });
    } else {
      toast.success('Pedido enviado!', { description: 'O criador irá aprovar a tua entrada.' });
    }
  };

  const handleLeave = () => {
    setHasJoined(false);
    toast.info('Saíste do grupo.');
  };

  const handleApprove = (id: string, name: string) => {
    setApprovedIds(prev => new Set([...prev, id]));
    toast.success(`${name} aprovado!`);
  };
  const handleReject = (id: string, name: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
    toast.info(`${name} rejeitado.`);
  };

  const generateTeams = () => {
    if (displayPlayers.length < lobby.minPlayers) return null;
    const sorted = [...displayPlayers].sort((a, b) => (b.skillRating || 0) - (a.skillRating || 0));
    const t1: typeof displayPlayers = [], t2: typeof displayPlayers = [];
    sorted.forEach((p, i) => { if (i % 2 === 0) t1.push(p); else t2.push(p); });
    return { t1, t2 };
  };
  const teams = lobby.status === 'confirmed' || lobby.status === 'full' ? generateTeams() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <StickyBackButton />

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl" role="img" aria-label={sport.name}>{sport.icon}</span>
              <div>
                <CardTitle className="text-xl">{sport.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-0.5">
                  <FaMapPin className="w-3 h-3" aria-hidden="true" />{lobby.locationName}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {lobby.isUrgent && <Badge variant="destructive">Urgente</Badge>}
              {lobby.status === 'full' && <Badge variant="secondary">Completo</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {lobby.scheduledDate && (
            <div className="flex items-center gap-2 text-sm">
              <FaCalendarDay className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <span>{new Date(lobby.scheduledDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })} às {lobby.scheduledTime}</span>
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FaUsers className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-semibold">{lobby.currentPlayers.length}/{lobby.maxPlayers} jogadores</span>
              </div>
              <Badge variant="outline">{lobby.level}</Badge>
            </div>
            <div className="bg-muted rounded-full h-2" role="progressbar" aria-valuenow={displayPlayers.length} aria-valuemin={0} aria-valuemax={lobby.maxPlayers} aria-label={`${displayPlayers.length} de ${lobby.maxPlayers} jogadores inscritos`}>
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progressPercentage}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              {lobby.currentPlayers.length >= lobby.minPlayers
                ? `✓ Mínimo atingido (${lobby.minPlayers})`
                : `Faltam ${lobby.minPlayers - lobby.currentPlayers.length} para o mínimo`}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-2.5">
            <FaEuroSign className="w-4 h-4 text-green-600" aria-hidden="true" />
            <p className="text-sm font-bold text-green-700 dark:text-green-300">{lobby.pricePerPerson.toFixed(2)}€ por pessoa</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons (Moved to Top) */}
      <div className="space-y-2">
        {canJoin && (
          <Button className="w-full h-12 text-sm md:text-base font-semibold" onClick={handleJoin} disabled={isProcessing}>
            {isProcessing
              ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />A enviar pedido...</>
              : <><FaUserPlus className="w-5 h-5 mr-2" />Juntar-me ao Grupo</>}
          </Button>
        )}

        {hasJoined && (
          <>
            {displayPlayers.length >= lobby.minPlayers && (
              <Button className="w-full h-12 text-sm md:text-base font-semibold bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                toast.success('Pagamento confirmado!', { description: 'Vaga garantida!' });
                navigate('/');
              }}>
                <FaEuroSign className="w-5 h-5 mr-2" />Confirmar Pagamento ({lobby.pricePerPerson.toFixed(2)}€)
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 text-xs md:text-sm font-semibold" onClick={() => setShowRating(true)}>
                <FaStar className="w-4 h-4 mr-1.5" />Avaliar Formação
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1 h-10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs md:text-sm font-semibold">
                    <FaRightFromBracket className="w-4 h-4 mr-1.5" />Sair do Grupo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sair do grupo?</AlertDialogTitle>
                    <AlertDialogDescription>A tua vaga ficará disponível para os outros jogadores.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleLeave}>Sair</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>

      {/* Alerts */}
      {lobby.isUrgent && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-800">
          <FaClock className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-900 dark:text-orange-200">Jogo Urgente</AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-300">Precisam de um substituto. Junta-te rapidamente!</AlertDescription>
        </Alert>
      )}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800">
        <FaCircleExclamation className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 dark:text-blue-200">Material necessário</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-300">{sport.requiredMaterials.join(', ')}</AlertDescription>
      </Alert>

      {/* Creator: pending approval requests (R06) */}
      {isCreator && pendingRequests.filter(r => !approvedIds.has(r.id)).length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FaShieldHalved className="w-4 h-4 text-amber-600" aria-hidden="true" />Pedidos de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingRequests.filter(r => !approvedIds.has(r.id)).map(req => (
              <div key={req.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                <Avatar className="w-8 h-8"><AvatarFallback className="text-xs">{req.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{req.name}</p>
                  <p className="text-xs text-muted-foreground">{req.level} · ⭐ {req.skillRating}/10</p>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" className="h-8 px-2 text-xs" onClick={() => handleApprove(req.id, req.name)}>
                    <FaCircleCheck className="w-3 h-3 mr-1" />Aprovar
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2 text-xs" onClick={() => handleReject(req.id, req.name)}>
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Players list (R19 - follow) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Jogadores no Grupo</CardTitle>
          <CardDescription>{displayPlayers.length} de {lobby.maxPlayers} vagas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {displayPlayers.map((player, idx) => (
              <div key={player.id} className="flex items-center gap-3 py-1">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.level}{player.skillRating ? ` · ⭐ ${player.skillRating}/10` : ''}</p>
                </div>
                {player.id === lobby.createdBy && (
                  <Badge variant="outline" className="text-xs shrink-0 border-amber-300 text-amber-700">
                    <FaShieldHalved className="w-3 h-3 mr-1" />Criador
                  </Badge>
                )}
                {player.id !== lobby.createdBy && player.id !== 'me' && (
                  <button
                    onClick={() => {
                      setFollowed(prev => {
                        const n = new Set(prev);
                        if (n.has(player.id)) { n.delete(player.id); toast.info(`Deixaste de seguir ${player.name}`); }
                        else { n.add(player.id); toast.success(`A seguir ${player.name}`); }
                        return n;
                      });
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition-all min-h-[32px] ${followed.has(player.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary'}`}
                    aria-label={followed.has(player.id) ? `Deixar de seguir ${player.name}` : `Seguir ${player.name}`}
                    aria-pressed={followed.has(player.id)}
                  >
                    <FaUserPlus className="w-3 h-3" />
                    {followed.has(player.id) ? 'A seguir' : 'Seguir'}
                  </button>
                )}
              </div>
            ))}
            {spotsLeft > 0 && Array.from({ length: Math.min(spotsLeft, 3) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-3 py-1 opacity-40">
                <Avatar className="w-9 h-9"><AvatarFallback className="text-xs">?</AvatarFallback></Avatar>
                <p className="text-sm text-muted-foreground">Vaga disponível</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Balanced Teams (R09) */}
      {teams && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-900 dark:text-green-200">Equipas Sugeridas</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-400">Balanceadas automaticamente por skill</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">🔵 Equipa A</p>
              {teams.t1.map(p => <p key={p.id} className="text-xs text-muted-foreground">{p.name}</p>)}
            </div>
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-300 mb-1">🔴 Equipa B</p>
              {teams.t2.map(p => <p key={p.id} className="text-xs text-muted-foreground">{p.name}</p>)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat (R13) */}
      <Card>
        <CardHeader className="pb-2">
          <button
            className="flex items-center gap-2 w-full text-left"
            onClick={() => setShowChat(v => !v)}
            aria-expanded={showChat}
            aria-controls="lobby-chat"
          >
            <FaMessage className="w-5 h-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-base">Chat do Grupo</CardTitle>
            <Badge variant="secondary" className="ml-auto text-xs">{initialMessages.length} msgs</Badge>
          </button>
        </CardHeader>
        {showChat && (
          <CardContent id="lobby-chat" className="pt-0">
            <LobbyChat />
          </CardContent>
        )}
      </Card>

      {/* Rating Sheet (R21) */}
      <RatingSheet players={displayPlayers} open={showRating} onClose={() => setShowRating(false)} />
    </div>
  );
}
