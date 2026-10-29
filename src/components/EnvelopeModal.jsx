import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';
import { formatGuestFullName, getCompanionBadgeText } from '../utils/inviteHelper';

export default function EnvelopeModal({ guest, onOpened }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const currentGuest = guest || {
    title: 'Honored',
    name: 'Guest',
    companion: 'none',
    customSuffix: '',
  };

  const guestFullName = formatGuestFullName(currentGuest);
  const companionBadge = getCompanionBadgeText(currentGuest.companion, currentGuest.customSuffix);

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
    }, 1400);
  };

  if (isOpened) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a030a]/92 backdrop-blur-md transition-opacity duration-700 ${isOpening ? 'opacity-90' : 'opacity-100'
        }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,178,88,0.22)_0%,rgba(175,28,64,0.15)_40%,transparent_70%)] pointer-events-none" />

      {/* Main Envelope Presentation Container */}
      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Top Floating Prompt */}
        <div className="text-center mb-6 animate-fade-in-up">
          <p className="font-serif tracking-[0.3em] text-xs text-gold-300 uppercase mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Royal Wedding Invitation
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          </p>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-gold-foil leading-normal pt-3 pb-1 overflow-visible inline-block">
            Lakshani &amp; Shan
          </h2>
        </div>

        {/* The 3D Physical-Look Envelope */}
        <div
          onClick={handleOpenEnvelope}
          className={`group cursor-pointer relative w-full aspect-[16/11] max-w-[440px] rounded-2xl bg-gradient-to-br from-[#631227] via-[#460918] to-[#2c050f] border-2 border-gold-400/60 shadow-luxury transition-all duration-700 perspective-1000 transform ${isOpening ? 'scale-105 -translate-y-4' : 'hover:scale-[1.02] hover:border-gold-300'
            }`}
          role="button"
          tabIndex={0}
          aria-label="Open wedding invitation envelope"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
          }}
        >
          {/* Subtle envelope texture and gold corner brackets */}
          <div className="absolute inset-2 border border-gold-400/25 rounded-xl pointer-events-none" />
          {/* <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-gold-400/60" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-gold-400/60" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-gold-400/60" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-gold-400/60" /> */}

          {/* Envelope Flap Lines (Simulated Triangular Flap) */}
          <svg
            className={`absolute top-0 inset-x-0 w-full h-[55%] pointer-events-none transition-transform duration-700 origin-top ${isOpening ? '-rotate-x-180 opacity-20' : ''
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

          {/* Guest Addressee Card Plate (Mounted on front of envelope) */}
          {/* <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[86%] p-4 rounded-xl bg-gradient-to-b from-[#180308]/90 via-[#270610]/85 to-[#160207]/90 border border-gold-400/40 shadow-inner text-center z-10 backdrop-blur-sm">
            <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-gold-300/80 font-semibold block mb-1">
              — Exclusive Invitation For —
            </span> */}

          {/* Recipient Full Name */}
          {/* <h3 className="font-serif text-lg md:text-xl font-bold text-gold-gradient tracking-wide leading-tight py-0.5">
              {guestFullName}
            </h3> */}

          {/* Companion / Family Scope Indicator */}
          {/* <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-[11px] text-gold-200 font-sans">
              <Heart className="w-3 h-3 fill-gold-400 text-gold-400" />
              <span>{companionBadge}</span>
            </div>
          </div> */}

          {/* The Golden Wax Seal Stamp in the Center */}
          <div
            className={`absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 ${isOpening
              ? 'scale-150 opacity-0 rotate-45'
              : 'hover:scale-110 active:scale-95'
              }`}
          >
            <div className="relative w-20 h-20 md:w-22 md:h-22 rounded-full bg-wax-gold shadow-gold-glow flex items-center justify-center border-4 border-[#82590e] p-1">
              {/* Outer decorative rim */}
              <div className="w-full h-full rounded-full border-2 border-dashed border-[#593905] flex items-center justify-center flex-col shadow-inner">
                {/* Monogram Initials */}
                <span className="font-serif text-sm font-black text-[#3d2400] select-none whitespace-nowrap leading-none inline-flex items-center justify-center">
                  <span>L</span>
                  <span className="text-[0.8em] font-bold mx-0.5 self-center leading-none">&amp;</span>
                  <span>S</span>
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

        {/* Action Button & Instructions */}
        {/* <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={handleOpenEnvelope}
            disabled={isOpening}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-burgundy-950 font-serif font-bold text-sm tracking-widest uppercase shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-burgundy-900 group-hover:rotate-45 transition-transform" />
            <span>{isOpening ? 'Opening Invitation...' : 'Tap Wax Seal To Open'}</span>
            <Sparkles className="w-4 h-4 text-burgundy-900 group-hover:-rotate-45 transition-transform" />
          </button>

        </div> */}
      </div>
    </div>
  );
}
