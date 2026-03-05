import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { FaHeart, FaMapLocationDot, FaTrophy, FaArrowRight, FaSun, FaMoon, FaCircleQuestion, FaArrowLeft } from 'react-icons/fa6';
import { useState } from 'react';
import HelpSheet from '../components/HelpSheet';

export default function WelcomePage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [helpOpen, setHelpOpen] = useState(false);

    const features = [
        {
            icon: <FaMapLocationDot className="w-8 h-8 text-primary" aria-hidden="true" />,
            title: 'Encontra o teu espaço',
            description: 'Descobre os melhores pavilhões e campos perto de ti para praticar os teus desportos favoritos.',
        },
        {
            icon: <FaHeart className="w-8 h-8 text-rose-500" aria-hidden="true" />,
            title: 'Junta-te à comunidade',
            description: 'Encontra parceiros de jogo, junta-te a lobbies ou organiza partidas de última hora.',
        },
        {
            icon: <FaTrophy className="w-8 h-8 text-amber-500" aria-hidden="true" />,
            title: 'Ganha conquistas',
            description: 'Joga, melhora o teu nível e coleciona medalhas exclusivas à medida que evoluis.',
        }
    ];

    return (
        <div className="min-h-[100dvh] relative flex flex-col overflow-hidden bg-background selection:bg-primary/20">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pattern-grid" />
            </div>

            {/* Top Bar Actions */}
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={() => navigate('/')}
                    className="p-3 hover:bg-accent/80 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground bg-background/50 backdrop-blur-sm shadow-sm border border-border/50"
                    aria-label="Voltar à página inicial"
                    title="Voltar"
                >
                    <FaArrowLeft className="w-5 h-5" aria-hidden="true" />
                </button>
            </div>

            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setHelpOpen(true)}
                    className="p-3 hover:bg-accent/80 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground bg-background/50 backdrop-blur-sm shadow-sm border border-border/50"
                    aria-label="Ajuda"
                    title="Ajuda"
                >
                    <FaCircleQuestion className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-3 hover:bg-accent/80 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground bg-background/50 backdrop-blur-sm shadow-sm border border-border/50"
                    aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                    title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                >
                    {theme === 'dark' ? <FaSun className="w-5 h-5" aria-hidden="true" /> : <FaMoon className="w-5 h-5" aria-hidden="true" />}
                </button>
            </div>

            <main id="main-content" className="relative z-10 flex-1 flex flex-col w-full max-w-md mx-auto px-6 py-12 justify-between mt-12" role="main">
                <div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center mb-10 mt-4"
                    >
                        <img src={theme === 'dark' ? "/icon-dark.svg" : "/icon.svg"} alt="" aria-hidden="true" className="h-24 w-auto object-contain mb-4 drop-shadow-xl" />
                        <h1 className="text-4xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">matchIn</h1>
                        <p className="text-lg text-muted-foreground mt-2 font-medium text-center">O teu jogo começa aqui.</p>
                    </motion.div>

                    <div className="space-y-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + (index * 0.15), ease: "easeOut" }}
                                className="flex items-start gap-5"
                            >
                                <div className="bg-card shadow-lg shadow-black/5 dark:shadow-white/5 p-4 rounded-2xl border border-border/50 shrink-0">
                                    {feature.icon}
                                </div>
                                <div className="pt-2">
                                    <h2 className="text-lg font-bold mb-1">{feature.title}</h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                    className="mt-12 space-y-4 pb-8"
                >
                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/25 rounded-2xl group transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        onClick={() => navigate('/register')}
                    >
                        Criar conta grátis
                        <FaArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Button>
                    <p className="text-center text-sm text-muted-foreground font-medium">
                        Já tens conta?{' '}
                        <button
                            className="text-primary hover:underline font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm px-1"
                            onClick={() => navigate('/login')}
                            aria-label="Ir para a página de Início de Sessão"
                        >
                            Iniciar sessão
                        </button>
                    </p>
                </motion.div>
            </main>

            <style>{`
                .pattern-grid {
                    background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
                    background-size: 32px 32px;
                }
            `}</style>
            <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
        </div>
    );
}
