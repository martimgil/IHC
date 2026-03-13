import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Separator } from '../ui/separator';
import {
    FaHeadset, FaEnvelope, FaPhone, FaUniversalAccess
} from 'react-icons/fa6';

const faqs = [
    {
        q: 'Como reservo um lugar numa atividade?',
        a: 'Na página inicial, toca num desporto e seleciona uma atividade disponível. Depois confirma a reserva no ecrã de detalhe e efetua o pagamento para garantir a tua vaga.',
    },
    {
        q: 'O que é uma Atividade?',
        a: 'A Atividade é um grupo informal onde qualquer pessoa pode juntar-se a uma atividade. Os organizadores criam a atividade e os outros jogadores inscrevem-se. Quando o número mínimo de jogadores é atingido, a atividade é confirmada.',
    },
    {
        q: 'Como encontro atividades perto de mim?',
        a: 'Usa o botão "Procurar por Local" na página inicial ou o separador "Locais" na barra de navegação inferior. Podes também ativar a localização automática para ver os locais mais próximos de ti.',
    },
    {
        q: 'Posso cancelar a participação numa atividade?',
        a: 'Sim. Vai ao teu Perfil → Próximas Atividades e carrega na atividade para ver as opções de cancelamento. Se cancelares com mais de 24h de antecedência, serás reembolsado a 100%.',
    },
    {
        q: 'O que é "Atividade de Última Hora"?',
        a: 'São atividades com vagas disponíveis a curto prazo, ideais para quando procuras algo para hoje ou amanhã. Nestas atividades, a entrada é geralmente imediata, sem necessidade de aprovação.',
    },
    {
        q: 'Que métodos de pagamento são aceites?',
        a: 'Aceitamos cartão de crédito/débito (Visa, Mastercard), MB WAY e referência Multibanco. Todos os pagamentos são processados de forma segura e encriptada.',
    },
    {
        q: 'Como são formadas as equipas equilibradas?',
        a: 'O sistema analisa o nível de experiência e a classificação de habilidade de cada jogador e organiza automaticamente equipas equilibradas. Podes ver a sugestão de equipas na página da Atividade quando o grupo está completo.',
    },
    {
        q: 'E se não tiver o material necessário?',
        a: 'Muitas atividades oferecem aluguer de equipamento no local. Na página do desporto, toca em "Ver equipamento disponível para aluguer" para ver preços e disponibilidade.',
    },
    {
        q: 'Os meus dados pessoais estão seguros?',
        a: 'Sim. Seguimos as normas do RGPD e os teus dados são armazenados de forma segura. Nunca partilhamos informações pessoais com terceiros sem o teu consentimento.',
    },
    {
        q: 'Como ativar as notificações?',
        a: 'Vai ao Perfil → Preferências de Notificação e escolhe os tipos de alertas que queres receber: sessões disponíveis, lembretes de material, atividades urgentes, entre outros.',
    },
    {
        q: 'Como funciona a avaliação de jogadores?',
        a: 'Após uma atividade de grupo, podes avaliar os outros jogadores em categorias como "Amigável", "Bom Colega" e "Habilidoso". Estas avaliações ajudam a comunidade a identificar bons companheiros de jogo.',
    },
    {
        q: 'Posso seguir outros jogadores?',
        a: 'Sim! Nos Lobbies ou atividades, podes tocar no botão "Seguir" junto ao nome de um jogador. Assim, serás notificado quando esse jogador criar ou participar em novas atividades.',
    },
    {
        q: 'A app é acessível com leitor de ecrã?',
        a: 'Sim. A aplicação está otimizada para leitores de ecrã e tecnologias assistivas. Todos os botões, imagens e interações possuem descrições acessíveis. Se encontrares alguma dificuldade, contacta o nosso suporte.',
    },
    {
        q: 'Como posso eliminar a minha conta?',
        a: 'Contacta o nosso suporte através do email ou telefone indicados abaixo. Processamos o pedido em até 5 dias úteis, conforme o RGPD.',
    },
];

interface HelpSheetProps {
    readonly open: boolean;
    readonly onClose: () => void;
}

export default function HelpSheet({ open, onClose }: HelpSheetProps) {
    return (
        <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
            <SheetContent
                side="bottom"
                className="inset-x-4 bottom-4 w-[calc(100%-2rem)] mx-auto rounded-[2.5rem] border-2 border-border shadow-2xl p-6 px-1 transition-all duration-300"
                aria-label="Painel de ajuda"
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

                    {/* FAQs */}
                    <section aria-label="Perguntas frequentes">
                        <p className="text-sm text-muted-foreground mb-4 font-medium">Perguntas Frequentes</p>
                        <Accordion type="single" collapsible className="space-y-2">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={faq.q} value={`faq-${i}`} className="border-2 border-border/50 rounded-2xl px-2 bg-card/50 transition-colors data-[state=open]:border-primary/30">
                                    <AccordionTrigger className="text-sm font-bold text-left py-4 px-2 hover:no-underline group">
                                        <span className="group-hover:text-primary transition-colors">{faq.q}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground px-2 pb-4 leading-relaxed font-medium">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </section>

                    <Separator className="my-6" />

                    {/* Contact & Support */}
                    <section aria-label="Contacto e suporte">
                        <p className="text-sm font-bold mb-3 flex items-center gap-2">
                            <FaUniversalAccess className="w-4 h-4 text-primary" aria-hidden="true" />
                            Contacto & Suporte
                        </p>
                        <div className="space-y-2">
                            <a
                                href="mailto:match@matchin.pt"
                                className="flex items-center gap-3 p-3 bg-muted/40 border-2 border-border/50 rounded-2xl transition-colors hover:border-primary/20 text-sm"
                                aria-label="Enviar email para match@matchin.pt"
                            >
                                <FaEnvelope className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                                <div>
                                    <p className="font-bold">Email</p>
                                    <p className="text-muted-foreground">match@matchin.pt</p>
                                </div>
                            </a>
                            <a
                                href="tel:+351912345678"
                                className="flex items-center gap-3 p-3 bg-muted/40 border-2 border-border/50 rounded-2xl transition-colors hover:border-primary/20 text-sm"
                                aria-label="Ligar para +351 912 345 678"
                            >
                                <FaPhone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                                <div>
                                    <p className="font-bold">Telefone</p>
                                    <p className="text-muted-foreground">+351 912 345 678</p>
                                </div>
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 italic font-medium">
                            Horário de atendimento: Seg-Sex, 9h00–18h00
                        </p>
                    </section>
                </div>
            </SheetContent>
        </Sheet>
    );
}

