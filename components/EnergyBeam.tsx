import React from 'react';

const EnergyBeam: React.FC = () => {
  return (
    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120px] h-[1200px] z-0 pointer-events-none select-none"
         style={{
           // Mask to fade edges vertically and horizontally
           maskImage: 'radial-gradient(closest-side, black 40%, transparent 100%), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
           WebkitMaskImage: 'radial-gradient(closest-side, black 40%, transparent 100%), linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
         }}>
      
      {/* Styles strictly for this component's animation */}
      <style>
        {`
          @keyframes flowDown {
            0% { background-position: center 0, center 0; }
            100% { background-position: center 0, center 200px; }
          }
          .energy-beam-texture {
            background: 
              linear-gradient(to right, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%),
              repeating-linear-gradient(0deg, transparent, transparent 50px, #0a2463 50px, #0a2463 100px);
            background-size: 100% 100%, 100% 200px;
            animation: flowDown 3s linear infinite;
          }
        `}
      </style>

      {/* Glow Layer (The ambient light) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-full bg-gradient-to-b from-transparent via-[#0a2463] to-transparent blur-[50px] opacity-60 z-0" />

      {/* Core Beam Layer (The visible energy) */}
      <div className="energy-beam-texture absolute top-0 left-0 w-full h-full mix-blend-screen opacity-70 blur-[8px] contrast-150 z-10" />
    </div>
  );
};

export default EnergyBeam;