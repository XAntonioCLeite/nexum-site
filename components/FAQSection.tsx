import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "O paciente percebe que está falando com um robô?",
    answer: "Muito dificilmente. Nossa IA utiliza processamento de linguagem natural avançado (similar ao GPT-4), capaz de entender gírias, áudios e nuances. A maioria dos pacientes agradece a \"atendente\" no final, sem saber que era uma automação."
  },
  {
    question: "E se a IA não souber responder uma pergunta complexa?",
    answer: "Ela é treinada para ter humildade. Quando a IA identifica uma situação fora do padrão ou uma emergência, ela transfere o atendimento imediatamente para um humano da sua equipe e notifica os responsáveis. Nada fica sem resposta."
  },
  {
    question: "Preciso configurar fluxos ou programar algo?",
    answer: "Zero. Nós entregamos a solução \"chave na mão\". Nossa equipe mapeia seus processos, treina a IA com suas regras de negócio e implementa tudo. Você só precisa aprovar e começar a usar."
  },
  {
    question: "Quanto tempo leva para implementar?",
    answer: "A média de mercado é de 30 a 60 dias, mas nós fazemos em 5 a 10 dias úteis. Nosso processo de setup é otimizado para que você comece a ver o retorno sobre o investimento (ROI) o mais rápido possível."
  },
  {
    question: "Funciona fora do horário comercial?",
    answer: "Sim, 24 horas por dia, 7 dias por semana. É comum nossos clientes chegarem na segunda-feira de manhã com a agenda da semana já preenchida pelos agendamentos feitos automaticamente durante o fim de semana."
  }
];

const FAQSection: React.FC = () => {
  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="w-full bg-black py-24 relative z-20 border-t border-white/5 scroll-mt-32">
      {/* SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[700px] mx-auto px-6">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
             Dúvidas Frequentes
           </h2>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AccordionItem: React.FC<{ faq: FAQItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left focus:outline-none group bg-transparent"
        aria-expanded={isOpen}
      >
        <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
          {faq.question}
        </span>
        <div className="relative flex items-center justify-center w-6 h-6 shrink-0 ml-4">
           {/* Animated Plus Icon */}
           <motion.div
             animate={{ rotate: isOpen ? 45 : 0 }}
             transition={{ duration: 0.3, ease: "easeInOut" }}
           >
             <Plus className={`w-6 h-6 transition-colors duration-300 ${isOpen ? 'text-mint' : 'text-slate-500 group-hover:text-white'}`} />
           </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="text-zinc-400 text-base leading-relaxed pb-8 pr-10">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQSection;