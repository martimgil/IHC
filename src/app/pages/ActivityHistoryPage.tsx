import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaArrowLeft, FaPersonRunning, FaFire, FaStopwatch, FaCalendarDays, FaBolt, FaTrophy } from 'react-icons/fa6';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import StickyBackButton from '../components/StickyBackButton';
import {
    Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useUser } from '../context/UserContext';

export default function ActivityHistoryPage() {
    const navigate = useNavigate();
    const { sessionUser } = useUser();
    const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

    const historyData = sessionUser?.activityHistory || [];

    // Global Stats
    const totalMinutos = historyData.reduce((acc, curr) => acc + curr.duration, 0);
    const totalHoras = Math.floor(totalMinutos / 60);
    const rMaxMinutos = totalMinutos % 60;
    const totalTimeStr = rMaxMinutos > 0 ? `${totalHoras}h ${rMaxMinutos}m` : `${totalHoras}h`;

    const totalCalories = historyData.reduce((acc, curr) => acc + curr.calories, 0);
    const formattedCalories = totalCalories > 1000 ? `${(totalCalories / 1000).toFixed(1)}k` : totalCalories.toString();
    const totalSessions = historyData.length;

    // Chart data
    const chartDataWeek = [
        { name: 'Seg', minutos: 0 }, { name: 'Ter', minutos: 0 }, { name: 'Qua', minutos: 0 },
        { name: 'Qui', minutos: 0 }, { name: 'Sex', minutos: 0 }, { name: 'Sáb', minutos: 0 },
        { name: 'Dom', minutos: 0 },
    ];

    const chartDataMonth = [
        { name: 'S1', minutos: 0 }, { name: 'S2', minutos: 0 },
        { name: 'S3', minutos: 0 }, { name: 'S4', minutos: 0 },
    ];

    historyData.forEach(act => {
        const d = new Date(act.date);
        const diffTime = Math.abs(new Date().getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
            const dayIndex = d.getDay(); // 0 is Sunday, 1 is Mon
            const mappedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            chartDataWeek[mappedIndex].minutos += act.duration;
        }

        if (diffDays <= 28) {
            const weekIndex = Math.min(3, Math.floor(diffDays / 7));
            chartDataMonth[3 - weekIndex].minutos += act.duration; // S4 is latest
        }
    });

    const currentChartData = timeRange === 'week' ? chartDataWeek : chartDataMonth;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <StickyBackButton to="/profile" />

            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaPersonRunning className="w-7 h-7 text-primary" aria-hidden="true" />
                        Histórico e Estatísticas
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Monitoriza a tua evolução e atividades recentes.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/achievements')} className="shrink-0 gap-2">
                    <FaTrophy className="text-amber-500" /> Ver Conquistas
                </Button>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <FaStopwatch className="w-5 h-5 text-blue-500 mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Tempo Total</p>
                        <p className="text-xl font-bold">{totalTimeStr || '0h'}</p>
                    </CardContent>
                </Card>
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <FaFire className="w-5 h-5 text-orange-500 mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Calorias</p>
                        <p className="text-xl font-bold">{formattedCalories}</p>
                    </CardContent>
                </Card>
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <FaCalendarDays className="w-5 h-5 text-green-500 mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Sessões</p>
                        <p className="text-xl font-bold">{totalSessions}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FaBolt className="w-5 h-5 text-primary" /> Atividade
                        </CardTitle>
                        <div className="flex bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setTimeRange('week')}
                                className={`text-xs px-3 py-1 font-medium rounded-md transition-colors ${timeRange === 'week' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Semana
                            </button>
                            <button
                                onClick={() => setTimeRange('month')}
                                className={`text-xs px-3 py-1 font-medium rounded-md transition-colors ${timeRange === 'month' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Mês
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 h-64">
                    {/* Custom Strava-like Area Chart */}
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMinutos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="currentColor" opacity={0.1} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "currentColor", opacity: 0.7 }}
                                dy={10}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    borderRadius: '12px',
                                    border: '1px solid hsl(var(--border))',
                                    boxShadow: '0 10px 15px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                            />
                            <Area type="monotone" dataKey="minutos" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorMinutos)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Activity List */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold flex items-center justify-between">
                    Desempenho Recente
                    <span className="text-sm font-normal text-muted-foreground">{historyData.length} sessões listadas</span>
                </h2>

                {historyData.length === 0 ? (
                    <div className="text-center py-10 bg-card border rounded-xl shadow-sm text-muted-foreground">
                        <FaPersonRunning className="w-10 h-10 mx-auto opacity-20 mb-3" />
                        <p className="font-medium">Sem atividades recentes.</p>
                        <p className="text-xs mt-1">Regista a tua primeira atividade para veres as tuas estatísticas.</p>
                        <Button onClick={() => navigate('/map')} variant="outline" className="mt-4">Explorar Mapa</Button>
                    </div>
                ) : (
                    historyData.map(activity => (
                        <Card key={activity.id} className="hover:border-primary/50 transition-colors shadow-sm">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                                        <FaPersonRunning className="w-5 h-5 text-primary opacity-80" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{activity.type} &bull; <span className="text-muted-foreground text-sm font-normal">{new Date(activity.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}</span></h3>
                                        <p className="text-sm text-muted-foreground mt-0.5">{activity.location}</p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col gap-1">
                                    <Badge variant="secondary" className="justify-end self-end">{activity.duration} min</Badge>
                                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 justify-end mt-1"><FaFire className="w-3 h-3" /> {activity.calories} kcal</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
