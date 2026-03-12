import { useState } from 'react';
import { useNavigate } from 'react-router';
import { sports, currentUser } from '../data';
import { useUser } from '../context/UserContext';
import { Sport } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { FaMagnifyingGlass, FaUsers, FaDumbbell, FaXmark } from 'react-icons/fa6';

function SportDetailSheet({
  sport,
  onClose,
}: {
  readonly sport: Sport | null;
  readonly onClose: () => void;
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
                <SheetDescription className="text-sm mt-0.5">{sport.description}</SheetDescription>
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
                aria-label={`Ver ativades de ${sport.name}`}
              >
                Atividades Abertas
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 text-sm font-bold border-primary text-primary"
                onClick={() => { onClose(); navigate(`/create-urgent?sport=${sport.id}`); }}
                aria-label={`Criar nova atividade de ${sport.name}`}
              >
                Criar atividade
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function HomePage() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { sessionUser } = useUser();
  const firstName = (sessionUser?.name ?? currentUser.name).split(' ')[0];

  const userInterestedSports = sports
    .filter(sport => (sessionUser?.interestedSports ?? currentUser.interestedSports).includes(sport.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const remainingSports = sports
    .filter(sport => !userInterestedSports.some(s => s.id === sport.id))
    .filter(sport => sport.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Welcome banner */}
      <section
        className="px-2 pt-2 pb-0 relative overflow-hidden"
        aria-labelledby="welcome-heading"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 id="welcome-heading" className="font-extrabold text-2xl leading-tight flex items-center gap-2">
              Olá, {firstName}!
            </h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">O que vais querer praticar?</p>
          </div>
          <Avatar className="w-12 h-12 shadow-sm border border-border/50">
            <AvatarImage src={sessionUser?.avatar || currentUser.avatar} alt={firstName} />
            <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Separator placed closely hereafter */}
        <Separator className="w-16 h-1 mt-6 ml-2 bg-border/60 rounded-full" />
      </section>

      {/* Favourites Section */}
      {userInterestedSports.length > 0 && (
        <section aria-labelledby="fav-heading">
          <h3 id="fav-heading" className="text-lg font-bold mb-3 px-0.5 flex items-center gap-2 text-gray-600">
            Desportos Favoritos
          </h3>
          <ul className="grid grid-cols-2 gap-3">
            {userInterestedSports.map(sport => (
              <li key={sport.id}>
                <button
                  onClick={() => setSelectedSport(sport)}
                  className="w-full flex items-center gap-3 p-4 bg-card rounded-2xl transition-all text-left shadow-[0_4px_20px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary min-h-[64px] active:scale-[0.98] border border-transparent hover:border-primary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                >
                  <span className="text-3xl shrink-0" role="img">{sport.icon}</span>
                  <span className="text-base font-bold leading-tight">{sport.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="all-heading">
        <h3 id="all-heading" className="text-lg font-bold mb-3 px-0.5 flex items-center gap-2 text-gray-600">
          Todos os desportos
        </h3>

        {/* Search */}
        <div className="relative mb-3">
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
          <ul className="grid grid-cols-3 gap-3" aria-label="Lista de desportos">
            {remainingSports.map(sport => (
              <li key={sport.id}>
                <button
                  onClick={() => setSelectedSport(sport)}
                  className="w-full flex flex-col items-center justify-center p-4 bg-card rounded-[1.5rem] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-primary group min-h-[100px] border border-transparent hover:border-primary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                  aria-label={`${sport.name} – toca para ver detalhes`}
                >
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300" role="img" aria-label={sport.name}>{sport.icon}</span>
                  <span className="text-[13px] font-extrabold text-foreground tracking-normal text-center leading-tight">{sport.name}</span>
                </button>
              </li>
            ))}
          </ul>
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
    </div>
  );
}