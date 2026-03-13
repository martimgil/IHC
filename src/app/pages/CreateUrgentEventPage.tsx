import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { sports, getLevelLabel } from '../lib/data';
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
import StickyBackButton from '../components/common/StickyBackButton';
import { useAtividades } from '../context/AtividadeContext';
import { useBookings } from '../context/BookingContext';
import { useUser } from '../context/UserContext';
import { Atividade, Player, ExperienceLevel } from '../lib/types';
import { toast } from 'sonner';

export default function CreateUrgentEventPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { adicionarAtividade } = useAtividades();
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

    // Create the atividade object
    const novaAtividadeId = `atividade-${Date.now()}`;
    const me: Player = {
      id: sessionUser?.id || 'me',
      name: sessionUser?.name || 'Tu',
      level: formData.level,
      skillRating: 7
    };

    const novaAtividade: Atividade = {
      id: novaAtividadeId,
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

    adicionarAtividade(novaAtividade);

    // Also add to bookings so it shows in "Reservas"
    addBooking({
      id: novaAtividadeId,
      sportId: formData.sportId,
      location: formData.location,
      date: formData.date,
      time: formData.time
    });

    setIsCreating(false);
    setEventCreated(true);
    toast.success('A atividade foi criada com sucesso!');
  };

  if (eventCreated) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-500/30 bg-green-50/30 dark:bg-green-950/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4" role="img" aria-label="Sucesso">
                <FaCircleCheck className="w-12 h-12 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-900 dark:text-green-100">Atividade Criada!</CardTitle>
            <CardDescription className="text-green-800 dark:text-green-200">
              Estamos a procurar jogadores disponíveis na sua área.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg p-4 space-y-2" aria-label="Detalhes da atividade">
              <h3 className="font-semibold text-gray-900 dark:text-white">Detalhes da Atividade</h3>
              <div className="space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-400 font-medium whitespace-nowrap">Desporto:</span>
                  <span className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                    <span>{sports.find(s => s.id === formData.sportId)?.icon}</span>
                    <span>{sports.find(s => s.id === formData.sportId)?.name}</span>
                  </span>
                </p>
                <p className="text-gray-700 dark:text-gray-400"><span className="text-gray-900 dark:text-white font-medium">Data:</span> {new Date(formData.date).toLocaleDateString('pt-PT')} às {formData.time}</p>
                <p className="text-gray-700 dark:text-gray-400"><span className="text-gray-900 dark:text-white font-medium">Local:</span> {formData.location}</p>
                <p className="text-gray-700 dark:text-gray-400"><span className="text-gray-900 dark:text-white font-medium">Participantes mínimos:</span> {formData.spotsNeeded}</p>
              </div>
            </section>

            <Alert className="border-blue-500/30 bg-blue-50/30 dark:bg-blue-950/20">
              <FaCircleExclamation className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <AlertTitle className="text-blue-900 dark:text-blue-100">Notificaremos Você</AlertTitle>
              <AlertDescription className="text-blue-800 dark:text-blue-200">
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
            <div className="flex items-center justify-between px-4 py-2 rounded-xl border-2 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/40 gap-4 overflow-hidden">
              <div className="flex items-center gap-3 min-w-0">
                <FaClock className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-orange-900 dark:text-orange-100 truncate sm:whitespace-normal">Marcar como atividade urgente</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 line-clamp-2 md:line-clamp-none">Prioridade alta e notificação automática.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${formData.isUltimaHora ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}>
                  {formData.isUltimaHora ? 'Urgente: ON' : 'Urgente: OFF'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.isUltimaHora}
                  onClick={() => setFormData(prev => ({ ...prev, isUltimaHora: !prev.isUltimaHora }))}
                  className={`relative transition-colors duration-200 focus:outline-none ${formData.isUltimaHora ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  style={{ width: '25px', height: '15px', borderRadius: '10px', minWidth: '20px', minHeight: '10px', padding: '0', border: 'none' }}
                >
                  <span
                    className={`absolute bg-white rounded-full shadow-md transition-transform duration-200 ${formData.isUltimaHora ? '' : ''
                      }`}
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      top: '3.5px', 
                      left: '2px',
                      transform: formData.isUltimaHora ? 'translateX(13px)' : 'translateX(0)' 
                    }}
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