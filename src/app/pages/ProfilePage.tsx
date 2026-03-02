import { currentUser, sports, getLevelLabel } from '../data';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Settings,
  Heart,
  CheckCircle
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();

  const userSports = sports.filter(sport =>
    currentUser.interestedSports.includes(sport.id)
  );

  const mockBookings = [
    {
      id: '1',
      sportId: 'hidroginastica',
      location: 'Pavilhão Rosa Mota',
      date: '2026-02-26',
      time: '19:00',
      status: 'confirmed',
    },
    {
      id: '2',
      sportId: 'pickleball',
      location: 'Centro Desportivo Municipal',
      date: '2026-02-26',
      time: '18:30',
      status: 'confirmed',
    },
    {
      id: '3',
      sportId: 'trilho',
      location: 'Passadiços de Aveiro',
      date: '2026-03-01',
      time: '10:00',
      status: 'confirmed',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Início
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUser.location}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* My Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Minhas Reservas
              </CardTitle>
              <CardDescription>Próximas atividades agendadas</CardDescription>
            </div>
            <Badge className="bg-green-600">
              {mockBookings.length} ativa{mockBookings.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockBookings.map((booking) => {
            const sport = sports.find(s => s.id === booking.sportId);
            return (
              <div
                key={booking.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-3xl" role="img" aria-label={sport?.name}>
                  {sport?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{sport?.name}</p>
                  <p className="text-sm text-gray-600">{booking.location}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString('pt-PT')} às {booking.time}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Sports Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Desportos de Interesse
          </CardTitle>
          <CardDescription>Desportos que gosta de praticar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userSports.map((sport) => (
              <div
                key={sport.id}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                onClick={() => navigate(`/sport/${sport.id}`)}
              >
                <div className="text-3xl">{sport.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold">{sport.name}</p>
                  <Badge variant="outline" className="mt-1">
                    {getLevelLabel(currentUser.experienceLevels[sport.id] || 'iniciante')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => navigate('/')}
          >
            Adicionar Mais Desportos
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-gray-600">Atividades Completas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-gray-600">Reservas Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-3xl font-bold">{userSports.length}</p>
            <p className="text-sm text-gray-600">Desportos Favoritos</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Preferências de Notificação
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <MapPin className="w-4 h-4 mr-2" />
            Alterar Localização
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            Terminar Sessão
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
