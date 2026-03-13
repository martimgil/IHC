import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { FaHouse, FaMapPin, FaUsers, FaBell, FaBolt, FaRocket } from 'react-icons/fa6';

const steps = [
    {
        icon: <FaBolt className="w-12 h-12 text-primary" />,
        title: 'Bem-vindo ao matchIn!',
        description: 'A tua app para encontrar atividades desportivas, juntar lobbies e fazer novas conexões.',
    },
    {
        icon: <FaHouse className="w-12 h-12 text-primary" />,
        title: 'Escolhe o teu desporto',
        description: 'Na página inicial encontras todos os desportos disponíveis. Toca num para ver sessões e lobbies.',
    },
    {
        icon: <FaMapPin className="w-12 h-12 text-primary" />,
        title: 'Encontra por local',
        description: 'Usa "Procurar por Local" para encontrar atividades perto de ti.',
    },
    {
        icon: <FaUsers className="w-12 h-12 text-primary" />,
        title: 'Atividades de última hora',
        description: 'Precisas de um companheiro agora? Usa "Atividade de Última Hora" para encontrar lobbies abertos.',
    },
    {
        icon: <FaBell className="w-12 h-12 text-primary" />,
        title: 'Fica a par',
        description: 'Activa as notificações para saberes quando há uma vaga disponível no teu desporto favorito.',
    },
];

const STORAGE_KEY = 'matchin_onboarding_done';

export default function OnboardingTutorial() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, '1');
        setOpen(false);
    };

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            handleClose();
        }
    };

    const current = steps[step];

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
            <DialogContent
                className="max-w-sm rounded-2xl p-0 overflow-hidden"
                aria-label={`Tutorial passo ${step + 1} de ${steps.length}: ${current.title}`}
            >
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-primary/60 to-primary" aria-hidden="true" />

                <div className="p-6 flex flex-col items-center text-center gap-4">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {current.icon}
                    </div>

                    {/* Text */}
                    <div>
                        <h2 className="text-lg font-bold mb-2">{current.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
                    </div>

                    {/* Dot indicators */}
                    <div className="flex gap-1.5" role="tablist" aria-label="Passos do tutorial">
                        {steps.map((s, i) => (
                            <button
                                key={s.title}
                                role="tab"
                                aria-selected={i === step}
                                aria-label={`Passo ${i + 1}`}
                                onClick={() => setStep(i)}
                                className={`rounded-full transition-all ${i === step ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/30'}`}
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full gap-2 pt-1">
                        <Button
                            variant="ghost"
                            className="flex-1 text-muted-foreground"
                            onClick={handleClose}
                            aria-label="Saltar tutorial"
                        >
                            Saltar
                        </Button>
                        <Button className="flex-1" onClick={handleNext} aria-label={step < steps.length - 1 ? 'Próximo passo' : 'Terminar tutorial'}>
                            {step < steps.length - 1 ? 'Seguinte' : <span className="flex items-center gap-2 justify-center">Começar! <FaRocket /></span>}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
