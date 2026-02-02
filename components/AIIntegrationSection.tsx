import React from 'react';

const AIIntegrationSection: React.FC = () => {
  const ais = [
    { 
      name: 'ChatGPT', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/960px-ChatGPT-Logo.svg.png?20240214002031' 
    },
    { 
      name: 'Gemini', 
      logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/gemini-color.png' 
    },
    { 
      name: 'Claude', 
      logo: 'https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/light/claude-color.png' 
    },
    { 
      name: 'Grok', 
      logo: 'https://cdn.worldvectorlogo.com/logos/grok-1.svg' 
    },
    { 
      name: 'Manus', 
      logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/manus-ai-icon.png' 
    }
  ];

  return (
    <div className="w-full py-12 overflow-hidden relative z-20 pointer-events-auto">
       <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <h2 className="text-lg md:text-xl font-medium text-slate-400">
          Impulsionado pelas <span className="text-transparent bg-clip-text bg-gradient-to-r from-deepBlue to-blue-400 font-bold">melhores IAs do mercado</span>
        </h2>
      </div>
      
      {/* Mask Gradient for Fade Effect */}
      <div className="absolute top-24 bottom-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute top-24 bottom-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

      <div className="flex animate-scroll gap-16 md:gap-24 px-8 min-w-full hover:[animation-play-state:paused] items-center">
        {/* Repeat the list multiple times to ensure seamless infinite scroll */}
        {[...ais, ...ais, ...ais, ...ais].map((ai, index) => (
            <div key={`ai-${index}`} className="flex items-center gap-3 group shrink-0 transition-all duration-300 cursor-default">
              {/* Logo Image: Increased size from w-10 to w-12 */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                <img 
                  src={ai.logo} 
                  alt={ai.name} 
                  className="w-full h-full object-contain transition-all duration-300 filter grayscale brightness-0 invert opacity-70 group-hover:filter-none group-hover:opacity-100" 
                />
              </div>
               <span className="text-lg font-semibold text-slate-500 group-hover:text-white transition-colors duration-300">
                {ai.name}
              </span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default AIIntegrationSection;