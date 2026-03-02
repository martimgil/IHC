import { useState } from 'react';
import { useNavigate } from 'react-router';
import { sports, currentUser } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userInterestedSports = sports.filter(sport =>
    currentUser.interestedSports.includes(sport.id)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section
        className="bg-primary rounded-xl p-6 text-primary-foreground"
        aria-labelledby="welcome-heading"
      >
        <h2 id="welcome-heading" className="text-2xl font-bold mb-2">
          Olá, {currentUser.name}! 👋
        </h2>
        <p className="opacity-90">Pronto para praticar desporto hoje?</p>
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="sr-only">Ações rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-2 border-orange-200 bg-orange-50 focus-within:ring-2 focus-within:ring-orange-500"
            onClick={() => navigate('/create-urgent')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/create-urgent');
              }
            }}
            aria-label="Criar evento urgente para procurar substituto"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" aria-hidden="true" />
                <CardTitle className="text-lg">Procuro Substituto</CardTitle>
              </div>
              <CardDescription>Encontra um jogador de última hora</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border-2 border-green-200 bg-green-50 focus-within:ring-2 focus-within:ring-green-500"
            onClick={() => navigate('/search-location')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/search-location');
              }
            }}
            aria-label="Procurar atividades por localização"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-6 h-6 text-green-600" aria-hidden="true" />
                <CardTitle className="text-lg">Procurar por Local</CardTitle>
              </div>
              <CardDescription>Encontra atividades perto de si</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Search Bar */}
      <div className="relative">
        <label htmlFor="sport-search" className="sr-only">
          Pesquisar desporto
        </label>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" />
        <Input
          id="sport-search"
          type="search"
          placeholder="Pesquisar desporto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="sr-only">
          Digite para filtrar os desportos disponíveis
        </span>
      </div>

      {/* User's Interested Sports */}
      {searchQuery === '' && userInterestedSports.length > 0 && (
        <section aria-labelledby="favorites-heading">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h3 id="favorites-heading" className="text-lg font-semibold">
              Os Seus Favoritos
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userInterestedSports.map((sport) => (
              <Card
                key={sport.id}
                className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] focus-within:ring-2 focus-within:ring-blue-500"
                onClick={() => navigate(`/sport/${sport.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/sport/${sport.id}`);
                  }
                }}
                aria-label={`${sport.name}: ${sport.description}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl" role="img" aria-label={sport.name}>
                      {sport.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{sport.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {sport.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {sport.minPlayers}-{sport.maxPlayers} jogadores
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Sports */}
      <section aria-labelledby="all-sports-heading">
        <h3 id="all-sports-heading" className="text-lg font-semibold mb-4">
          {searchQuery ? 'Resultados da Pesquisa' : 'Todos os Desportos'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSports.map((sport) => (
            <Card
              key={sport.id}
              className="cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] focus-within:ring-2 focus-within:ring-blue-500"
              onClick={() => navigate(`/sport/${sport.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/sport/${sport.id}`);
                }
              }}
              aria-label={`${sport.name}: ${sport.description}. ${sport.minPlayers} a ${sport.maxPlayers} jogadores`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl" role="img" aria-label={sport.name}>
                    {sport.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{sport.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {sport.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {sport.minPlayers}-{sport.maxPlayers} jogadores
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredSports.length === 0 && (
          <div
            className="text-center py-12 text-gray-500"
            role="status"
            aria-live="polite"
          >
            <p>Nenhum desporto encontrado para "{searchQuery}".</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Limpar pesquisa
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}