import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
    {
        q: 'Como reservo uma sessão?',
        a: 'Na página inicial, toca num desporto e seleciona uma sessão disponível. Depois confirma a reserva no ecrã de detalhe.',
    },
    {
        q: 'O que é um Lobby?',
        a: 'Um Lobby é um grupo informal onde qualquer pessoa pode juntar-se a uma atividade. Os organizadores criam o lobby e os outros jogadores inscrevem-se.',
    },
    {
        q: 'Como encontro atividades perto de mim?',
        a: 'Usa o botão "Procurar por Local" ou o separador "Locais" na barra de navegação inferior.',
    },
    {
        q: 'Posso cancelar uma reserva?',
        a: 'Sim. Vais ao teu Perfil → Próximas Reservas e carregas na reserva para ver as opções de cancelamento.',
    },
    {
        q: 'O que é "Atividade de Última Hora"?',
        a: 'São atividades com vagas disponíveis a curto prazo. Útil quando procuras algo para hoje ou amanhã.',
    },
    {
        q: 'Como activar as notificações?',
        a: 'Vai ao Perfil → Preferências de Notificação e escolhe os tipos de alertas que queres receber.',
    },
    {
        q: 'Como repito o tutorial inicial?',
        a: 'No teu telemóvel, limpa os dados da app nas definições do browser. O tutorial volta a aparecer no próximo acesso.',
    },
];

interface HelpSheetProps {
    open: boolean;
    onClose: () => void;
}

export default function HelpSheet({ open, onClose }: HelpSheetProps) {
    return (
        <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
                <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center gap-2 text-lg">
                        <HelpCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                        Ajuda
                    </SheetTitle>
                </SheetHeader>
                <Accordion type="single" collapsible className="space-y-1">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-1">
                            <AccordionTrigger className="text-sm font-medium text-left py-3 px-2">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground px-2 pb-3">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </SheetContent>
        </Sheet>
    );
}
