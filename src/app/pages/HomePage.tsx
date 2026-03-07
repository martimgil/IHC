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
import { FaMagnifyingGlass, FaUsers, FaBolt, FaDumbbell, FaXmark, FaStar, FaMedal, FaChevronDown } from 'react-icons/fa6';

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
      <SheetContent
        side="bottom"
        className="inset-x-4 bottom-4 w-[calc(100%-2rem)] mx-auto rounded-[2.5rem] border-2 border-border shadow-2xl p-6 px-1 transition-all duration-300"
      >
        <div className="overflow-y-auto max-h-[85dvh] px-5">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-6" />
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
                  <FaUsers className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-semibold">Jogadores</span>
                </div>
                <p className="text-sm font-bold">{sport.minPlayers}–{sport.maxPlayers}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <FaDumbbell className="w-4 h-4 text-primary" aria-hidden="true" />
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
                className="flex-1 h-12 text-sm font-bold"
                onClick={() => { onClose(); navigate(`/sport/${sport.id}`); }}
                aria-label={`Ver sessões de ${sport.name}`}
              >
                Sessões Abertas
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 text-sm font-bold border-primary text-primary"
                onClick={() => { onClose(); navigate(`/create-urgent?sport=${sport.id}`); }}
                aria-label={`Criar nova sessão de ${sport.name}`}
              >
                Criar Sessão
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { sessionUser } = useUser();

  const userInterestedSports = sports
    .filter(sport => (sessionUser?.interestedSports ?? currentUser.interestedSports).includes(sport.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const remainingSports = sports
    .filter(sport => !userInterestedSports.find(s => s.id === sport.id))
    .filter(sport => sport.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      {/* Favourites Section */}
      {
        userInterestedSports.length > 0 && (
          <section aria-labelledby="fav-heading" className="mt-6">
            <h3 id="fav-heading" className="text-xl font-bold mb-4 px-0.5 flex items-center gap-2">
              Desportos Favoritos
            </h3>
            <div className="grid grid-cols-2 gap-3" role="list">
              {userInterestedSports.map(sport => (
                <button
                  key={sport.id}
                  role="listitem"
                  onClick={() => setSelectedSport(sport)}
                  className="flex items-center gap-3 p-4 bg-card border-2 border-border/70 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[64px] active:scale-[0.98]"
                >
                  <span className="text-3xl shrink-0" role="img">{sport.icon}</span>
                  <span className="text-base font-bold leading-tight">{sport.name}</span>
                </button>
              ))}
            </div>
          </section>
        )
      }

      <section aria-labelledby="all-heading" className="mt-8">
        <h3 id="all-heading" className="text-xl font-bold mb-5 px-0.5 flex items-center gap-2">
          Todos os desportos
        </h3>

        {/* Search */}
        <div className="relative mb-6">
          <label htmlFor="sport-search" className="sr-only">Pesquisar outros desportos</label>
          <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" aria-hidden="true" />
          <Input
            id="sport-search"
            type="search"
            placeholder="Pesquisar outros desportos"
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
              <FaXmark className="w-4 h-4" />
            </button>
          )}
        </div>

        {remainingSports.length > 0 ? (
          <div className="grid grid-cols-3 gap-3" role="list" aria-label="Lista de desportos">
            {remainingSports.map(sport => (
              <button
                key={sport.id}
                role="listitem"
                onClick={() => setSelectedSport(sport)}
                className="flex flex-col items-center justify-center p-4 bg-card border-2 border-border/70 rounded-[1.5rem] hover:border-primary hover:bg-primary/5 transition-all shadow-sm active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-primary group min-h-[100px]"
                aria-label={`${sport.name} – toca para ver detalhes`}
              >
                <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300" role="img" aria-label={sport.name}>{sport.icon}</span>
                <span className="text-[13px] font-extrabold text-foreground tracking-normal text-center leading-tight">{sport.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">Nenhum desporto adicional encontrado.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Sport Detail Sheet */}
      <SportDetailSheet sport={selectedSport} onClose={() => setSelectedSport(null)} />
    </div >
  );
}