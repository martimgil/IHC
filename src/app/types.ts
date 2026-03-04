// Types for the sports booking application

export type ExperienceLevel =
  | 'principiante'
  | 'intermedio'
  | 'avancado'
  | 'senior-federado'
  | 'qualquer';

export type Sport = {
  id: string;
  name: string;
  icon: any;
  description: string;
  requiredMaterials: string[];
  minPlayers: number;
  maxPlayers: number;
  recommendedPlayers?: number;
  difficulty: ExperienceLevel[];
};

export type Session = {
  id: string;
  sportId: string;
  locationName: string;
  locationAddress: string;
  date: string;
  time: string;
  duration: number; // in minutes
  price: number;
  availableSpots: number;
  totalSpots: number;
  level: ExperienceLevel;
  isUrgent?: boolean;
  tags?: string[];
};

export type Lobby = {
  id: string;
  sportId: string;
  locationName: string;
  locationAddress: string;
  scheduledDate?: string;
  scheduledTime?: string;
  level: ExperienceLevel;
  currentPlayers: Player[];
  minPlayers: number;
  maxPlayers: number;
  pricePerPerson: number;
  status: 'waiting' | 'confirmed' | 'full';
  createdBy: string;
  isRecurring?: boolean;
  recurringDay?: string;
  isUrgent?: boolean;
  tags?: string[];
};

export type Player = {
  id: string;
  name: string;
  avatar?: string;
  level: ExperienceLevel;
  skillRating?: number; // 1-10 for team balancing
};

export type Notification = {
  id: string;
  type: 'session-available' | 'lobby-full' | 'booking-failed' | 'alternative-suggestion' | 'urgent-match' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  interestedSports: string[];
  experienceLevels: Record<string, ExperienceLevel>;
  location: string;
};

export type Booking = {
  id: string;
  userId: string;
  sessionId?: string;
  lobbyId?: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
};
