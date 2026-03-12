import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { sports, getLevelLabel } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import {
  FaClock,
  FaCalendarDays,
  FaUsers,
  FaMapPin,
  FaCircleExclamation,
  FaCircleCheck
} from 'react-icons/fa6';
import StickyBackButton from '../components/StickyBackButton';
import { useLobbies } from '../context/LobbyContext';
import { useBookings } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import { Lobby, Player, ExperienceLevel } from '../types';
import { toast } from 'sonner';

export default function CreateUrgentEventPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addLobby } = useLobbies();
  const { addBooking } = useBookings();
  const { sessionUser } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialSportId = searchParams.get('sport') || '';

  const [formData, setFormData] = useState({
    sportId: initialSportId,
    date: '',
    time: '',
    location: '',
    level: 'intermedio' as ExperienceLevel,
    spotsNeeded: '1',
    notes: '',
    isUltimaHora: true,
  });

  const selectedSport = sports.find(s => s.id === formData.sportId);
  const minPlayersBySport = selectedSport?.minPlayers ?? 2;
  const maxPlayersBySport = selectedSport?.maxPlayers ?? 12;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sportId) newErrors.sportId = 'Selecione um desporto';
    if (!formData.date) newErrors.date = 'Selecione uma data';
    if (!formData.time) newErrors.time = 'Selecione uma hora';
    if (!formData.location.trim()) newErrors.location = 'Indique o local';

    const minParticipants = Number(formData.spotsNeeded);
    if (Number.isNaN(minParticipants)) {
      newErrors.spotsNeeded = 'Indique um número válido de participantes';
    } else {
      if (minParticipants < minPlayersBySport) {
        newErrors.spotsNeeded = `Este desporto requer pelo menos ${minPlayersBySport} participantes`;
      }
      if (minParticipants > maxPlayersBySport) {
        newErrors.spotsNeeded = `Este desporto permite no máximo ${maxPlayersBySport} participantes`;
      }
    }

    if (formData.date && formData.time) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      if (selectedDateTime < now) {
        newErrors.date = 'A data não pode ser no passado';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create the lobby object
    const newLobbyId = `lobby-${Date.now()}`;
    const me: Player = {
      id: sessionUser?.id || 'me',
      name: sessionUser?.name || 'Tu',
      level: formData.level,
      skillRating: 7
    };

    const newLobby: Lobby = {
      id: newLobbyId,
      sportId: formData.sportId,
      locationName: formData.location,
      locationAddress: formData.location, // simplified
      scheduledDate: formData.date,
      scheduledTime: formData.time,
      level: formData.level,
      currentPlayers: [me],
      minPlayers: Number(formData.spotsNeeded),
      maxPlayers: Math.max(Number(formData.spotsNeeded), maxPlayersBySport),
      pricePerPerson: 5, // default
      status: 'waiting',
      createdBy: me.id,
      isUrgent: formData.isUltimaHora,
      tags: formData.isUltimaHora ? ['Urgente', 'Prioridade alta'] : []
    };

    addLobby(newLobby);

    // Also add to bookings so it shows in "Reservas"
    addBooking({
      id: newLobbyId,
      sportId: formData.sportId,
      location: formData.location,
      date: formData.date,
      time: formData.time
    });

    setIsCreating(false);
    setEventCreated(true);
    toast.success('Evento criado com sucesso!');
  };

  if (eventCreated) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4" role="img" aria-label="Sucesso">
                <FaCircleCheck className="w-12 h-12 text-green-600" aria-hidden="true" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-900">Evento Criado!</CardTitle>
            <CardDescription className="text-green-800">
              Estamos a procurar jogadores disponíveis na sua área.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section className="bg-white rounded-lg p-4 space-y-2" aria-label="Detalhes do evento">
              <h3 className="font-semibold">Detalhes do Evento</h3>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium whitespace-nowrap">Desporto:</span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span>{sports.find(s => s.id === formData.sportId)?.icon}</span>
                    <span>{sports.find(s => s.id === formData.sportId)?.name}</span>
                  </span>
                </p>
                <p><span className="text-gray-600">Data:</span> {new Date(formData.date).toLocaleDateString('pt-PT')} às {formData.time}</p>
                <p><span className="text-gray-600">Local:</span> {formData.location}</p>
                <p><span className="text-gray-600">Participantes mínimos:</span> {formData.spotsNeeded}</p>
              </div>
            </section>

            <Alert className="border-blue-200 bg-blue-50">
              <FaCircleExclamation className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <AlertTitle className="text-blue-900">Notificaremos Você</AlertTitle>
              <AlertDescription className="text-blue-800">
                Receberá uma notificação assim que jogadores aceitarem o convite.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button className="w-full h-12" onClick={() => navigate('/')}>
                Voltar ao Início
              </Button>
              <Button variant="outline" className="w-full h-12" onClick={() => navigate('/notifications')}>
                Ver Notificações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <StickyBackButton />

      {/* Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-5" noValidate>
            {/* Sport Selection */}
            <div className="space-y-2">
              <Label htmlFor="sportId">
                Desporto <span className="text-red-600" aria-label="obrigatório">*</span>
              </Label>
              <Select
                value={formData.sportId}
                onValueChange={(value) => handleChange('sportId', value)}
              >
                <SelectTrigger
                  id="sportId"
                  className={`min-h-[44px] ${errors.sportId ? 'border-red-500' : ''}`}
                  aria-invalid={!!errors.sportId}
                  aria-describedby={errors.sportId ? 'sportId-error' : undefined}
                >
                  <SelectValue placeholder="Selecione o desporto" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map(sport => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.icon} {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sportId && (
                <p id="sportId-error" className="text-sm text-red-600" role="alert">
                  {errors.sportId}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Data <span className="text-red-600" aria-label="obrigatório">*</span>
                </Label>
                <div className="relative">
                  <FaCalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" aria-hidden="true" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={`pl-10 h-12 w-full appearance-none ${errors.date ? 'border-red-500' : ''}`}
                    required
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? 'date-error' : undefined}
                  />
                </div>
                {errors.date && (
                  <p id="date-error" className="text-sm text-red-600" role="alert">
                    {errors.date}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">
                  Hora <span className="text-red-600" aria-label="obrigatório">*</span>
                </Label>
                <div className="relative">
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" aria-hidden="true" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className={`pl-10 h-12 w-full appearance-none ${errors.time ? 'border-red-500' : ''}`}
                    required
                    aria-invalid={!!errors.time}
                    aria-describedby={errors.time ? 'time-error' : undefined}
                  />
                </div>
                {errors.time && (
                  <p id="time-error" className="text-sm text-red-600" role="alert">
                    {errors.time}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Localidade / Local <span className="text-red-600" aria-label="obrigatório">*</span>
              </Label>
              <div className="relative">
                <FaMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" aria-hidden="true" />
                <Input
                  id="location"
                  type="text"
                  placeholder="Ex: Aveiro, Pavilhão Rosa Mota"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className={`pl-10 h-12 ${errors.location ? 'border-red-500' : ''}`}
                  required
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'location-error' : undefined}
                />
              </div>
              {errors.location && (
                <p id="location-error" className="text-sm text-red-600" role="alert">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <Label htmlFor="level">
                Nível de Experiência <span className="text-red-600" aria-label="obrigatório">*</span>
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleChange('level', value)}
              >
                <SelectTrigger id="level" className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualquer">Qualquer Nível</SelectItem>
                  <SelectItem value="principiante">Principiante</SelectItem>
                  <SelectItem value="intermedio">Intermédio</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                  <SelectItem value="senior-federado">Sénior Federado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Spots Needed */}
            <div className="space-y-2">
              <Label htmlFor="spotsNeeded">
                Participantes Mínimos para Confirmar Atividade <span className="text-red-600" aria-label="obrigatório">*</span>
              </Label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" aria-hidden="true" />
                <Input
                  id="spotsNeeded"
                  type="number"
                  min={String(minPlayersBySport)}
                  max={String(maxPlayersBySport)}
                  value={formData.spotsNeeded}
                  onChange={(e) => handleChange('spotsNeeded', e.target.value)}
                  className={`pl-10 h-12 ${errors.spotsNeeded ? 'border-red-500' : ''}`}
                  required
                  aria-invalid={!!errors.spotsNeeded}
                  aria-describedby={errors.spotsNeeded ? 'spots-error' : 'spots-hint'}
                />
              </div>
              {errors.spotsNeeded && (
                <p id="spots-error" className="text-sm text-red-600" role="alert">
                  {errors.spotsNeeded}
                </p>
              )}
              <p id="spots-hint" className="text-xs text-gray-500">
                Para {selectedSport?.name || 'este desporto'}: mínimo {minPlayersBySport} e máximo {maxPlayersBySport} participantes.
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionais (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Ex: Precisamos de um atacante experiente..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                aria-describedby="notes-hint"
              />
              <p id="notes-hint" className="text-xs text-gray-500">
                Adicione detalhes que possam ajudar a encontrar o jogador ideal
              </p>
            </div>

            {/* Última Hora Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/40 gap-4 overflow-hidden">
              <div className="flex items-center gap-3 min-w-0">
                <FaClock className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-orange-900 dark:text-orange-100 truncate sm:whitespace-normal">Marcar como atividade urgente</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 line-clamp-2 md:line-clamp-none">Ativado: entra com prioridade alta e notifica jogadores próximos.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${formData.isUltimaHora ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}>
                  {formData.isUltimaHora ? 'Urgente: ON' : 'Urgente: OFF'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.isUltimaHora}
                  onClick={() => setFormData(prev => ({ ...prev, isUltimaHora: !prev.isUltimaHora }))}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 ${formData.isUltimaHora ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${formData.isUltimaHora ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg"
              disabled={isCreating}
              aria-label={isCreating ? 'A criar atividade' : 'Criar atividade'}
            >
              {isCreating ? (
                <>
                  <div
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                    aria-hidden="true"
                  />
                  <span aria-live="polite" aria-label="A processar">A Criar atividade...</span>
                </>
              ) : (
                <>
                  <FaClock className="w-5 h-5 mr-2" aria-hidden="true" />
                  Criar atividade
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}