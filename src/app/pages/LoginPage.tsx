import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBolt, FaShieldHalved, FaUserCheck, FaHeart } from 'react-icons/fa6';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { sports, currentUser } from '../data';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const demoAccounts = [
        { name: 'Alice Silva', email: 'alice@example.com', role: 'Utilizadora Ativa' },
        { name: 'Bruno Santos', email: 'bruno@example.com', role: 'Novo Membro' }
    ];

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

    const handleQuickLogin = (email: string, name: string) => {
        setEmail(email);
        setPassword('password123'); // Fictícia
        handleLogin(undefined, { name, email });
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pattern-grid" />
            </div>

            <main className="relative z-10 w-full max-w-md px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Header/Logo */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <motion.div
                            className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl mb-4 rotate-3"
                            whileHover={{ scale: 1.05, rotate: 0 }}
                        >
                            <FaBolt className="w-9 h-9 text-primary-foreground" />
                        </motion.div>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            match<span className="text-primary italic">In</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Ligas-te ao teu próximo jogo.</p>
                    </div>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo!</CardTitle>
                            <CardDescription>Inicia sessão ou usa uma conta de demonstração.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                                        <button type="button" className="text-xs text-primary font-medium hover:underline">
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

                            <div className="relative flex items-center py-2">
                                <Separator className="flex-grow" />
                                <span className="mx-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Demo Accounts</span>
                                <Separator className="flex-grow" />
                            </div>

                            {/* Demo Accounts */}
                            <div className="grid grid-cols-2 gap-3">
                                {demoAccounts.map((acc, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleQuickLogin(acc.email, acc.name)}
                                        className="flex flex-col items-start p-3 text-left border border-border/50 rounded-xl bg-accent/30 hover:bg-accent/50 hover:border-primary/50 transition-all active:scale-[0.97] group"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <FaUserCheck className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-xs font-bold truncate">{acc.name.split(' ')[0]}</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground leading-none">{acc.role}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Favorite Sports */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <FaHeart className="w-3 h-3 text-red-500" />Os teus desportos favoritos
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {currentUser.interestedSports.map(id => {
                                        const sport = sports.find(s => s.id === id);
                                        return sport ? (
                                            <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                                                <span>{sport.icon}</span>{sport.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>

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
        </div>
    );
}
