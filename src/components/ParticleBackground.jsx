import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle types: Gold Sparkles & Floating Rose Petals
    const particles = [];
    const particleCount = Math.min(Math.floor(width / 35), 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.2,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        opacity: Math.random() * 0.7 + 0.2,
        color: Math.random() > 0.4 ? 'gold' : 'petal',
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.6 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.color === 'gold') {
          // Shimmering Golden Particle
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius * 2);
          gradient.addColorStop(0, `rgba(255, 235, 170, ${p.opacity})`);
          gradient.addColorStop(0.5, `rgba(212, 175, 55, ${p.opacity * 0.6})`);
          gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(0, 0, p.radius * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Romantic Rose Petal Silhouette
          ctx.beginPath();
          ctx.ellipse(0, 0, p.radius * 2, p.radius * 3.5, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(215, 72, 104, ${p.opacity * 0.5})`;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
