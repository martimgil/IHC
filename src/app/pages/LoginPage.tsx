import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBolt, FaShieldHalved } from 'react-icons/fa6';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

function ForgotPasswordSheet({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Insere o teu email.');
            return;
        }
        setIsSending(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsSending(false);
        toast.success('Email enviado!', { description: 'Verifica a tua caixa de entrada.' });
        onClose();
    };

    return (
        <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
            <SheetContent
                side="bottom"
                className="inset-x-4 bottom-4 w-[calc(100%-2rem)] mx-auto rounded-[2.5rem] border-2 border-border shadow-2xl p-6 px-1 transition-all duration-300"
            >
                <div className="overflow-y-auto max-h-[85dvh] px-5">
                    <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-6" />
                    <SheetHeader className="mb-6 text-left">
                        <SheetTitle className="text-2xl font-extrabold tracking-tight">Recuperar Password</SheetTitle>
                        <SheetDescription className="text-base font-medium">Insere o teu email para receberes instruções de recuperação.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email" className="font-semibold px-1">Email</Label>
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="o.teu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-background/50 border-border/50"
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" disabled={isSending}>
                            {isSending ? 'A enviar...' : 'Enviar Instruções'}
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useUser();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});


    const validate = () => {
        const e: typeof errors = {};
        if (!email) e.email = 'O email é obrigatório.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email inválido.';
        if (!password) e.password = 'A password é obrigatória.';
        else if (password.length < 6) e.password = 'Mínimo 6 caracteres.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleLogin = async (e?: React.FormEvent, customUser?: { name: string, email: string }) => {
        if (e) e.preventDefault();

        setIsLoading(true);
        // Simulação de delay de rede
        await new Promise(r => setTimeout(r, 1200));

        const userToLogin = customUser || {
            name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email
        };

        login(userToLogin.name, userToLogin.email);
        toast.success('Sessão iniciada!', { description: `Bem-vindo de volta, ${userToLogin.name}!` });
        setIsLoading(false);
        navigate('/');
    };


    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pattern-grid" />
            </div>

            <main className="relative z-10 w-full max-w-md px-4 sm:px-6 py-8 sm:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Header/Logo */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <img src={theme === 'dark' ? "/icon-dark.svg" : "/icon.svg"} alt="matchIn logo" className="h-16 w-auto object-contain mb-4" />
                        <p className="text-muted-foreground mt-2 font-medium">Ligas-te ao teu próximo jogo.</p>
                    </div>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo!</CardTitle>
                            <CardDescription>Inicia sessão para continuares.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-4 sm:px-6">
                            <form onSubmit={(e) => { e.preventDefault(); if (validate()) handleLogin(undefined); }} className="space-y-4" noValidate>
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-semibold">Email</Label>
                                    <div className="relative group">
                                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="o.teu@email.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className={`pl-10 h-12 bg-background/50 border-border/50 transition-all ${errors.email ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                        />
                                    </div>
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-xs font-semibold text-destructive px-1"
                                            >
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <button
                                            type="button"
                                            className="text-xs text-primary font-medium hover:underline"
                                            onClick={() => setShowForgot(true)}
                                        >
                                            Esqueci-me?
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className={`pl-10 pr-10 h-12 bg-background/50 border-border/50 transition-all ${errors.password ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-xs font-semibold text-destructive px-1"
                                            >
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 brightness-110 active:scale-[0.98] transition-transform"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                                            <span>A entrar...</span>
                                        </div>
                                    ) : 'Entrar'}
                                </Button>
                            </form>


                            <Separator className="opacity-50" />

                            <div className="text-center space-y-3">
                                <p className="text-sm text-muted-foreground font-medium">
                                    Não tens conta?{' '}
                                    <button
                                        className="inline-flex items-center text-primary font-bold hover:underline gap-1 transition-all"
                                        onClick={() => navigate('/register')}
                                    >
                                        Regista-te agora
                                    </button>
                                </p>
                                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
                                    <span className="flex items-center gap-1"><FaShieldHalved className="w-3 h-3" /> Secure Login</span>
                                    <span className="flex items-center gap-1"><FaBolt className="w-3 h-3" /> Fast Access</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            <style>{`
                .pattern-grid {
                    background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
                    background-size: 32px 32px;
                }
            `}</style>

            {/* Forgot Password Sheet */}
            <ForgotPasswordSheet open={showForgot} onClose={() => setShowForgot(false)} />
        </div>
    );
}
