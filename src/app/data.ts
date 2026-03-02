import { Sport, Session, Lobby, User, Notification, Player } from './types';

// Mock sports data
export const sports: Sport[] = [
  {
    id: 'hidroginastica',
    name: 'Hidroginástica',
    icon: '🏊',
    description: 'Exercícios aeróbicos na água, ideal para todas as idades',
    requiredMaterials: ['Fato de banho', 'Touca', 'Toalha'],
    minPlayers: 5,
    maxPlayers: 20,
    difficulty: ['principiante', 'intermedio'],
  },
  {
    id: 'voleibol',
    name: 'Voleibol',
    icon: '🏐',
    description: 'Desporto de equipa dinâmico e competitivo',
    requiredMaterials: ['Sapatilhas', 'Roupa desportiva', 'Joelheiras (opcional)'],
    minPlayers: 6,
    maxPlayers: 12,
    difficulty: ['principiante', 'intermedio', 'avancado', 'senior-federado'],
  },
  {
    id: 'basquetebol',
    name: 'Basquetebol',
    icon: '🏀',
    description: 'Jogo rápido de equipa com muita ação',
    requiredMaterials: ['Sapatilhas', 'Roupa desportiva'],
    minPlayers: 6,
    maxPlayers: 10,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'pickleball',
    name: 'Pickleball',
    icon: '🏓',
    description: 'Mistura de ténis, badminton e ténis de mesa',
    requiredMaterials: ['Sapatilhas', 'Roupa desportiva', 'Raquete (fornecida)'],
    minPlayers: 2,
    maxPlayers: 4,
    difficulty: ['principiante', 'intermedio'],
  },
  {
    id: 'trilho',
    name: 'Trilho',
    icon: '⛰️',
    description: 'Caminhadas em natureza, adequado para todas as idades',
    requiredMaterials: ['Calçado adequado', 'Água', 'Protetor solar'],
    minPlayers: 1,
    maxPlayers: 30,
    difficulty: ['qualquer'],
  },
  {
    id: 'futebol',
    name: 'Futebol',
    icon: '⚽',
    description: 'O desporto mais popular do mundo',
    requiredMaterials: ['Sapatilhas/Chuteiras', 'Roupa desportiva', 'Caneleiras'],
    minPlayers: 6,
    maxPlayers: 14,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
];

// Mock sessions data
export const sessions: Session[] = [
  {
    id: 'session-1',
    sportId: 'hidroginastica',
    locationName: 'Pavilhão Rosa Mota',
    locationAddress: 'Rua Rosa Mota, Aveiro',
    date: '2026-02-26',
    time: '19:00',
    duration: 60,
    price: 8,
    availableSpots: 1,
    totalSpots: 15,
    level: 'principiante',
  },
  {
    id: 'session-2',
    sportId: 'pickleball',
    locationName: 'Centro Desportivo Municipal',
    locationAddress: 'Av. do Desporto, Aveiro',
    date: '2026-02-26',
    time: '18:30',
    duration: 90,
    price: 12,
    availableSpots: 2,
    totalSpots: 4,
    level: 'principiante',
  },
  {
    id: 'session-3',
    sportId: 'trilho',
    locationName: 'Ria de Aveiro',
    locationAddress: 'Partida: Cais da Fonte Nova',
    date: '2026-03-01',
    time: '10:00',
    duration: 120,
    price: 5,
    availableSpots: 12,
    totalSpots: 25,
    level: 'qualquer',
  },
];

// Mock lobbies data
export const lobbies: Lobby[] = [
  {
    id: 'lobby-1',
    sportId: 'voleibol',
    locationName: 'Pavilhão Universitário',
    locationAddress: 'Universidade de Aveiro',
    scheduledDate: '2026-03-05',
    scheduledTime: '20:00',
    level: 'qualquer',
    currentPlayers: [
      { id: 'p1', name: 'João Silva', level: 'intermedio', skillRating: 6 },
      { id: 'p2', name: 'Maria Santos', level: 'principiante', skillRating: 4 },
      { id: 'p3', name: 'Pedro Costa', level: 'intermedio', skillRating: 7 },
    ],
    minPlayers: 6,
    maxPlayers: 12,
    pricePerPerson: 5,
    status: 'waiting',
    createdBy: 'Eduardo OrangeTree',
  },
  {
    id: 'lobby-2',
    sportId: 'voleibol',
    locationName: 'Pavilhão Central',
    locationAddress: 'Rua do Pavilhão, Aveiro',
    scheduledDate: '2026-02-26',
    scheduledTime: '19:00',
    level: 'intermedio',
    currentPlayers: [
      { id: 'p4', name: 'Eduardo OrangeTree', level: 'senior-federado', skillRating: 9 },
      { id: 'p5', name: 'Ana Oliveira', level: 'avancado', skillRating: 8 },
      { id: 'p6', name: 'Carlos Pereira', level: 'intermedio', skillRating: 6 },
      { id: 'p7', name: 'Sofia Lima', level: 'intermedio', skillRating: 6 },
      { id: 'p8', name: 'Miguel Ferreira', level: 'avancado', skillRating: 7 },
    ],
    minPlayers: 6,
    maxPlayers: 10,
    pricePerPerson: 6,
    status: 'waiting',
    createdBy: 'Eduardo OrangeTree',
    isUrgent: true,
    tags: ['Urgente', 'Substituto'],
  },
];

// Mock current user
export const currentUser: User = {
  id: 'user-alice',
  name: 'Alice PineTree',
  email: 'alice@example.com',
  interestedSports: ['hidroginastica', 'basquetebol', 'pickleball', 'trilho'],
  experienceLevels: {
    hidroginastica: 'principiante',
    basquetebol: 'intermedio',
    pickleball: 'principiante',
    trilho: 'qualquer',
  },
  location: 'Aveiro',
};

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'session-available',
    title: 'Sessão Disponível!',
    message: 'Há uma sessão de hidroginástica disponível no Pavilhão Rosa Mota às 19:00 hoje.',
    timestamp: new Date().toISOString(),
    read: false,
    actionUrl: '/booking?session=session-1',
    actionLabel: 'Ver Sessão',
  },
  {
    id: 'notif-2',
    type: 'reminder',
    title: 'Não se Esqueça!',
    message: 'Lembre-se de levar: Fato de banho e Touca para a hidroginástica',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    read: false,
  },
];

// Utility functions
export function getSportById(id: string): Sport | undefined {
  return sports.find(s => s.id === id);
}

export function getSessionById(id: string): Session | undefined {
  return sessions.find(s => s.id === id);
}

export function getLobbyById(id: string): Lobby | undefined {
  return lobbies.find(l => l.id === id);
}

export function getSessionsBySport(sportId: string): Session[] {
  return sessions.filter(s => s.sportId === sportId);
}

export function getLobbiesBySport(sportId: string): Lobby[] {
  return lobbies.filter(l => l.sportId === sportId);
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    'principiante': 'Principiante',
    'intermedio': 'Intermédio',
    'avancado': 'Avançado',
    'senior-federado': 'Sénior Federado',
    'qualquer': 'Qualquer Nível',
  };
  return labels[level] || level;
}
