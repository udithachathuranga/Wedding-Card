import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

export default function EnvelopeModal({ onOpened }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);

    // Play chime sound and start romantic harp music
    weddingAudio.playChime();
    setTimeout(() => {
      weddingAudio.start();
    }, 400);

    // Trigger celebratory gold and rose confetti burst
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#ffe28a', '#d8a73f', '#a27218', '#e8758d', '#ffffff'],
      disableForReducedMotion: true,
    });

    // Secondary soft burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.7 },
        colors: ['#ffd700', '#f7f2dd', '#be294d'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.7 },
        colors: ['#ffd700', '#f7f2dd', '#be294d'],
      });
    }, 300);

    // Complete opening sequence after animation
    setTimeout(() => {
      setIsOpened(true);
      if (onOpened) onOpened();
    }, 1600);
  };

  if (isOpened) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a030a]/95 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpening ? 'opacity-0 scale-110 pointer-events-none delay-1000' : 'opacity-100 scale-100'
        }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,178,88,0.22)_0%,rgba(175,28,64,0.15)_40%,transparent_70%)] pointer-events-none" />

      {/* Main Envelope Presentation Container */}
      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Top Floating Prompt */}
        <div className={`text-center mb-6 transition-all duration-700 ${isOpening ? 'opacity-0 -translate-y-6 scale-90' : 'opacity-100 translate-y-0'}`}>
          <p className="font-serif tracking-[0.3em] text-xs text-gold-300 uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Royal Wedding Invitation
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          </p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold-foil leading-normal pt-3 pb-1 overflow-visible inline-block">
            Shan &amp; Lakshani
          </h2>
        </div>

        {/* The 3D Physical-Look Envelope */}
        <div
          onClick={handleOpenEnvelope}
          className={`group cursor-pointer relative w-full aspect-[16/11] max-w-[440px] rounded-2xl bg-gradient-to-br from-[#631227] via-[#460918] to-[#2c050f] border-2 border-gold-400/60 shadow-luxury transition-all duration-700 perspective-1000 transform ${isOpening ? 'scale-105 translate-y-2' : 'hover:scale-[1.02] hover:border-gold-300'
            }`}
          role="button"
          tabIndex={0}
          aria-label="Open wedding invitation envelope"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
          }}
        >
          {/* Subtle envelope texture and gold corner brackets */}
          <div className="absolute inset-2 border border-gold-400/25 rounded-xl pointer-events-none z-10" />

          {/* Morphing Inner Gold Wedding Letter that glides up and expands */}
          <div
            className={`absolute inset-x-5 top-5 h-[90%] rounded-xl bg-gradient-to-b from-[#3a0815] via-[#2a050f] to-[#1a0208] border-2 border-gold-400 shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center text-center p-4 ${isOpening
              ? '-translate-y-36 scale-110 opacity-100 shadow-[0_25px_60px_rgba(215,178,88,0.5)] z-20'
              : 'translate-y-2 scale-90 opacity-0 z-0 pointer-events-none'
              }`}
          >
            <div className="w-12 h-12 rounded-full border-2 border-gold-400/60 p-1 mb-2 bg-black/50 shadow-gold-glow flex items-center justify-center">
              <span className="font-serif text-sm font-black text-gold-gradient">L &amp; S</span>
            </div>
            <span className="font-serif text-[10px] tracking-[0.25em] uppercase text-gold-300 font-bold block">
              Royal Invitation
            </span>
            <h4 className="font-script text-3xl sm:text-4xl text-gold-foil leading-tight mt-1">
              Lakshani &amp; Shan
            </h4>
            <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-gold-200 uppercase mt-2 block">
              12 • 12 • 26
            </span>
          </div>

          {/* Envelope Flap Lines (Simulated Triangular Flap that rotates 180deg backward) */}
          <svg
            className={`absolute top-0 inset-x-0 w-full h-[55%] pointer-events-none transition-transform duration-700 origin-top z-10 ${isOpening ? '-rotate-x-180 opacity-15' : ''
              }`}
            viewBox="0 0 440 180"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 12 10 L 220 145 L 428 10"
              stroke="#d4af37"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
            <path
              d="M 10 0 L 220 140 L 430 0 Z"
              fill="url(#flapGrad)"
              opacity="0.35"
            />
            <defs>
              <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9c1d3c" />
                <stop offset="100%" stopColor="#3b0614" />
              </linearGradient>
            </defs>
          </svg>

          {/* The Golden Wax Seal Stamp in the Center */}
          <div
            className={`absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpening
              ? 'scale-150 opacity-0 rotate-45 pointer-events-none'
              : 'hover:scale-110 active:scale-95'
              }`}
          >
            <div className="relative w-20 h-20 md:w-22 md:h-22 rounded-full bg-wax-gold shadow-gold-glow flex items-center justify-center border-4 border-[#82590e] p-1">
              {/* Outer decorative rim */}
              <div className="w-full h-full rounded-full border-2 border-dashed border-[#593905] flex items-center justify-center flex-col shadow-inner">
                {/* Monogram Initials */}
                <span className="font-serif text-sm font-black text-[#3d2400] select-none whitespace-nowrap leading-none inline-flex items-center justify-center">
                  <span>S</span>
                  <span className="text-[0.8em] font-bold mx-0.5 self-center leading-none">&amp;</span>
                  <span>L</span>
                </span>
                <span className="text-[8px] font-sans font-bold tracking-widest text-[#5e3b03] select-none uppercase whitespace-nowrap mt-1">
                  DEC 12
                </span>
              </div>

              {/* Pulsing glow ring around seal */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-25 border-2 border-gold-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom instruction hint */}
        <p className={`mt-5 text-xs text-gold-300/80 font-serif tracking-widest uppercase transition-opacity duration-500 ${isOpening ? 'opacity-0' : 'opacity-100 animate-pulse'}`}>
          ✦ Tap Envelope Seal to Open ✦
        </p>
      </div>
    </div>
  );
}
