import React, { useEffect, useRef } from 'react';

interface VoiceSphereProps {
  isActive: boolean;
  isSpeaking: boolean;
  amplitude?: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  angle: number;
  velocity: number;
  baseDistance: number;
  distanceOffset: number;
  color: { r: number; g: number; b: number };
  opacity: number;
  scale: number;
  energy: number;
  pulsePhase: number;
  originalRadius: number;
}

// Função auxiliar para converter hex para rgb
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export default function VoiceSphere({ isActive, isSpeaking, amplitude = 0 }: VoiceSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lastAmplitudeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Aumentando a resolução para efeitos mais detalhados
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = '200px';
    canvas.style.height = '200px';
    const centerX = size / 2;
    const centerY = size / 2;

    // Cores futuristas com tons de néon
    const colors = [
      '#FFFFFF', // Branco principal
      '#F0F0FF', // Branco azulado
      '#E6E6FF', // Branco lilás
      '#F8F8FF', // Branco fantasma
      '#E0FFFF', // Ciano claro
      '#F5F5FF', // Branco lavanda
    ].map(hexToRgb);

    // Inicialização de partículas com características futuristas
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const radius = Math.random() * 3 + 1;
      return {
        x: centerX,
        y: centerY,
        radius: radius,
        originalRadius: radius,
        angle: Math.random() * Math.PI * 2,
        velocity: Math.random() * 0.02 + 0.01,
        baseDistance: Math.random() * 40 + 50,
        distanceOffset: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2, // Increased base opacity
        scale: Math.random() * 0.5 + 0.5,
        energy: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, size, size);

      // Enhanced amplitude smoothing with more dynamic response
      const targetAmplitude = Math.pow(amplitude, 1.2);
      const smoothAmplitude = targetAmplitude * 0.8 + lastAmplitudeRef.current * 0.2;
      lastAmplitudeRef.current = smoothAmplitude;

      // Dynamic force field effect based on amplitude
      const forceFieldGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size / 2 * (1 + smoothAmplitude * 0.2)
      );

      const baseAlpha = isActive ? 0.25 : 0.15; // Increased base alpha
      forceFieldGradient.addColorStop(0, `rgba(255, 255, 255, ${baseAlpha + smoothAmplitude * 0.3})`);
      forceFieldGradient.addColorStop(0.5, `rgba(240, 240, 255, ${baseAlpha * 0.7})`);
      forceFieldGradient.addColorStop(1, 'rgba(230, 230, 255, 0)');
      ctx.fillStyle = forceFieldGradient;
      ctx.fillRect(0, 0, size, size);

      // Enhanced particle animation
      particlesRef.current.forEach((particle) => {
        // Dynamic time factor based on amplitude
        const timeFactor = Date.now() / 1000;
        const amplitudeEffect = 1 + smoothAmplitude * 2;
        
        // Update particle energy based on amplitude
        particle.energy = Math.min(1, particle.energy + smoothAmplitude * 0.1);
        particle.energy *= 0.95; // Decay

        // Dynamic distance calculation
        const distanceMultiplier = 1 + Math.sin(particle.pulsePhase + timeFactor) * 0.3;
        const distance = particle.baseDistance * distanceMultiplier * amplitudeEffect;

        // Update position with dynamic velocity
        particle.angle += particle.velocity * amplitudeEffect;
        particle.x = centerX + Math.cos(particle.angle) * distance;
        particle.y = centerY + Math.sin(particle.angle) * distance;

        // Dynamic particle size based on amplitude and energy
        const sizePulse = 1 + Math.sin(particle.pulsePhase + timeFactor * 2) * 0.3;
        particle.radius = particle.originalRadius * sizePulse * (1 + particle.energy * 0.5);

        // Dynamic color and opacity
        const energyFactor = particle.energy * amplitudeEffect;
        const colorIntensity = Math.min(1, 0.4 + energyFactor * 0.6); // Increased base intensity
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Enhanced glow effect with brighter core
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        
        const particleOpacity = particle.opacity * colorIntensity;
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particleOpacity})`); // Bright white core
        gradient.addColorStop(0.3, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particleOpacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Update pulse phase
        particle.pulsePhase += 0.05 * amplitudeEffect;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isSpeaking, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-full"
      style={{
        filter: 'blur(0.5px)',
        transform: 'translateZ(0)',
        willChange: 'transform',
        background: 'rgba(0, 0, 0, 0.03)'
      }}
    />
  );
}
