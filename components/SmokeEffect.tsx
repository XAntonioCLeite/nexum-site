import React, { useEffect, useRef } from 'react';

const SmokeEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number;
    let height: number;
    let animationFrameId: number;
    let particles: SmokeParticle[] = [];

    // Settings matched to the user's request, but color tuned to "Smoke" (Grey/Blueish)
    // instead of bright cyan, to ensure it looks like smoke.
    const settings = {
      count: 40, // Reduced count for less density
      sizeBase: 80,        
      sizeVariation: 50,   
      speedY: 0.6, // Slightly slower for calmer effect
      // Using a cool slate grey for realistic smoke appearance on black background
      color: { r: 160, g: 170, b: 190 }, 
    };

    class SmokeParticle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      opacity: number = 0;
      life: number = 0;
      maxLife: number = 0;
      growth: number = 0;

      constructor() {
        this.reset();
        // Initialize randomly on screen to avoid empty start
        this.y = Math.random() * window.innerHeight;
      }

      reset() {
        width = canvas!.width;
        height = canvas!.height;
        this.x = Math.random() * width;
        this.y = height + 100; // Start below screen
        this.vx = (Math.random() - 0.5) * 1.5; // Gentle side wind
        this.vy = -(Math.random() * settings.speedY + 0.5); // Upward movement
        this.size = settings.sizeBase + Math.random() * settings.sizeVariation;
        this.opacity = 0;
        this.life = Math.random() * 0.5;
        this.maxLife = 1;
        this.growth = 0.2; // Grow as it rises
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.size += this.growth;

        // Turbulence simulation (wave motion)
        this.x += Math.sin(this.y * 0.01 + this.life) * 0.5;

        // Opacity control
        if (this.y > height * 0.8) {
          // Reduced max opacity for individual particles from 0.5 to 0.25
          if (this.opacity < 0.25) this.opacity += 0.01;
        } else if (this.y < height * 0.3) {
          this.opacity -= 0.005;
        }

        // Reset if out of bounds or invisible
        if (this.y < -this.size || this.opacity <= 0) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );

        gradient.addColorStop(0, `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < settings.count; i++) {
        particles.push(new SmokeParticle());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // 'lighter' composite mode creates the glow effect where particles overlap
      ctx.globalCompositeOperation = 'lighter';

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 blur-[40px] opacity-40"
    />
  );
};

export default SmokeEffect;