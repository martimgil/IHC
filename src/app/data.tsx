import { Sport, Session, Lobby, User, Notification } from './types';
import { FaPersonSwimming, FaVolleyball, FaBasketball, FaTableTennisPaddleBall, FaPersonHiking, FaFutbol, FaPersonRunning, FaFootball, FaPersonBiking, FaPersonWalking } from 'react-icons/fa6';
import { GiTennisRacket, GiRollerSkate, GiSoccerField } from 'react-icons/gi';
import { MdSurfing, MdSportsHandball, MdSportsTennis } from 'react-icons/md';
import React from 'react';

const createIcon = (IconComponent: any) => <IconComponent className="w-[1em] h-[1em]" />;

// Mock sports data
export const sports: Sport[] = [
  {
    id: 'hidroginastica',
    name: 'Hidroginástica',
    icon: createIcon(FaPersonSwimming),
    description: 'Exercícios aeróbicos na água, ideal para todas as idades',
    requiredMaterials: ['Fato de banho', 'Touca', 'Toalha'],
    minPlayers: 5,
    maxPlayers: 20,
    recommendedPlayers: 12,
    difficulty: ['principiante', 'intermedio'],
  },
  {
    id: 'voleibol',
    name: 'Voleibol',
    icon: createIcon(FaVolleyball),
    description: 'Desporto de equipa dinâmico e competitivo',
    requiredMaterials: ['Sapatilhas', 'Roupa desportiva', 'Joelheiras (opcional)'],
    minPlayers: 6,
    maxPlayers: 12,
    recommendedPlayers: 12,
    difficulty: ['principiante', 'intermedio', 'avancado', 'senior-federado'],
  },
  {
    id: 'basquetebol',
    name: 'Basquetebol',
    icon: createIcon(FaBasketball),
    description: 'Jogo rápido de equipa com muita ação',
    requiredMaterials: ['Sapatilhas', 'Roupa desportiva'],
    minPlayers: 6,
    maxPlayers: 10,
    recommendedPlayers: 10,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'pickleball',
    name: 'Pickleball',
    icon: createIcon(FaTableTennisPaddleBall),
    description: 'Mistura de ténis, badminton e ténis de mesa',
    requiredMaterials: ['Sapatilhas', 'Roupa desportiva', 'Raquete (fornecida)'],
    minPlayers: 2,
    maxPlayers: 4,
    recommendedPlayers: 4,
    difficulty: ['principiante', 'intermedio'],
  },
  {
    id: 'trilho',
    name: 'Trilho',
    icon: createIcon(FaPersonHiking),
    description: 'Caminhadas em natureza, adequado para todas as idades',
    requiredMaterials: ['Calçado adequado', 'Água', 'Protetor solar'],
    minPlayers: 1,
    maxPlayers: 30,
    recommendedPlayers: 10,
    difficulty: ['qualquer'],
  },
  {
    id: 'futebol',
    name: 'Futebol',
    icon: createIcon(FaFutbol),
    description: 'O desporto mais popular do mundo',
    requiredMaterials: ['Sapatilhas/Chuteiras', 'Roupa desportiva', 'Caneleiras'],
    minPlayers: 6,
    maxPlayers: 14,
    recommendedPlayers: 14,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'tenis',
    name: 'Ténis',
    icon: createIcon(GiTennisRacket),
    description: 'Desporto individual ou de pares com raquete e bola',
    requiredMaterials: ['Raquete', 'Sapatilhas', 'Roupa desportiva'],
    minPlayers: 2,
    maxPlayers: 4,
    recommendedPlayers: 2,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'padel',
    name: 'Padel',
    icon: createIcon(MdSportsTennis),
    description: 'Desporto de raquete em campo fechado, jogado em pares',
    requiredMaterials: ['Raquete de padel', 'Sapatilhas', 'Roupa desportiva'],
    minPlayers: 4,
    maxPlayers: 4,
    recommendedPlayers: 4,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'rugby',
    name: 'Rugby',
    icon: createIcon(FaFootball),
    description: 'Desporto de contacto com grande espírito de equipa',
    requiredMaterials: ['Botas de rugby', 'Protetor bucal', 'Roupa desportiva'],
    minPlayers: 10,
    maxPlayers: 15,
    recommendedPlayers: 15,
    difficulty: ['principiante', 'intermedio', 'avancado', 'senior-federado'],
  },
  {
    id: 'natacao',
    name: 'Natação',
    icon: createIcon(FaPersonSwimming),
    description: 'Treino de natação em piscina, para todos os níveis',
    requiredMaterials: ['Fato de banho', 'Touca', 'Óculos de natação', 'Toalha'],
    minPlayers: 1,
    maxPlayers: 8,
    recommendedPlayers: 6,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'ciclismo',
    name: 'Ciclismo',
    icon: createIcon(FaPersonBiking),
    description: 'Passeios e treinos de bicicleta em grupo',
    requiredMaterials: ['Bicicleta', 'Capacete', 'Roupa desportiva', 'Água'],
    minPlayers: 1,
    maxPlayers: 20,
    recommendedPlayers: 8,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'surf',
    name: 'Surf',
    icon: createIcon(MdSurfing),
    description: 'Aulas e sessões de surf nas melhores ondas',
    requiredMaterials: ['Prancha de surf', 'Fato de neoprene', 'Protetor solar'],
    minPlayers: 1,
    maxPlayers: 10,
    recommendedPlayers: 6,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'hoquei-patins',
    name: 'Hóquei em Patins',
    icon: createIcon(GiRollerSkate),
    description: 'Desporto de equipa sobre patins com stick e bola',
    requiredMaterials: ['Patins', 'Stick', 'Caneleiras', 'Capacete'],
    minPlayers: 6,
    maxPlayers: 10,
    recommendedPlayers: 10,
    difficulty: ['principiante', 'intermedio', 'avancado', 'senior-federado'],
  },
  {
    id: 'andebol',
    name: 'Andebol',
    icon: createIcon(MdSportsHandball),
    description: 'Desporto de equipa dinâmico jogado com as mãos',
    requiredMaterials: ['Sapatilhas', 'Roupa desportiva'],
    minPlayers: 8,
    maxPlayers: 14,
    recommendedPlayers: 14,
    difficulty: ['principiante', 'intermedio', 'avancado', 'senior-federado'],
  },
  {
    id: 'futsal',
    name: 'Futsal',
    icon: createIcon(GiSoccerField),
    description: 'Futebol de pavilhão com equipas de 5 jogadores',
    requiredMaterials: ['Sapatilhas de futsal', 'Roupa desportiva', 'Caneleiras'],
    minPlayers: 6,
    maxPlayers: 10,
    recommendedPlayers: 10,
    difficulty: ['principiante', 'intermedio', 'avancado', 'senior-federado'],
  },
  {
    id: 'futebol-praia',
    name: 'Futebol de Praia',
    icon: createIcon(FaFutbol),
    description: 'Futebol na areia, jogado descalço junto ao mar',
    requiredMaterials: ['Roupa desportiva', 'Protetor solar', 'Água'],
    minPlayers: 6,
    maxPlayers: 10,
    recommendedPlayers: 10,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'corrida',
    name: 'Corrida',
    icon: createIcon(FaPersonRunning),
    description: 'Corrida ao ar livre em grupo, para todos os ritmos',
    requiredMaterials: ['Sapatilhas de corrida', 'Roupa desportiva', 'Água'],
    minPlayers: 1,
    maxPlayers: 30,
    recommendedPlayers: 10,
    difficulty: ['principiante', 'intermedio', 'avancado'],
  },
  {
    id: 'caminhada',
    name: 'Caminhada',
    icon: createIcon(FaPersonWalking),
    description: 'Caminhadas tranquilas em grupo, ideais para socializar',
    requiredMaterials: ['Calçado confortável', 'Água', 'Protetor solar'],
    minPlayers: 1,
    maxPlayers: 30,
    recommendedPlayers: 12,
    difficulty: ['qualquer'],
  },
];

// Mock all users in the system
export const mockUsers: User[] = [
  {
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
  },
  {
    id: 'p1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    interestedSports: ['voleibol', 'futebol'],
    experienceLevels: { voleibol: 'intermedio', futebol: 'intermedio' },
    location: 'Aveiro',
  },
  {
    id: 'p2',
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    interestedSports: ['hidroginastica'],
    experienceLevels: { hidroginastica: 'principiante' },
    location: 'Aveiro',
  },
  {
    id: 'p3',
    name: 'Pedro Costa',
    email: 'pedro.costa@example.com',
    interestedSports: ['voleibol', 'basquetebol'],
    experienceLevels: { voleibol: 'intermedio', basquetebol: 'intermedio' },
    location: 'Ílhavo',
  },
  {
    id: 'p4',
    name: 'Eduardo OrangeTree',
    email: 'eduardo@example.com',
    interestedSports: ['voleibol', 'padel'],
    experienceLevels: { voleibol: 'senior-federado', padel: 'avancado' },
    location: 'Aveiro',
  },
  {
    id: 'p5',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@example.com',
    interestedSports: ['voleibol', 'basquetebol'],
    experienceLevels: { voleibol: 'avancado', basquetebol: 'avancado' },
    location: 'Aveiro',
  },
  {
    id: 'p6',
    name: 'Carlos Pereira',
    email: 'carlos.p@example.com',
    interestedSports: ['futebol', 'futsal'],
    experienceLevels: { futebol: 'intermedio', futsal: 'intermedio' },
    location: 'Porto',
  },
  {
    id: 'p7',
    name: 'Sofia Lima',
    email: 'sofia.l@example.com',
    interestedSports: ['pickleball', 'tenis'],
    experienceLevels: { pickleball: 'intermedio', tenis: 'intermedio' },
    location: 'Aveiro',
  },
  {
    id: 'p8',
    name: 'Miguel Ferreira',
    email: 'miguel.f@example.com',
    interestedSports: ['voleibol'],
    experienceLevels: { voleibol: 'avancado' },
    location: 'Aveiro',
  },
  {
    id: 'p9',
    name: 'Tiago Silva',
    email: 'tiago.s@example.com',
    interestedSports: ['voleibol'],
    experienceLevels: { voleibol: 'avancado' },
    location: 'Aveiro',
  },
  {
    id: 'req-1',
    name: 'Marta Rodrigues',
    email: 'marta.r@example.com',
    interestedSports: ['voleibol', 'andebol'],
    experienceLevels: { voleibol: 'intermedio', andebol: 'intermedio' },
    location: 'Coimbra',
  },
  {
    id: 'user-10',
    name: 'Ricardo Sousa',
    email: 'ricardo.s@example.com',
    interestedSports: ['ciclismo', 'trilho'],
    experienceLevels: { ciclismo: 'avancado', trilho: 'avancado' },
    location: 'Viseu',
  },
  {
    id: 'user-11',
    name: 'Beatriz Almeida',
    email: 'beatriz.a@example.com',
    interestedSports: ['surf', 'natacao'],
    experienceLevels: { surf: 'principiante', natacao: 'intermedio' },
    location: 'Aveiro',
  }
];

// Mock current user
export const currentUser: User = mockUsers[0];

// Mock sessions data
export const sessions: Session[] = [
  {
    id: 'session-1',
    sportId: 'hidroginastica',
    locationName: 'Pavilhão Rosa Mota',
    locationAddress: 'Rua Rosa Mota, Aveiro',
    date: '2026-03-08',
    time: '19:00',
    duration: 60,
    price: 8,
    availableSpots: 0,
    totalSpots: 15,
    level: 'principiante',
  },
  {
    id: 'session-2',
    sportId: 'pickleball',
    locationName: 'Centro Desportivo Municipal',
    locationAddress: 'Av. do Desporto, Aveiro',
    date: '2026-03-08',
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
    date: '2026-03-09',
    time: '10:00',
    duration: 120,
    price: 5,
    availableSpots: 12,
    totalSpots: 25,
    level: 'qualquer',
  },
  {
    id: 'session-4',
    sportId: 'voleibol',
    locationName: 'Pavilhão de Desportos',
    locationAddress: 'Alameda da Universidade',
    date: '2026-03-10',
    time: '17:00',
    duration: 60,
    price: 15,
    availableSpots: 6,
    totalSpots: 12,
    level: 'intermedio',
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
    createdBy: 'p1',
  },
  {
    id: 'lobby-2',
    sportId: 'voleibol',
    locationName: 'Pavilhão Central',
    locationAddress: 'Rua do Pavilhão, Aveiro',
    scheduledDate: '2026-03-08',
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
    createdBy: 'p4',
    isUrgent: true,
    tags: ['Urgente', 'Substituto'],
  },
  {
    id: 'lobby-3',
    sportId: 'voleibol',
    locationName: 'Pavilhão Rosa Mota',
    locationAddress: 'Rua Rosa Mota, Aveiro',
    scheduledDate: '2026-03-11',
    scheduledTime: '21:00',
    level: 'senior-federado',
    currentPlayers: [
      { id: 'p9', name: 'Tiago Silva', level: 'avancado', skillRating: 8 },
    ],
    minPlayers: 6,
    maxPlayers: 12,
    pricePerPerson: 4,
    status: 'waiting',
    createdBy: 'p9',
  },
  {
    id: 'lobby-alice-hydro',
    sportId: 'hidroginastica',
    locationName: 'Pavilhão Rosa Mota',
    locationAddress: 'Rua Rosa Mota, Aveiro',
    scheduledDate: '2026-03-08',
    scheduledTime: '19:00',
    level: 'principiante',
    currentPlayers: mockUsers.slice(0, 14).map(u => ({ id: u.id, name: u.name, level: 'principiante' })),
    minPlayers: 5,
    maxPlayers: 15,
    pricePerPerson: 8,
    status: 'full',
    createdBy: 'sys',
  },
  {
    id: 'lobby-eduardo-vacation',
    sportId: 'voleibol',
    locationName: 'Pavilhão de Peniche',
    locationAddress: 'Peniche, Portugal',
    scheduledDate: '2026-03-15',
    scheduledTime: '10:00',
    level: 'qualquer',
    currentPlayers: [
      { id: 'p4', name: 'Eduardo OrangeTree', level: 'senior-federado', skillRating: 9 },
    ],
    minPlayers: 4,
    maxPlayers: 10,
    pricePerPerson: 3,
    status: 'waiting',
    createdBy: 'p4',
    tags: ['Férias', 'Social'],
  }
];

// Mock followers/following data using IDs from mockUsers
export const mockFollowing: string[] = ['p1', 'p5', 'p4'];
export const mockFollowers: string[] = ['p1', 'p3', 'p6', 'p7', 'req-1'];

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
    data: { sportId: 'hidroginastica' }
  },
  {
    id: 'notif-2',
    type: 'reminder',
    title: 'Não se Esqueça!',
    message: 'Lembre-se de levar: Fato de banho e Touca para a hidroginástica',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    read: false,
    data: { sportId: 'hidroginastica' }
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
