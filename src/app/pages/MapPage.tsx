import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { FaMapPin, FaMagnifyingGlass, FaCompass, FaEuroSign } from 'react-icons/fa6';
import StickyBackButton from '../components/common/StickyBackButton';
import { sports, sessions } from '../lib/data';

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
        <div className="max-w-3xl mx-auto space-y-4">
            <StickyBackButton />

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

            {/* Realistic Map */}
            <div
                className="relative w-full rounded-2xl overflow-hidden border border-border shadow-md"
                style={{ height: '370px' }}
                role="img"
                aria-label="Mapa de locais desportivos em Aveiro"
            >
                {/* Map background */}
                <div className="absolute inset-0 bg-[#e8f0e0] dark:bg-[#1a2a1a]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
                        {/* Water - Ria de Aveiro */}
                        <path d="M0,80 Q10,75 15,85 Q20,100 18,120 Q16,140 20,160 Q25,175 15,190 L0,200 L0,80Z" fill="#7cc8e8" opacity="0.55" />
                        <path d="M15,85 Q25,90 30,100 Q35,115 32,130 Q28,145 35,160 Q42,175 35,190 L20,190 Q25,175 20,160 Q16,140 18,120 Q20,100 15,85Z" fill="#9bd4ef" opacity="0.4" />
                        <path d="M0,60 Q8,55 12,65 Q15,78 15,85 Q10,75 0,80Z" fill="#7cc8e8" opacity="0.45" />
                        {/* Small canal */}
                        <path d="M30,100 Q45,95 60,100 Q65,102 60,105 Q45,100 30,105Z" fill="#7cc8e8" opacity="0.35" />

                        {/* Green areas / Parks */}
                        <ellipse cx="140" cy="45" rx="18" ry="12" fill="#6db86b" opacity="0.3" />
                        <ellipse cx="165" cy="70" rx="10" ry="8" fill="#6db86b" opacity="0.25" />
                        <ellipse cx="45" cy="150" rx="8" ry="6" fill="#6db86b" opacity="0.3" />
                        <rect x="155" y="35" width="20" height="15" rx="4" fill="#6db86b" opacity="0.2" />

                        {/* Main roads */}
                        <line x1="40" y1="0" x2="40" y2="200" stroke="#c4c4c4" strokeWidth="1.8" opacity="0.7" className="dark:stroke-gray-600" />
                        <line x1="80" y1="0" x2="80" y2="200" stroke="#c4c4c4" strokeWidth="1.2" opacity="0.5" className="dark:stroke-gray-600" />
                        <line x1="120" y1="0" x2="120" y2="200" stroke="#c4c4c4" strokeWidth="1.5" opacity="0.6" className="dark:stroke-gray-600" />
                        <line x1="160" y1="0" x2="160" y2="200" stroke="#c4c4c4" strokeWidth="1" opacity="0.4" className="dark:stroke-gray-600" />
                        <line x1="0" y1="50" x2="200" y2="50" stroke="#c4c4c4" strokeWidth="1.5" opacity="0.6" className="dark:stroke-gray-600" />
                        <line x1="0" y1="100" x2="200" y2="100" stroke="#c4c4c4" strokeWidth="1.8" opacity="0.7" className="dark:stroke-gray-600" />
                        <line x1="0" y1="140" x2="200" y2="140" stroke="#c4c4c4" strokeWidth="1.2" opacity="0.5" className="dark:stroke-gray-600" />
                        <line x1="30" y1="170" x2="200" y2="170" stroke="#c4c4c4" strokeWidth="1" opacity="0.4" className="dark:stroke-gray-600" />

                        {/* Secondary roads */}
                        <line x1="60" y1="20" x2="60" y2="180" stroke="#d4d4d4" strokeWidth="0.6" opacity="0.4" className="dark:stroke-gray-700" />
                        <line x1="100" y1="30" x2="100" y2="190" stroke="#d4d4d4" strokeWidth="0.6" opacity="0.4" className="dark:stroke-gray-700" />
                        <line x1="140" y1="10" x2="140" y2="200" stroke="#d4d4d4" strokeWidth="0.6" opacity="0.4" className="dark:stroke-gray-700" />
                        <line x1="180" y1="30" x2="180" y2="190" stroke="#d4d4d4" strokeWidth="0.6" opacity="0.4" className="dark:stroke-gray-700" />
                        <line x1="35" y1="75" x2="200" y2="75" stroke="#d4d4d4" strokeWidth="0.6" opacity="0.4" className="dark:stroke-gray-700" />
                        <line x1="40" y1="120" x2="200" y2="120" stroke="#d4d4d4" strokeWidth="0.6" opacity="0.4" className="dark:stroke-gray-700" />

                        {/* City blocks (buildings) */}
                        <rect x="43" y="53" width="14" height="18" rx="1.5" fill="#d6c9b8" opacity="0.5" className="dark:fill-gray-700" />
                        <rect x="63" y="53" width="14" height="18" rx="1.5" fill="#d1c4b3" opacity="0.45" className="dark:fill-gray-700" />
                        <rect x="43" y="78" width="14" height="18" rx="1.5" fill="#cfc2b0" opacity="0.4" className="dark:fill-gray-700" />
                        <rect x="63" y="78" width="14" height="18" rx="1.5" fill="#d6c9b8" opacity="0.5" className="dark:fill-gray-700" />
                        <rect x="83" y="53" width="14" height="18" rx="1.5" fill="#cdbfae" opacity="0.45" className="dark:fill-gray-700" />
                        <rect x="83" y="78" width="14" height="18" rx="1.5" fill="#d1c4b3" opacity="0.4" className="dark:fill-gray-700" />
                        <rect x="103" y="53" width="14" height="18" rx="1.5" fill="#d6c9b8" opacity="0.5" className="dark:fill-gray-700" />
                        <rect x="103" y="78" width="14" height="18" rx="1.5" fill="#cfc2b0" opacity="0.45" className="dark:fill-gray-700" />
                        <rect x="123" y="103" width="14" height="14" rx="1.5" fill="#d6c9b8" opacity="0.4" className="dark:fill-gray-700" />
                        <rect x="143" y="103" width="14" height="14" rx="1.5" fill="#cdbfae" opacity="0.45" className="dark:fill-gray-700" />
                        <rect x="43" y="103" width="14" height="14" rx="1.5" fill="#d1c4b3" opacity="0.4" className="dark:fill-gray-700" />
                        <rect x="63" y="103" width="14" height="14" rx="1.5" fill="#d6c9b8" opacity="0.45" className="dark:fill-gray-700" />
                        <rect x="83" y="103" width="14" height="14" rx="1.5" fill="#cfc2b0" opacity="0.4" className="dark:fill-gray-700" />
                        <rect x="103" y="143" width="14" height="22" rx="1.5" fill="#d6c9b8" opacity="0.5" className="dark:fill-gray-700" />
                        <rect x="123" y="143" width="14" height="22" rx="1.5" fill="#cdbfae" opacity="0.4" className="dark:fill-gray-700" />
                        <rect x="143" y="143" width="14" height="22" rx="1.5" fill="#d1c4b3" opacity="0.45" className="dark:fill-gray-700" />

                        {/* University campus area */}
                        <rect x="135" y="25" width="30" height="20" rx="3" fill="#b8d4a8" opacity="0.4" stroke="#7cb86b" strokeWidth="0.5" />
                        <text x="150" y="37" fontSize="3.5" fill="#2d6b2a" opacity="0.8" textAnchor="middle" fontWeight="bold" className="dark:fill-green-400">Univ. Aveiro</text>

                        {/* Street labels */}
                        <text x="40" y="48" fontSize="2.5" fill="#666" opacity="0.7" textAnchor="middle" className="dark:fill-gray-400">Av. da Universidade</text>
                        <text x="90" y="98" fontSize="2.5" fill="#666" opacity="0.7" textAnchor="middle" className="dark:fill-gray-400">Av. Dr. Lourenço Peixinho</text>
                        <text x="55" y="138" fontSize="2.5" fill="#666" opacity="0.7" textAnchor="middle" className="dark:fill-gray-400">Rua de Aveiro</text>

                        {/* Water labels */}
                        <text x="12" y="105" fontSize="4" fill="#1e5a8a" opacity="0.6" textAnchor="middle" fontStyle="italic" className="dark:fill-blue-400">Ria</text>
                        <text x="12" y="112" fontSize="4" fill="#1e5a8a" opacity="0.6" textAnchor="middle" fontStyle="italic" className="dark:fill-blue-400">de</text>
                        <text x="12" y="119" fontSize="4" fill="#1e5a8a" opacity="0.6" textAnchor="middle" fontStyle="italic" className="dark:fill-blue-400">Aveiro</text>

                        {/* Compass icon */}
                        <text x="190" y="15" fontSize="6" fill="#888" opacity="0.5" textAnchor="middle" className="dark:fill-gray-500">N↑</text>
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

                {/* User location dot - at University of Aveiro */}
                <div className="absolute" style={{ left: '75%', top: '28%' }}>
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" aria-label="A tua localização" />
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap bg-white/80 dark:bg-card/80 px-1 rounded">Tu</div>
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
                        <div className="flex flex-col gap-2">
                            {getSportsForLocation(selected.sportIds).map(s => s && (
                                <Button key={s.id} size="sm" variant="secondary" className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20" onClick={() => navigate(`/sport/${s.id}`)}>
                                    <span className="text-base" aria-hidden="true">{s.icon}</span>
                                    <span>Ver sessões de <span className="font-bold">{s.name}</span></span>
                                </Button>
                            ))}
                        </div>
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
                                <span className="text-xs font-semibold text-muted-foreground shrink-0">{loc.price}€/atividade</span>
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
