import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { FaHeartPulse, FaPeopleGroup, FaTrophy, FaArrowRight, FaCalendarCheck, FaChartLine, FaSun, FaMoon, FaCircleQuestion } from 'react-icons/fa6';
import { useRef, useState } from 'react';
import HelpSheet from '../components/HelpSheet';

export default function LandingPage() {
    const { theme, toggleTheme } = useTheme();
    const [helpOpen, setHelpOpen] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start end", "end start"] });
    const yVal = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20 overflow-x-hidden font-sans" ref={targetRef}>
            {/* Navbar */}
            <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={theme === 'dark' ? "/icon-dark.svg" : "/icon.svg"} alt="logótipo matchIn" className="h-8 w-auto object-contain" />
                        <span className="font-extrabold tracking-tight text-xl">matchIn</span>
                    </div>
                    <nav className="flex items-center gap-3 md:gap-6 text-sm font-medium">
                        <div className="flex items-center gap-1 mr-2">
                            <button
                                onClick={() => setHelpOpen(true)}
                                className="p-2 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center text-foreground"
                                aria-label="Ajuda"
                                title="Ajuda"
                            >
                                <FaCircleQuestion className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2 hover:bg-accent rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center text-foreground"
                                aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                                title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                            >
                                {theme === 'dark' ? <FaSun className="w-5 h-5" aria-hidden="true" /> : <FaMoon className="w-5 h-5" aria-hidden="true" />}
                            </button>
                        </div>
                        <Link to="/welcome" className="flex items-center h-9 text-muted-foreground hover:text-foreground transition-colors hidden md:flex focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2">Como Funciona</Link>
                        <Link to="/login" className="flex items-center h-9 text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-2 mt-0.5">Entrar</Link>
                        <Button asChild size="sm" className="rounded-full shadow-lg shadow-primary/20">
                            <Link to="/welcome">Descobrir matchIn</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main id="main-content" className="flex-1 pt-16" role="main">
                <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-32 sm:pb-32 lg:pb-40">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px] animate-pulse" />
                        <div className="absolute top-[40%] text-border w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
                        <div className="absolute left-[30%] w-[1px] h-full bg-gradient-to-b from-transparent via-border to-transparent" />
                    </div>

                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-3xl mx-auto space-y-8"
                        >
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-balance leading-[1.1]">
                                O desporto não tem <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-blue-600">de parar</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground font-medium text-balance max-w-2xl mx-auto leading-relaxed">
                                A matchIn liga-te aos melhores parceiros, atividades desportivas e campos perto de ti. Mantém-te ativo, foca-te na diversão e deixa a logística connosco.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 group">
                                    <Link to="/register">
                                        Criar conta grátis
                                        <FaArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full">
                                    <Link to="/welcome">Ver experiência</Link>
                                </Button>
                            </div>
                        </motion.div>

                        {/* Floating elements representing features */}
                        <motion.div style={{ y: yVal }} className="mt-20 max-w-5xl mx-auto relative hidden md:block">
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-full" />
                            <div className="grid grid-cols-3 gap-6 opacity-60">
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm transform -rotate-6 translate-y-12">
                                    <FaCalendarCheck className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                                    <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                                    <div className="h-3 w-1/2 bg-muted/50 rounded" />
                                </div>
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl transform -translate-y-4">
                                    <img src={theme === 'dark' ? "/icon-dark.svg" : "/icon.svg"} alt="" aria-hidden="true" className="w-12 h-12 mb-4" />
                                    <div className="h-4 w-5/6 bg-muted rounded mb-2" />
                                    <div className="h-3 w-2/3 bg-primary/20 rounded" />
                                </div>
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm transform rotate-6 translate-y-16">
                                    <FaPeopleGroup className="w-10 h-10 text-primary mb-4" aria-hidden="true" />
                                    <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                                    <div className="h-3 w-1/2 bg-muted/50 rounded" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="bg-muted/30 py-24 sm:py-32 border-y border-border/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">Desenhado para desportistas</h2>
                            <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                                Tudo o que precisas para organizares os teus jogos, reunido numa única plataforma intuitiva.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <FaHeartPulse className="w-6 h-6 text-rose-500" aria-hidden="true" />,
                                    title: "Encontra o Match Perfeito",
                                    description: "Procuras parceiros para jogar Ténis ou Padel? O nosso lobby junta jogadores com o mesmo nível de experiência e disponibilidade."
                                },
                                {
                                    icon: <FaCalendarCheck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
                                    title: "Marcações Simples",
                                    description: "Explora o mapa interativo, verifica a disponibilidade dos espaços em tempo real e faz a reserva num instante."
                                },
                                {
                                    icon: <FaChartLine className="w-6 h-6 text-green-500" aria-hidden="true" />,
                                    title: "Monitoriza e Evolui",
                                    description: "Regista as tuas atividades, observa o teu aumento de skill ao longo do tempo e ganha conquistas exclusivas."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="bg-card shadow-lg shadow-black/5 dark:shadow-white/5 border border-border/50 rounded-3xl p-8 hover:border-primary/50 transition-colors">
                                    <div className="h-14 w-14 bg-background border border-border/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background border-t border-border/50 py-12 text-center text-muted-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                        <img src={theme === 'dark' ? "/icon-dark.svg" : "/icon.svg"} alt="" aria-hidden="true" className="h-6 w-auto grayscale" />
                        <span className="font-bold tracking-tight text-foreground">matchIn</span>
                    </div>
                    <p className="text-sm font-medium">© 2026 matchIn Platform. Protótipo para Interação Humano-Computador.</p>
                </div>
            </footer>
            {/* Help Sheet */}
            <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
        </div>
    );
}
