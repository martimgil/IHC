import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { FaEnvelope, FaLock, FaUser, FaBolt, FaCircleCheck, FaMapPin, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { toast } from 'sonner';
import { sports } from '../data';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const [interestIds, setInterestIds] = useState<string[]>([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', location: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validateStep1 = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'O nome é obrigatório.';
        if (!form.email) e.email = 'O email é obrigatório.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido.';
        if (!form.password) e.password = 'A password é obrigatória.';
        else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres.';
        if (form.password !== form.confirmPassword) e.confirmPassword = 'As passwords não coincidem.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleRegister = async () => {
        if (interestIds.length === 0) {
            toast.error('Seleciona pelo menos um desporto.');
            return;
        }
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1400));
        setIsLoading(false);
        register(form.name.trim(), form.email, interestIds, form.location.trim());
        toast.success('Conta criada com sucesso! 🎉', { description: `Bem-vindo, ${form.name.split(' ')[0]}!` });
        navigate('/');
    };

    const toggleSport = (id: string) =>
        setInterestIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <FaBolt className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-3xl font-bold">match<span className="text-primary">In</span></span>
            </div>

            <Card className="w-full max-w-sm shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Criar Conta</CardTitle>
                    <CardDescription>
                        {step === 1 ? 'Preenche os teus dados' : 'Escolhe os teus desportos favoritos'}
                    </CardDescription>
                    {/* Step indicator */}
                    <div className="flex gap-1.5 mt-3" aria-label="Passo atual">
                        {[1, 2].map(s => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`}
                            />
                        ))}
                    </div>
                </CardHeader>

                <CardContent>
                    {step === 1 ? (
                        <div className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-name">Nome completo</Label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-name"
                                        placeholder="O teu nome"
                                        value={form.name}
                                        onChange={e => set('name', e.target.value)}
                                        className={`pl-9 ${errors.name ? 'border-destructive' : ''}`}
                                        aria-invalid={!!errors.name}
                                        aria-describedby={errors.name ? 'name-err' : undefined}
                                    />
                                </div>
                                {errors.name && <p id="name-err" className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            {/* Location */}
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-location">Localização <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                                <div className="relative">
                                    <FaMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-location"
                                        placeholder="Ex: Aveiro"
                                        value={form.location}
                                        onChange={e => set('location', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-email">Email</Label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        placeholder="o.teu@email.com"
                                        value={form.email}
                                        onChange={e => set('email', e.target.value)}
                                        className={`pl-9 ${errors.email ? 'border-destructive' : ''}`}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? 'email-err' : undefined}
                                    />
                                </div>
                                {errors.email && <p id="email-err" className="text-xs text-destructive">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-password">Password</Label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => set('password', e.target.value)}
                                        className={`pl-9 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                                        aria-invalid={!!errors.password}
                                        aria-describedby={errors.password ? 'pw-err' : undefined}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        onClick={() => setShowPassword(v => !v)}
                                        aria-label={showPassword ? 'Esconder password' : 'Mostrar password'}
                                    >
                                        {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p id="pw-err" className="text-xs text-destructive">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-confirm">Confirmar Password</Label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-confirm"
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.confirmPassword}
                                        onChange={e => set('confirmPassword', e.target.value)}
                                        className={`pl-9 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                                        aria-invalid={!!errors.confirmPassword}
                                        aria-describedby={errors.confirmPassword ? 'conf-err' : undefined}
                                    />
                                </div>
                                {errors.confirmPassword && <p id="conf-err" className="text-xs text-destructive">{errors.confirmPassword}</p>}
                            </div>

                            <Button className="w-full h-11" onClick={handleNext}>Seguinte →</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Seleciona os desportos que gostas de praticar (mínimo 1):
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {sports.map(s => {
                                    const selected = interestIds.includes(s.id);
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => toggleSport(s.id)}
                                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-sm transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary ${selected ? 'border-primary bg-primary/10 font-semibold' : 'border-border bg-card'}`}
                                            aria-pressed={selected}
                                            aria-label={s.name}
                                        >
                                            <span className="text-xl shrink-0">{s.icon}</span>
                                            <span className="truncate flex-1">{s.name}</span>
                                            {selected && <FaCircleCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {interestIds.length > 0 && (
                                <p className="text-xs text-primary font-medium text-center">
                                    {interestIds.length} desporto{interestIds.length !== 1 ? 's' : ''} selecionado{interestIds.length !== 1 ? 's' : ''}
                                </p>
                            )}

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 h-11" onClick={() => setStep(1)}>← Voltar</Button>
                                <Button
                                    className="flex-1 h-11"
                                    onClick={handleRegister}
                                    disabled={isLoading || interestIds.length === 0}
                                >
                                    {isLoading
                                        ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />A criar...</>
                                        : 'Criar Conta 🚀'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <Separator className="my-4" />

                    <p className="text-center text-sm text-muted-foreground">
                        Já tens conta?{' '}
                        <button
                            className="text-primary font-medium hover:underline"
                            onClick={() => navigate('/login')}
                        >
                            Iniciar sessão
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
