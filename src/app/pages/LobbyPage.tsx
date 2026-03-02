import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getLobbyById, getSportById, currentUser } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Euro,
  CheckCircle,
  Clock,
  Shield,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function LobbyPage() {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const [hasJoined, setHasJoined] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const lobby = getLobbyById(lobbyId || '');
  const sport = lobby ? getSportById(lobby.sportId) : null;

  if (!lobby || !sport) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lobby não encontrado.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Voltar ao Início
        </Button>
      </div>
    );
  }

  const spotsLeft = lobby.maxPlayers - lobby.currentPlayers.length;
  const progressPercentage = (lobby.currentPlayers.length / lobby.maxPlayers) * 100;
  const canJoin = lobby.status !== 'full' && !hasJoined;

  const handleJoinLobby = async () => {
    setIsProcessing(true);

    // Simulate joining process
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsProcessing(false);
    setHasJoined(true);

    toast.success('Juntaste-te ao grupo!', {
      description: 'Aguarda confirmação de que há jogadores suficientes.',
    });
  };

  // Generate balanced teams (mock implementation)
  const generateTeams = () => {
    if (lobby.currentPlayers.length < lobby.minPlayers) return null;

    const sortedPlayers = [...lobby.currentPlayers].sort((a, b) =>
      (b.skillRating || 0) - (a.skillRating || 0)
    );

    const team1: typeof lobby.currentPlayers = [];
    const team2: typeof lobby.currentPlayers = [];

    sortedPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        team1.push(player);
      } else {
        team2.push(player);
      }
    });

    return { team1, team2 };
  };

  const teams = lobby.status === 'confirmed' || lobby.status === 'full' ? generateTeams() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Lobby Header */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{sport.icon}</span>
                <CardTitle className="text-2xl">{sport.name}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {lobby.locationName} - {lobby.locationAddress}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              {lobby.isUrgent && (
                <Badge variant="destructive">Urgente</Badge>
              )}
              {lobby.status === 'full' && (
                <Badge variant="secondary">Completo</Badge>
              )}
              {lobby.status === 'confirmed' && (
                <Badge className="bg-success text-success-foreground">Confirmado</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lobby.scheduledDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">
                {new Date(lobby.scheduledDate).toLocaleDateString('pt-PT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} às {lobby.scheduledTime}
              </span>
            </div>
          )}

          {lobby.isRecurring && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-success font-semibold">
                Treino semanal todas as {lobby.recurringDay}s
              </span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="font-semibold">
                  {lobby.currentPlayers.length}/{lobby.maxPlayers} jogadores
                </span>
              </div>
              <Badge variant="outline">{lobby.level}</Badge>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {lobby.currentPlayers.length >= lobby.minPlayers
                ? `✓ Mínimo de jogadores atingido (${lobby.minPlayers})`
                : `Faltam ${lobby.minPlayers - lobby.currentPlayers.length} jogador(es) para o mínimo`
              }
            </p>
          </div>

          <div className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-lg p-3">
            <Euro className="w-5 h-5 text-success" />
            <div>
              <p className="font-bold text-success">
                {lobby.pricePerPerson.toFixed(2)}€ por pessoa
              </p>
              <p className="text-sm text-success/80">
                Total: {(lobby.pricePerPerson * lobby.maxPlayers).toFixed(2)}€ (aluguer do pavilhão)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Match Info */}
      {lobby.isUrgent && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-950 font-bold">Jogo Urgente</AlertTitle>
          <AlertDescription className="text-orange-900 font-medium">
            Este grupo precisa de um substituto de última hora. Junta-te rapidamente para ajudar!
          </AlertDescription>
        </Alert>
      )}

      {/* Materials Reminder */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-950 font-bold">Não t'Esqueças!</AlertTitle>
        <AlertDescription className="text-blue-900 font-medium">
          Materiais necessários: {sport.requiredMaterials.join(', ')}
        </AlertDescription>
      </Alert>

      {/* Join Status */}
      {hasJoined && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-950 font-bold">Estás no grupo!</AlertTitle>
          <AlertDescription className="text-green-900 font-medium">
            {lobby.currentPlayers.length >= lobby.minPlayers
              ? 'O grupo atingiu o número mínimo. Prepara-te para o pagamento.'
              : 'Aguarda até que mais jogadores se juntem ao grupo.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Current Players */}
      <Card>
        <CardHeader>
          <CardTitle>Jogadores no Grupo</CardTitle>
          <CardDescription>
            {lobby.currentPlayers.length} de {lobby.maxPlayers} vagas preenchidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lobby.currentPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-gray-600">{player.level}</p>
                </div>
                {index === 0 && (
                  <Badge variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Criador
                  </Badge>
                )}
                {player.skillRating && (
                  <Badge variant="secondary">
                    ⭐ {player.skillRating}/10
                  </Badge>
                )}
              </div>
            ))}

            {/* Empty spots */}
            {spotsLeft > 0 && Array.from({ length: Math.min(spotsLeft, 3) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-3 opacity-40">
                <Avatar>
                  <AvatarFallback className="bg-gray-100 text-gray-400">
                    ?
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-gray-400">Vaga disponível</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Balanced Teams */}
      {teams && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Equipas Balanceadas</CardTitle>
            <CardDescription className="text-green-700">
              Sugestão automática baseada nas habilidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-blue-700">🔵 Equipa Azul</h4>
              <div className="space-y-2">
                {teams.team1.map(player => (
                  <div key={player.id} className="flex items-center gap-2 bg-white rounded-lg p-2">
                    <span>{player.name}</span>
                    {player.skillRating && (
                      <span className="text-sm text-gray-600">⭐ {player.skillRating}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-red-700">🔴 Equipa Vermelha</h4>
              <div className="space-y-2">
                {teams.team2.map(player => (
                  <div key={player.id} className="flex items-center gap-2 bg-white rounded-lg p-2">
                    <span>{player.name}</span>
                    {player.skillRating && (
                      <span className="text-sm text-gray-600">⭐ {player.skillRating}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Join Button */}
      {canJoin && (
        <Button
          className="w-full h-12 text-lg"
          onClick={handleJoinLobby}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              A Juntar...
            </>
          ) : (
            <>
              Juntar-me ao Grupo
            </>
          )}
        </Button>
      )}

      {hasJoined && lobby.currentPlayers.length >= lobby.minPlayers && (
        <Button
          className="w-full h-12 text-lg"
          onClick={() => {
            toast.success('Pagamento confirmado!', {
              description: 'A tua vaga está garantida.',
            });
            navigate('/');
          }}
        >
          Confirmar Pagamento ({lobby.pricePerPerson.toFixed(2)}€)
        </Button>
      )}
    </div>
  );
}
