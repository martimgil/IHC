import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useUser();
    const [email, setEmail] = useState('alice@example.com');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        // Derive a display name from the email (before @)
        const displayName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        login(displayName, email);
        toast.success('Sessão iniciada!', { description: `Bem-vindo de volta, ${displayName}!` });
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-3xl font-bold">match<span className="text-primary">In</span></span>
            </div>

            <Card className="w-full max-w-sm shadow-md">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Iniciar Sessão</CardTitle>
                    <CardDescription>Entra na tua conta para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4" noValidate>
                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="o.teu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={`pl-9 ${errors.email ? 'border-destructive' : ''}`}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    aria-invalid={!!errors.email}
                                />
                            </div>
                            {errors.email && (
                                <p id="email-error" className="text-xs text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <button
                                    type="button"
                                    className="text-xs text-primary hover:underline"
                                    aria-label="Recuperar password"
                                    onClick={() => toast.info('Email de recuperação enviado (demo)')}
                                >
                                    Esqueci a password
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={`pl-9 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    aria-invalid={!!errors.password}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPassword(v => !v)}
                                    aria-label={showPassword ? 'Esconder password' : 'Mostrar password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p id="password-error" className="text-xs text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={isLoading} aria-label="Iniciar sessão">
                            {isLoading ? (
                                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />A entrar...</>
                            ) : 'Entrar'}
                        </Button>
                    </form>

                    <Separator className="my-4" />

                    <p className="text-center text-sm text-muted-foreground">
                        Não tens conta?{' '}
                        <button
                            className="text-primary font-medium hover:underline"
                            onClick={() => navigate('/register')}
                        >
                            Registar
                        </button>
                    </p>

                    <p className="text-center text-xs text-muted-foreground/60 mt-4">
                        Demo: usa qualquer email válido + password com 6+ caracteres
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
