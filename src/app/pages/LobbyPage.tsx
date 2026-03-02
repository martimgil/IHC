import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getLobbyById, getSportById, currentUser, lobbies } from '../data';
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
  ArrowLeft, Calendar, MapPin, Users, Euro, CheckCircle,
  Clock, Shield, AlertCircle, Send, UserPlus, UserMinus,
  ThumbsUp, Star, Heart, LogOut, MessageCircle
} from 'lucide-react';
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
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-xl">
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
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Rating Sheet ──────────────────────────────────────────────────────
const RATING_CATS = [
  { key: 'friendly', label: 'Amigável', icon: <Heart className="w-4 h-4" /> },
  { key: 'teammate', label: 'Bom Colega', icon: <ThumbsUp className="w-4 h-4" /> },
  { key: 'skilled', label: 'Habilidoso', icon: <Star className="w-4 h-4" /> },
];

function RatingSheet({ players, open, onClose }: { players: Lobby['currentPlayers'], open: boolean, onClose: () => void }) {
  const [ratings, setRatings] = useState<Record<string, Record<string, boolean>>>({});
  const toggle = (pid: string, cat: string) =>
    setRatings(r => ({ ...r, [pid]: { ...(r[pid] || {}), [cat]: !(r[pid]?.[cat]) } }));

  return (
    <Sheet open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto pb-8">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-primary" />Avaliar Jogadores</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          {players.map(p => (
            <div key={p.id} className="p-3 bg-muted/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8"><AvatarFallback className="text-xs">{p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                <p className="font-semibold text-sm">{p.name}</p>
              </div>
              <div className="flex gap-2">
                {RATING_CATS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => toggle(p.id, key)}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${ratings[p.id]?.[key] ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}
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
        <Button className="w-full mt-4" onClick={() => { toast.success('Avaliações guardadas!'); onClose(); }}>
          Guardar Avaliações
        </Button>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function LobbyPage() {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const [hasJoined, setHasJoined] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2 min-h-[44px]">
          <ArrowLeft className="w-4 h-4 mr-2" />Voltar
        </Button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />Atividades de Última Hora
        </h1>
        <div className="space-y-3">
          {lobbies.map(l => {
            const s = getSportById(l.sportId);
            return (
              <button
                key={l.id}
                onClick={() => navigate(`/lobby/${l.id}`)}
                className="w-full flex items-center gap-3 p-4 bg-card border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="text-3xl shrink-0">{s?.icon}</div>
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

  const spotsLeft = lobby.maxPlayers - lobby.currentPlayers.length;
  const progressPercentage = (lobby.currentPlayers.length / lobby.maxPlayers) * 100;
  const canJoin = lobby.status !== 'full' && !hasJoined;
  const isCreator = lobby.createdBy === currentUser.id;

  const handleJoin = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsProcessing(false);
    setHasJoined(true);
    toast.success('Pedido enviado!', { description: 'O criador irá aprovar a tua entrada.' });
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
    if (lobby.currentPlayers.length < lobby.minPlayers) return null;
    const sorted = [...lobby.currentPlayers].sort((a, b) => (b.skillRating || 0) - (a.skillRating || 0));
    const t1: typeof lobby.currentPlayers = [], t2: typeof lobby.currentPlayers = [];
    sorted.forEach((p, i) => { if (i % 2 === 0) t1.push(p); else t2.push(p); });
    return { t1, t2 };
  };
  const teams = lobby.status === 'confirmed' || lobby.status === 'full' ? generateTeams() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2 min-h-[44px]">
        <ArrowLeft className="w-4 h-4 mr-2" />Voltar
      </Button>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{sport.icon}</span>
              <div>
                <CardTitle className="text-xl">{sport.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{lobby.locationName}
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
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(lobby.scheduledDate).toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })} às {lobby.scheduledTime}</span>
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{lobby.currentPlayers.length}/{lobby.maxPlayers} jogadores</span>
              </div>
              <Badge variant="outline">{lobby.level}</Badge>
            </div>
            <div className="bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progressPercentage}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">
              {lobby.currentPlayers.length >= lobby.minPlayers
                ? `✓ Mínimo atingido (${lobby.minPlayers})`
                : `Faltam ${lobby.minPlayers - lobby.currentPlayers.length} para o mínimo`}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-2.5">
            <Euro className="w-4 h-4 text-green-600" />
            <p className="text-sm font-bold text-green-700 dark:text-green-300">{lobby.pricePerPerson.toFixed(2)}€ por pessoa</p>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {lobby.isUrgent && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/40 dark:border-orange-800">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-900 dark:text-orange-200">Jogo Urgente</AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-300">Precisam de um substituto. Junta-te rapidamente!</AlertDescription>
        </Alert>
      )}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 dark:text-blue-200">Material necessário</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-300">{sport.requiredMaterials.join(', ')}</AlertDescription>
      </Alert>

      {/* Creator: pending approval requests (R06) */}
      {isCreator && pendingRequests.filter(r => !approvedIds.has(r.id)).length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />Pedidos de Entrada
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
                    <CheckCircle className="w-3 h-3 mr-1" />Aprovar
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
          <CardDescription>{lobby.currentPlayers.length} de {lobby.maxPlayers} vagas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lobby.currentPlayers.map((player, idx) => (
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
                {idx === 0 && (
                  <Badge variant="outline" className="text-xs shrink-0 border-amber-300 text-amber-700">
                    <Shield className="w-3 h-3 mr-1" />Criador
                  </Badge>
                )}
                {idx > 0 && (
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
                    <UserPlus className="w-3 h-3" />
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
            <MessageCircle className="w-5 h-5 text-primary" />
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

      {/* Action Buttons */}
      <div className="space-y-2 pb-4">
        {canJoin && (
          <Button className="w-full h-12" onClick={handleJoin} disabled={isProcessing}>
            {isProcessing
              ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />A enviar pedido...</>
              : <><UserPlus className="w-4 h-4 mr-2" />Juntar-me ao Grupo</>}
          </Button>
        )}

        {hasJoined && (
          <>
            {lobby.currentPlayers.length >= lobby.minPlayers && (
              <Button className="w-full h-12" onClick={() => {
                toast.success('Pagamento confirmado!', { description: 'Vaga garantida!' });
                navigate('/');
              }}>
                <Euro className="w-4 h-4 mr-2" />Confirmar Pagamento ({lobby.pricePerPerson.toFixed(2)}€)
              </Button>
            )}
            <Button variant="outline" className="w-full h-10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700" onClick={() => setShowRating(true)}>
              <Star className="w-4 h-4 mr-2" />Avaliar Jogadores
            </Button>
            {/* Leave (R12) */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full h-10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40">
                  <LogOut className="w-4 h-4 mr-2" />Sair do Grupo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sair do grupo?</AlertDialogTitle>
                  <AlertDialogDescription>A tua vaga ficará disponível para outros jogadores.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleLeave}>Sair</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Rating Sheet (R21) */}
      <RatingSheet players={lobby.currentPlayers} open={showRating} onClose={() => setShowRating(false)} />
    </div>
  );
}
