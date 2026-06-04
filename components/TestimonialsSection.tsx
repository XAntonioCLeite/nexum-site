import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  clinic: string;
  avatar: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Roberto Albuquerque",
    role: "Diretor Clínico",
    clinic: "CardioLife Diagnósticos",
    avatar: "https://picsum.photos/seed/roberto/100/100",
    rating: 5,
    text: "O no-show na nossa clínica caiu mais de 55% no primeiro mês. A IA é extremamente natural, os pacientes respondem como se estivessem falando com nossa recepcionista."
  },
  {
    id: 2,
    name: "Dra. Larissa Mendonça",
    role: "Proprietária e Dermatologista",
    clinic: "Instituto DermatoPrime",
    avatar: "https://picsum.photos/seed/larissa/100/100",
    rating: 5,
    text: "Antes eu perdia cerca de 20 a 30 agendamentos por fim de semana. Agora, a IA da Nexum atende no sábado e domingo à noite, preenchendo a agenda de segunda-feira enquanto eu durmo."
  },
  {
    id: 3,
    name: "Dr. André Villas-Bôas",
    role: "Ortodontista",
    clinic: "OdontoCorp Associados",
    avatar: "https://picsum.photos/seed/andre/100/100",
    rating: 5,
    text: "A integração com o nosso sistema de prontuário foi perfeita. O fluxo de encaixes automáticos a partir da lista de espera salvou dezenas de horários ociosos nesta temporada."
  }
];

const partnerLogos = [
  { name: "MedGroup", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" }, // Placeholder / Custom layout icon
  { name: "OdontoClinic", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" },
  { name: "CardioLife", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" },
  { name: "DermatoClinic", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" },
  { name: "MedCardio", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" },
  { name: "Instituto de Pele", logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png" },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full bg-black py-24 relative overflow-hidden border-t border-white/5 z-20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-deepBlue/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Quem confia na <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Nexum AI</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Resultados reais de médicos, dentistas e gestores de clínicas que já transformaram seu atendimento.
          </p>
        </div>

        {/* Carousel / Grid of Testimonials */}
        {/* Mobile: Horizontal scrollable track. Desktop: Standard grid */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-8 md:pb-0 scrollbar-none snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
          {testimonials.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              className="min-w-[290px] w-[85%] sm:w-[320px] md:w-full shrink-0 snap-center glass-panel p-6 md:p-8 rounded-3xl flex flex-col justify-between border border-white/10 hover:border-deepBlue/40 transition-all duration-300 relative group"
            >
              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-mint fill-mint" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-sm md:text-base text-slate-300 leading-relaxed italic mb-6">
                  "{test.text}"
                </p>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover border border-white/10 bg-slate-800" />
                <div className="flex flex-col">
                  <h4 className="font-bold text-white text-sm">{test.name}</h4>
                  <span className="text-[11px] text-slate-400 leading-snug">{test.role}</span>
                  <span className="text-[10px] text-blue-400 font-medium font-mono uppercase tracking-wider">{test.clinic}</span>
                </div>
              </div>

              {/* Decorative Quote Icon */}
              <Quote className="absolute right-6 top-6 text-white/5 w-12 h-12 transform group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* B2B Partner Logos Section */}
        <div className="mt-20 pt-12 border-t border-white/5">
          <div className="text-center mb-8">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
              Homologado e integrado nas melhores especialidades B2B
            </h3>
          </div>

          {/* Grid Layout: Compact 3x2 on mobile, 6 Columns Row on Desktop */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center justify-items-center opacity-40 hover:opacity-60 transition-opacity duration-300">
            {partnerLogos.map((partner, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-2 group cursor-default">
                {/* Monochromatic SVG representation for branding */}
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-1.5 transition-colors group-hover:bg-white/10">
                  <span className="text-[10px] font-bold font-mono text-slate-400 group-hover:text-white">NX</span>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
