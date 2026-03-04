import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { FaArrowLeft, FaMapPin, FaMagnifyingGlass, FaCompass, FaClock, FaEuroSign, FaUsers } from 'react-icons/fa6';
import { sports, sessions, getSportById } from '../data';

// Mock locations with coordinates (relative positions in % for fake map)
const locations = [
    { id: 'loc-1', name: 'Pavilhão Rosa Mota', address: 'Rua Rosa Mota, Aveiro', x: 42, y: 38, sportIds: ['hidroginastica', 'voleibol'], price: 8 },
    { id: 'loc-2', name: 'Centro Desportivo Municipal', address: 'Av. do Desporto, Aveiro', x: 60, y: 55, sportIds: ['pickleball', 'basquetebol'], price: 12 },
    { id: 'loc-3', name: 'Pavilhão Universitário', address: 'Universidade de Aveiro', x: 75, y: 30, sportIds: ['voleibol', 'basquetebol'], price: 5 },
    { id: 'loc-4', name: 'Ria de Aveiro', address: 'Cais da Fonte Nova', x: 30, y: 65, sportIds: ['trilho'], price: 5 },
    { id: 'loc-5', name: 'Pavilhão Central', address: 'Rua do Pavilhão, Aveiro', x: 55, y: 72, sportIds: ['futebol', 'basquetebol'], price: 10 },
    { id: 'loc-6', name: 'Passadiços de Aveiro', address: 'Marginal de Aveiro', x: 20, y: 50, sportIds: ['trilho'], price: 0 },
];

export default function MapPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<typeof locations[0] | null>(null);

    const filtered = locations.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.address.toLowerCase().includes(search.toLowerCase())
    );

    const getSportsForLocation = (sportIds: string[]) =>
        sportIds.map(id => sports.find(s => s.id === id)).filter(Boolean);

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="min-h-[44px] -ml-2">
                <FaArrowLeft className="w-4 h-4 mr-2" />Voltar
            </Button>

            <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <FaMapPin className="w-5 h-5 text-primary" />Mapa de Locais
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Encontra onde praticar desporto em Aveiro</p>
            </div>

            {/* Search */}
            <div className="relative">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Pesquisar local..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 h-10"
                    aria-label="Pesquisar local"
                />
            </div>

            {/* Fake Map */}
            <div
                className="relative w-full rounded-2xl overflow-hidden border border-border shadow-md"
                style={{ height: '320px' }}
                role="img"
                aria-label="Mapa de locais desportivos em Aveiro"
            >
                {/* Map background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950/30 dark:to-blue-950/30">
                    {/* Fake roads */}
                    <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="0.5" className="text-gray-500" />
                        <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.3" className="text-gray-400" />
                        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-gray-500" />
                        <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-gray-400" />
                        {/* Fake river/lagoon */}
                        <ellipse cx="20" cy="55" rx="12" ry="20" fill="#93c5fd" opacity="0.5" />
                        <text x="10" y="56" fontSize="3" fill="#1e40af" opacity="0.7">Ria de</text>
                        <text x="10" y="60" fontSize="3" fill="#1e40af" opacity="0.7">Aveiro</text>
                    </svg>
                    <p className="absolute bottom-2 right-3 text-xs text-muted-foreground/50">Mapa ilustrativo · Aveiro</p>
                </div>

                {/* Location pins */}
                {filtered.map(loc => (
                    <button
                        key={loc.id}
                        onClick={() => setSelected(loc)}
                        className="absolute -translate-x-1/2 -translate-y-full group focus:outline-none"
                        style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        aria-label={`${loc.name} – toca para ver detalhes`}
                    >
                        <div className={`flex flex-col items-center transition-transform group-hover:scale-110 ${selected?.id === loc.id ? 'scale-125' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${selected?.id === loc.id ? 'bg-primary' : 'bg-white dark:bg-card'}`}>
                                <FaMapPin className={`w-4 h-4 ${selected?.id === loc.id ? 'text-primary-foreground' : 'text-primary'}`} />
                            </div>
                            <div className={`text-xs font-semibold whitespace-nowrap bg-white/90 dark:bg-card/90 px-1.5 py-0.5 rounded shadow mt-0.5 max-w-[100px] truncate ${selected?.id === loc.id ? 'text-primary' : ''}`}>
                                {loc.name.split(' ').slice(0, 2).join(' ')}
                            </div>
                        </div>
                    </button>
                ))}

                {/* User location dot */}
                <div className="absolute" style={{ left: '50%', top: '50%' }}>
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" aria-label="A tua localização" />
                </div>
            </div>

            {/* Selected location detail */}
            {selected && (
                <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                                <h3 className="font-bold text-sm">{selected.name}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <FaCompass className="w-3 h-3" />{selected.address}
                                </p>
                            </div>
                            {selected.price > 0 && (
                                <Badge variant="secondary" className="shrink-0 flex items-center gap-0.5">
                                    <FaEuroSign className="w-3 h-3" />{selected.price}
                                </Badge>
                            )}
                        </div>
                        <div className="flex gap-1.5 flex-wrap mb-3">
                            {getSportsForLocation(selected.sportIds).map(s => s && (
                                <Badge key={s.id} variant="outline" className="text-xs gap-1">
                                    <span>{s.icon}</span>{s.name}
                                </Badge>
                            ))}
                        </div>
                        <Button size="sm" className="w-full" onClick={() => {
                            const sportId = selected.sportIds[0];
                            navigate(`/sport/${sportId}`);
                        }}>
                            Ver sessões neste local
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Locations list */}
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                    {filtered.length} local{filtered.length !== 1 ? 'is' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
                </h2>
                <div className="space-y-2">
                    {filtered.map(loc => (
                        <button
                            key={loc.id}
                            onClick={() => setSelected(selected?.id === loc.id ? null : loc)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary ${selected?.id === loc.id ? 'border-primary bg-primary/5' : 'bg-card'}`}
                            aria-pressed={selected?.id === loc.id}
                            aria-label={loc.name}
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                <FaMapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{loc.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{loc.address}</p>
                                <div className="flex gap-1 mt-1">
                                    {getSportsForLocation(selected?.id === loc.id ? loc.sportIds : loc.sportIds.slice(0, 2)).map(s => s && (
                                        <span key={s.id} className="text-xs">{s.icon}</span>
                                    ))}
                                </div>
                            </div>
                            {loc.price > 0 ? (
                                <span className="text-xs font-semibold text-muted-foreground shrink-0">{loc.price}€/sessão</span>
                            ) : (
                                <span className="text-xs text-green-600 dark:text-green-400 font-semibold shrink-0">Grátis</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
