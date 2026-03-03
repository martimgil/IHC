import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import {
    FaHeadset
} from 'react-icons/fa6';

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
            <SheetContent
                side="bottom"
                className="inset-x-4 bottom-4 w-[calc(100%-2rem)] mx-auto rounded-[2.5rem] border-2 border-border shadow-2xl p-6 px-1 transition-all duration-300"
            >
                <div className="overflow-y-auto max-h-[75vh] px-5">
                    <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-6" />
                    <SheetHeader className="mb-6 text-left">
                        <SheetTitle className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <FaHeadset className="w-6 h-6 text-primary" aria-hidden="true" />
                            </div>
                            Ajuda
                        </SheetTitle>
                    </SheetHeader>
                    <Accordion type="single" collapsible className="space-y-2">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border-2 border-border/50 rounded-2xl px-2 bg-card/50 transition-colors data-[state=open]:border-primary/30">
                                <AccordionTrigger className="text-sm font-bold text-left py-4 px-2 hover:no-underline group">
                                    <span className="group-hover:text-primary transition-colors">{faq.q}</span>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground px-2 pb-4 leading-relaxed font-medium">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </SheetContent>
        </Sheet>
    );
}
