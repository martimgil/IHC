import { useState } from 'react';
import { useNavigate } from 'react-router';
import { sports, lobbies, sessions } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { FaArrowLeft, FaMapPin, FaMagnifyingGlass, FaCompass, FaCalendarDays, FaUsers, FaEuroSign, FaChevronRight } from 'react-icons/fa6';
import StickyBackButton from '../components/StickyBackButton';
import { toast } from 'sonner';

export default function SearchLocationPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Mock locations near user
  const locations = [
    {
      id: 'loc-1',
      name: 'Pavilhão Rosa Mota',
      address: 'Rua Rosa Mota, Aveiro',
      distance: 0.5,
      availableSports: ['hidroginastica', 'voleibol', 'basquetebol', 'pickleball'],
    },
    {
      id: 'loc-2',
      name: 'Centro Desportivo Municipal',
      address: 'Av. do Desporto, Aveiro',
      distance: 1.2,
      availableSports: ['pickleball', 'basquetebol', 'voleibol', 'trilho'],
    },
    {
      id: 'loc-3',
      name: 'Pavilhão Universitário',
      address: 'Universidade de Aveiro',
      distance: 2.0,
      availableSports: ['voleibol', 'futebol', 'basquetebol', 'pickleball', 'trilho'],
    },
    {
      id: 'loc-4',
      name: 'Ria de Aveiro',
      address: 'Cais da Fonte Nova',
      distance: 1.5,
      availableSports: ['trilho'],
    },
  ];

  const filteredLocations = searchQuery
    ? locations.filter(loc =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : locations;

  const getActivitiesAtLocation = (locationName: string) => {
    const locationSessions = sessions.filter(s => s.locationName === locationName);
    const locationLobbies = lobbies.filter(l => l.locationName === locationName);
    return { sessions: locationSessions, lobbies: locationLobbies };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <StickyBackButton />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Procurar por Local</h1>
        <p className="text-muted-foreground">Encontre atividades desportivas perto de si</p>
      </div>

      {/* Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <label htmlFor="location-search" className="sr-only">Pesquisar local</label>
          <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <Input
            id="location-search"
            type="text"
            placeholder="Pesquisar local..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button variant="outline" className="w-full" onClick={() => {
          setSearchQuery('Universidade de Aveiro');
          toast.success('Localização detetada!', { description: 'Universidade de Aveiro' });
        }} aria-label="Usar a minha localização atual para pesquisar">
          <FaCompass className="w-4 h-4 mr-2" aria-hidden="true" />
          Usar Localização Atual
        </Button>
      </div>

      {/* Locations List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {searchQuery ? 'Resultados' : 'Locais Próximos'}
        </h2>
        {filteredLocations.length > 0 ? (
          <div className="space-y-3">
            {filteredLocations.map((location) => {
              const activities = getActivitiesAtLocation(location.name);
              const totalActivities = activities.sessions.length + activities.lobbies.length;
              const isExpanded = selectedLocation === location.id;

              return (
                <Card
                  key={location.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader
                    onClick={() => setSelectedLocation(isExpanded ? null : location.id)}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-label={`${location.name}, ${location.distance} km, ${totalActivities} atividade${totalActivities !== 1 ? 's' : ''}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedLocation(isExpanded ? null : location.id); } }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <FaMapPin className="w-3 h-3" aria-hidden="true" />
                          {location.address}
                        </CardDescription>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {location.availableSports.map(sportId => {
                            const sport = sports.find(s => s.id === sportId);
                            return sport ? (
                              <span key={sportId} className="text-sm" role="img" aria-label={sport.name}>
                                {sport.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary">{location.distance} km</Badge>
                        {totalActivities > 0 && (
                          <Badge className="bg-success text-success-foreground">
                            {totalActivities} atividade{totalActivities > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0 space-y-4">
                      {/* Available Sports */}
                      <div>
                        <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Desportos Disponíveis</h4>
                        <div className="flex flex-wrap gap-2">
                          {location.availableSports.map(sportId => {
                            const sport = sports.find(s => s.id === sportId);
                            return sport ? (
                              <Badge key={sportId} variant="outline">
                                {sport.icon} {sport.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>

                      {/* Sessions at location */}
                      {activities.sessions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Sessões Disponíveis</h4>
                          <div className="space-y-2">
                            {activities.sessions.map(session => (
                              <div
                                key={session.id}
                                className="flex items-center justify-between p-3 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
                                onClick={() => navigate(`/booking?session=${session.id}`)}
                              >
                                <div className="flex-1">
                                  <p className="font-semibold text-sm flex items-center gap-2">
                                    <span>{sports.find(s => s.id === session.sportId)?.icon}</span>
                                    <span>{sports.find(s => s.id === session.sportId)?.name}</span>
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <FaCalendarDays className="w-3 h-3" aria-hidden="true" />
                                      {new Date(session.date).toLocaleDateString('pt-PT')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FaUsers className="w-3 h-3" aria-hidden="true" />
                                      {session.availableSpots} vagas
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FaEuroSign className="w-3 h-3" aria-hidden="true" />
                                      {session.price.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <FaChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lobbies at location */}
                      {activities.lobbies.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Grupos Ativos</h4>
                          <div className="space-y-2">
                            {activities.lobbies.map(lobby => (
                              <div
                                key={lobby.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => navigate(`/lobby/${lobby.id}`)}
                              >
                                <div className="flex-1">
                                  <p className="font-semibold text-sm flex items-center gap-2">
                                    <span>{sports.find(s => s.id === lobby.sportId)?.icon}</span>
                                    <span>{sports.find(s => s.id === lobby.sportId)?.name}</span>
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <FaUsers className="w-3 h-3" />
                                      {lobby.currentPlayers.length}/{lobby.maxPlayers}
                                    </span>
                                    {lobby.scheduledDate && (
                                      <span className="flex items-center gap-1">
                                        <FaCalendarDays className="w-3 h-3" />
                                        {new Date(lobby.scheduledDate).toLocaleDateString('pt-PT')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {lobby.isUrgent && <Badge variant="destructive">Urgente</Badge>}
                                <FaChevronRight className="w-4 h-4 text-muted-foreground ml-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {totalActivities === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Nenhuma atividade disponível no momento
                        </p>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FaMapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
              <p>Nenhum local encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
