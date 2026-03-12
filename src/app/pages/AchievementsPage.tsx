import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FaTrophy, FaLock, FaStar, FaFire, FaBolt, FaHeart, FaMapPin, FaUsers, FaComments } from 'react-icons/fa6';
import StickyBackButton from '../components/StickyBackButton';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    unlockedAt?: string;
    category: string;
    rarity: 'comum' | 'raro' | 'épico' | 'lendário';
    progressTotal?: number;
    progress?: { current: number; total: number };
}

const achievementsData: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
    // Atividade
    {
        id: 'first-session',
        title: 'Primeira Atividade',
        description: 'Participaste na tua primeira atividade desportiva',
        icon: <FaStar className="w-6 h-6" />,
        category: 'Atividade',
        rarity: 'comum',
    },
    {
        id: 'five-sessions',
        title: 'Veterano',
        description: 'Completa 5 atividades desportivas',
        icon: <FaFire className="w-6 h-6" />,
        category: 'Atividade',
        rarity: 'comum',
        progressTotal: 5,
    },
    {
        id: 'ten-sessions',
        title: 'Entusiasta',
        description: 'Completa 10 atividades desportivas',
        icon: <FaBolt className="w-6 h-6" />,
        category: 'Atividade',
        rarity: 'raro',
        progressTotal: 10,
    },
    {
        id: 'twenty-sessions',
        title: 'Maratonista',
        description: 'Completa 20 atividades desportivas',
        icon: <FaTrophy className="w-6 h-6" />,
        category: 'Atividade',
        rarity: 'épico',
        progressTotal: 20,
    },
    // Social
    {
        id: 'first-activity-join',
        title: 'Espírito de Equipa',
        description: 'Juntaste-te à tua primeira atividade',
        icon: <FaUsers className="w-6 h-6" />,
        category: 'Social',
        rarity: 'comum',
    },
    {
        id: 'first-chat-message',
        title: 'Quebra-gelo',
        description: 'Enviaste a tua primeira mensagem no chat de uma atividade',
        icon: <FaComments className="w-6 h-6" />,
        category: 'Social',
        rarity: 'comum',
    },
    {
        id: 'ten-chat-messages',
        title: 'Comunicador',
        description: 'Envia 10 mensagens no chat de atividades',
        icon: <FaComments className="w-6 h-6" />,
        category: 'Social',
        rarity: 'raro',
        progressTotal: 10,
    },
    // Exploração
    {
        id: 'first-sport',
        title: 'Explorador',
        description: 'Experimenta um novo desporto',
        icon: <FaMapPin className="w-6 h-6" />,
        category: 'Exploração',
        rarity: 'comum',
    },
    {
        id: 'three-sports',
        title: 'Polivalente',
        description: 'Pratica 3 desportos diferentes',
        icon: <FaHeart className="w-6 h-6" />,
        category: 'Exploração',
        rarity: 'raro',
    },
    {
        id: 'all-sports',
        title: 'Atleta Completo',
        description: 'Experimenta todos os desportos disponíveis',
        icon: <FaTrophy className="w-6 h-6" />,
        category: 'Exploração',
        rarity: 'lendário',
        progressTotal: 6,
    },
];

const rarityConfig: Record<string, { label: string; colors: string }> = {
    comum: { label: 'Comum', colors: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300' },
    raro: { label: 'Raro', colors: 'bg-cyan-100 dark:bg-cyan-900 border-cyan-400 dark:border-cyan-600 text-cyan-800 dark:text-cyan-200' },
    épico: { label: 'Épico', colors: 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300' },
    lendário: { label: 'Lendário', colors: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300' },
};

const rarityBadgeColors: Record<string, string> = {
    comum: 'bg-gray-500',
    raro: 'bg-cyan-600',
    épico: 'bg-purple-600',
    lendário: 'bg-amber-500',
};

import { useUser } from '../context/UserContext';

export default function AchievementsPage() {
    const { sessionUser } = useUser();

    // Add reactivity per user logged in
    const unlockedList = sessionUser?.unlockedAchievements || [];
    const progList = sessionUser?.achievementProgress || {};

    const achievements: Achievement[] = achievementsData.map(a => ({
        ...a,
        unlocked: unlockedList.includes(a.id),
        progress: a.progressTotal ? { current: progList[a.id] || 0, total: a.progressTotal } : undefined
    }));

    const categories = [...new Set(achievements.map(a => a.category))];
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <StickyBackButton to="/profile" />

            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaTrophy className="w-7 h-7 text-amber-500" aria-hidden="true" />
                        Conquistas
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {unlockedCount} de {achievements.length} desbloqueadas
                    </p>
                </div>
                {/* Overall Progress */}
                <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {Math.round((unlockedCount / achievements.length) * 100)}%
                    </span>
                </div>
            </div>

            {/* Achievements by Category */}
            {categories.map(category => {
                const catAchievements = achievements.filter(a => a.category === category);
                const catUnlocked = catAchievements.filter(a => a.unlocked).length;

                return (
                    <section key={category} aria-labelledby={`cat-${category}`}>
                        <div className="flex items-center justify-between mb-3">
                            <h2 id={`cat-${category}`} className="text-lg font-semibold">
                                {category}
                            </h2>
                            <span className="text-sm text-muted-foreground">
                                {catUnlocked}/{catAchievements.length}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {catAchievements.map(achievement => {
                                const rarity = rarityConfig[achievement.rarity];
                                return (
                                    <Card
                                        key={achievement.id}
                                        className={`border-2 transition-all ${achievement.unlocked ? rarity.colors : 'opacity-60 border-border'}`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div
                                                    className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${achievement.unlocked
                                                        ? 'bg-white/70 dark:bg-black/20'
                                                        : 'bg-muted'
                                                        }`}
                                                    aria-hidden="true"
                                                >
                                                    {achievement.unlocked ? (
                                                        <span className={
                                                            achievement.rarity === 'lendário' ? 'text-amber-600 dark:text-amber-400' :
                                                                achievement.rarity === 'épico' ? 'text-purple-600 dark:text-purple-400' :
                                                                    achievement.rarity === 'raro' ? 'text-cyan-600 dark:text-cyan-400' :
                                                                        'text-gray-600 dark:text-gray-300'
                                                        }>
                                                            {achievement.icon}
                                                        </span>
                                                    ) : (
                                                        <FaLock className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h3 className="font-semibold text-sm leading-tight">
                                                            {achievement.title}
                                                        </h3>
                                                        <Badge
                                                            className={`text-xs shrink-0 text-white ${rarityBadgeColors[achievement.rarity]}`}
                                                        >
                                                            {rarity.label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2 leading-snug">
                                                        {achievement.description}
                                                    </p>

                                                    {/* Progress bar (if applicable and not unlocked) */}
                                                    {achievement.progress && !achievement.unlocked && (
                                                        <div className="space-y-1">
                                                            <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary rounded-full transition-all"
                                                                    style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                {achievement.progress.current}/{achievement.progress.total}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Unlocked date */}
                                                    {achievement.unlocked && achievement.unlockedAt && (
                                                        <p className="text-xs text-muted-foreground/70">
                                                            Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString('pt-PT')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
