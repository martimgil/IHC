import { useState } from 'react';
import { currentUser, sports, getLevelLabel, lobbies, sessions } from '../data';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import {
  FaArrowLeft, FaEnvelope, FaMapPin, FaCalendarDays, FaTrophy,
  FaGear, FaHeart, FaCircleCheck, FaAward, FaBell,
  FaChevronRight, FaPlus, FaRightFromBracket, FaStar, FaPenToSquare, FaXmark, FaBolt, FaMagnifyingGlass, FaTrashCan
} from 'react-icons/fa6';
import StickyBackButton from '../components/StickyBackButton';
import { toast } from 'sonner';

// Suggested activities from user's interested sports (R17)
function SuggestionsSection() {
  const navigate = useNavigate();
  const suggested = lobbies
    .filter(l => currentUser.interestedSports.includes(l.sportId) && l.status !== 'full')
    .slice(0, 3);
  if (suggested.length === 0) return null;
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FaBolt className="w-5 h-5 text-primary" />Sugestões Para Ti
        </CardTitle>
        <CardDescription>Baseadas nos teus desportos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggested.map(l => {
          const s = sports.find(sp => sp.id === l.sportId);
          return (
            <button
              key={l.id}
              onClick={() => navigate(`/lobby/${l.id}`)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors text-left"
              aria-label={`${s?.name} em ${l.locationName}`}
            >
              <span className="text-2xl">{s?.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{s?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{l.locationName} · {l.scheduledDate}</p>
              </div>
              <FaChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Edit Profile Sheet — only name & location
function EditProfileSheet({ open, onClose, userName, userLocation }: { open: boolean; onClose: () => void; userName: string; userLocation: string }) {
  const [name, setName] = useState(userName);
  const [location, setLocation] = useState(userLocation);

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
                <FaPenToSquare className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              Editar Perfil
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-5 pb-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Nome</Label>
              <Input id="edit-name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-location">Local de Residência</Label>
              <div className="relative">
                <FaMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="edit-location" value={location} onChange={e => setLocation(e.target.value)} className="pl-9" />
              </div>
            </div>
            <Button className="w-full mt-2 h-12 text-base font-bold shadow-lg shadow-primary/10 rounded-2xl active:scale-[0.98] transition-transform" onClick={() => { toast.success('Perfil atualizado!'); onClose(); }}>
              Guardar Alterações
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Edit Sports Sheet — only sports & levels
function EditSportsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [interests, setInterests] = useState<string[]>([...currentUser.interestedSports]);
  const [levels, setLevels] = useState<Record<string, string>>({ ...currentUser.experienceLevels });
  const levelOptions = ['iniciante', 'intermediario', 'avancado'];

  const toggleSport = (id: string) =>
    setInterests(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const removeSport = (id: string) => {
    setInterests(prev => prev.filter(s => s !== id));
  };

  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = sports.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !interests.includes(s.id)
  );

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
                <FaHeart className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              Editar Desportos
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-5 pb-4">
            <div>
              <p className="text-sm font-semibold mb-2">Adicionar Desportos</p>
              <div className="relative mb-3">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar desportos..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {searchQuery && searchResults.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {searchResults.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { toggleSport(s.id); setSearchQuery(''); }}
                      className="flex items-center gap-2 p-2 rounded-xl border-2 border-border bg-card text-left transition-all text-sm hover:border-primary active:scale-[0.97]"
                    >
                      <span>{s.icon}</span><span className="truncate">{s.name}</span>
                      <FaPlus className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">Nenhum desporto encontrado.</p>
              )}
            </div>

            {interests.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Nível por Desporto</p>
                <div className="space-y-2">
                  {interests.map(id => {
                    const s = sports.find(sp => sp.id === id);
                    return (
                      <div key={id} className="flex items-center gap-3 bg-muted/30 p-2 rounded-xl border-2 border-transparent hover:border-border transition-colors">
                        <span className="text-lg w-8 shrink-0 flex items-center justify-center">{s?.icon}</span>
                        <span className="text-sm font-medium flex-1 truncate">{s?.name}</span>
                        <div className="flex gap-1">
                          {levelOptions.map(lv => (
                            <button
                              key={lv}
                              onClick={() => setLevels(prev => ({ ...prev, [id]: lv }))}
                              className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${(levels[id] || 'iniciante') === lv ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                              aria-pressed={(levels[id] || 'iniciante') === lv}
                            >
                              {lv === 'iniciante' ? 'Ini' : lv === 'intermediario' ? 'Int' : 'Av'}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => removeSport(id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors ml-1"
                          aria-label="Remover desporto"
                        >
                          <FaTrashCan className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <Button className="w-full mt-2 h-12 text-base font-bold shadow-lg shadow-primary/10 rounded-2xl active:scale-[0.98] transition-transform" onClick={() => { toast.success('Desportos atualizados!'); onClose(); }}>
              Guardar Alterações
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const { sessionUser, logout } = useUser();
  const [editOpen, setEditOpen] = useState(false);
  const [sportsEditOpen, setSportsEditOpen] = useState(false);

  const displayName = sessionUser?.name ?? currentUser.name;
  const displayEmail = sessionUser?.email ?? currentUser.email;
  const displayLocation = sessionUser?.location || currentUser.location;
  const [bookings, setBookings] = useState([
    { id: '1', sportId: 'hidroginastica', location: 'Pavilhão Rosa Mota', date: '2026-03-05', time: '19:00' },
    { id: '2', sportId: 'pickleball', location: 'Centro Desportivo Municipal', date: '2026-03-07', time: '18:30' },
    { id: '3', sportId: 'trilho', location: 'Passadiços de Aveiro', date: '2026-03-10', time: '10:00' },
  ]);

  const userSports = sports.filter(s => currentUser.interestedSports.includes(s.id));
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const stats = [
    { label: 'Atividades', value: '12', icon: <FaTrophy className="w-4 h-4 text-amber-500" />, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Reservas', value: String(bookings.length), icon: <FaCalendarDays className="w-4 h-4 text-blue-500" />, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Desportos', value: String(userSports.length), icon: <FaHeart className="w-4 h-4 text-red-500" />, color: 'text-red-600 dark:text-red-400' },
    { label: 'Conquistas', value: '6', icon: <FaStar className="w-4 h-4 text-purple-500" />, color: 'text-purple-600 dark:text-purple-400' },
  ];

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    toast.success('Reserva cancelada.', { description: 'Receberá o reembolso em 3-5 dias úteis.' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <StickyBackButton to="/" />

      {/* Hero Card */}
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="h-16 bg-gradient-to-r from-primary/80 to-primary" aria-hidden="true" />
        <CardContent className="px-5 pb-5 -mt-8">
          <div className="flex items-end justify-between gap-3 mb-4">
            <Avatar className="w-16 h-16 border-4 border-card shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="mb-1 min-h-[40px]" onClick={() => setEditOpen(true)} aria-label="Editar perfil">
              <FaPenToSquare className="w-4 h-4 mr-2" />Editar Perfil
            </Button>
          </div>
          <div className="mb-4">
            <h1 className="text-xl font-bold">{displayName}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><FaEnvelope className="w-3.5 h-3.5" />{displayEmail}</span>
              <span className="flex items-center gap-1.5"><FaMapPin className="w-3.5 h-3.5" />{displayLocation}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-xl">
                {s.icon}
                <span className={`text-lg font-bold leading-none ${s.color}`}>{s.value}</span>
                <span className="text-xs text-muted-foreground text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions (R17) */}
      <SuggestionsSection />

      <button
        className="w-full flex items-center justify-between p-4 bg-card border rounded-xl shadow-sm hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-amber-400"
        onClick={() => navigate('/achievements')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-900/40">
            <FaAward className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm">As Minhas Conquistas</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Desbloqueaste 6/10 emblemas</p>
          </div>
        </div>
        <FaChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Sports (R04 - linking to sports edit) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FaHeart className="w-5 h-5 text-red-500" />Os Meus Desportos
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSportsEditOpen(true)} className="min-h-[40px] text-primary">
              <FaPlus className="w-4 h-4 mr-1" />Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {userSports.map(sport => (
              <button
                key={sport.id}
                className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left active:scale-[0.98]"
                onClick={() => navigate(`/sport/${sport.id}`)}
              >
                <div className="text-2xl shrink-0">{sport.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{sport.name}</p>
                  <Badge variant="outline" className="mt-0.5 text-xs px-1.5 py-0">
                    {getLevelLabel(currentUser.experienceLevels[sport.id] || 'iniciante')}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* More options */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Mais opções</CardTitle></CardHeader>
        <CardContent className="pt-0 space-y-1">
          {[
            { label: 'Preferências de Notificação', icon: <FaGear className="w-5 h-5 text-muted-foreground" />, action: () => toast.info('Em breve') },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/60 transition-colors text-left group focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
            >
              {item.icon}
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              <FaChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
          <Separator className="my-2" />
          <button
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left min-h-[48px]"
            onClick={() => { logout(); navigate('/login'); }}
          >
            <FaRightFromBracket className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-medium text-sm text-red-600 dark:text-red-400">Terminar Sessão</span>
          </button>
        </CardContent>
      </Card>

      {/* Edit Profile Sheet — name & location only */}
      <EditProfileSheet open={editOpen} onClose={() => setEditOpen(false)} userName={displayName} userLocation={displayLocation} />

      {/* Edit Sports Sheet — sports & levels only */}
      <EditSportsSheet open={sportsEditOpen} onClose={() => setSportsEditOpen(false)} />
    </div>
  );
}

