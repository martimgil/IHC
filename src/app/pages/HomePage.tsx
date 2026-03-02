import { useState } from 'react';
import { useNavigate } from 'react-router';
import { sports, currentUser } from '../data';
import { useUser } from '../context/UserContext';
import { Sport } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Separator } from '../components/ui/separator';
import {
  Search, MapPin, Clock, ChevronRight, Users, Dumbbell, X
} from 'lucide-react';

function SportDetailSheet({
  sport,
  onClose,
}: {
  sport: Sport | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  if (!sport) return null;

  return (
    <Sheet open={!!sport} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8 max-h-[70vh] overflow-y-auto">
        <SheetHeader className="mb-4 text-left">
          <div className="flex items-center gap-3">
            <div className="text-4xl" role="img" aria-label={sport.name}>{sport.icon}</div>
            <div>
              <SheetTitle className="text-xl">{sport.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{sport.description}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          {/* Níveis */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Níveis disponíveis</p>
            <div className="flex flex-wrap gap-2">
              {sport.difficulty.map(d => (
                <Badge key={d} variant="secondary" className="text-xs capitalize">{d}</Badge>
              ))}
            </div>
          </div>

          {/* Players + Materials */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-xs font-semibold">Jogadores</span>
              </div>
              <p className="text-sm font-bold">{sport.minPlayers}–{sport.maxPlayers}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Dumbbell className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-xs font-semibold">Material</span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {sport.requiredMaterials.slice(0, 2).join(', ')}
                {sport.requiredMaterials.length > 2 ? '…' : ''}
              </p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => { onClose(); navigate(`/sport/${sport.id}`); }}
              aria-label={`Ver sessões de ${sport.name}`}
            >
              Ver Sessões
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => { onClose(); navigate(`/sport/${sport.id}?tab=lobby`); }}
              aria-label={`Ver lobbies de ${sport.name}`}
            >
              Ver Lobbies
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const { sessionUser } = useUser();
  const firstName = (sessionUser?.name ?? currentUser.name).split(' ')[0];

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userInterestedSports = sports.filter(sport =>
    currentUser.interestedSports.includes(sport.id)
  );

  return (
    <div className="space-y-4">
      {/* Welcome banner */}
      <section
        className="bg-primary rounded-2xl px-4 py-4 text-primary-foreground"
        aria-labelledby="welcome-heading"
      >
        <h2 id="welcome-heading" className="font-bold text-lg leading-tight">
          Olá, {firstName}! 👋
        </h2>
        <p className="text-sm opacity-80 mt-0.5">Pronto para praticar desporto?</p>
      </section>

      {/* Quick Actions – 2 compact cards */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="sr-only">Ações rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            className="flex items-center gap-2 p-3 rounded-xl border-2 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/40 active:scale-[0.97] transition-all text-left focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[60px]"
            onClick={() => navigate('/lobby')}
            aria-label="Procurar uma atividade de última hora"
          >
            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-orange-900 dark:text-orange-100 leading-tight">Última Hora</span>
          </button>
          <button
            className="flex items-center gap-2 p-3 rounded-xl border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40 active:scale-[0.97] transition-all text-left focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[60px]"
            onClick={() => navigate('/search-location')}
            aria-label="Procurar atividades por localização"
          >
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-green-900 dark:text-green-100 leading-tight">Por Local</span>
          </button>
        </div>
      </section>

      {/* Search */}
      <div className="relative">
        <label htmlFor="sport-search" className="sr-only">Pesquisar desporto</label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" aria-hidden="true" />
        <Input
          id="sport-search"
          type="search"
          placeholder="Pesquisar desporto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 text-sm"
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setSearchQuery('')}
            aria-label="Limpar pesquisa"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Favourites – horizontal scroll chips */}
      {!searchQuery && userInterestedSports.length > 0 && (
        <section aria-labelledby="fav-heading">
          <h3 id="fav-heading" className="text-sm font-semibold text-muted-foreground mb-2 px-0.5">
            ⭐ Os teus favoritos
          </h3>
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory"
            role="list"
            aria-label="Desportos favoritos"
          >
            {userInterestedSports.map(sport => (
              <button
                key={sport.id}
                role="listitem"
                onClick={() => setSelectedSport(sport)}
                className="flex items-center gap-2 shrink-0 snap-start px-3 py-2 bg-card border rounded-xl hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                aria-label={`${sport.name} – toca para ver detalhes`}
              >
                <span className="text-xl" role="img" aria-label={sport.name}>{sport.icon}</span>
                <span className="text-sm font-medium whitespace-nowrap">{sport.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* All Sports – compact grid */}
      <section aria-labelledby="all-heading">
        <h3 id="all-heading" className="text-sm font-semibold text-muted-foreground mb-2 px-0.5">
          {searchQuery ? `Resultados para "${searchQuery}"` : '🏅 Todos os desportos'}
        </h3>

        {filteredSports.length > 0 ? (
          <div className="grid grid-cols-3 gap-2" role="list" aria-label="Lista de desportos">
            {filteredSports.map(sport => (
              <button
                key={sport.id}
                role="listitem"
                onClick={() => setSelectedSport(sport)}
                className="flex flex-col items-center gap-1 p-3 bg-card border rounded-xl hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                aria-label={`${sport.name} – toca para ver detalhes`}
              >
                <span className="text-3xl" role="img" aria-label={sport.name}>{sport.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">{sport.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">Nenhum desporto encontrado.</p>
              <Button variant="outline" className="mt-3 h-9 text-sm" onClick={() => setSearchQuery('')}>
                Limpar pesquisa
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Sport Detail Sheet */}
      <SportDetailSheet sport={selectedSport} onClose={() => setSelectedSport(null)} />
    </div>
  );
}