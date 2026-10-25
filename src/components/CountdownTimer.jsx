import { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { WEDDING_DETAILS } from '../utils/inviteHelper';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    const targetDate = new Date(WEDDING_DETAILS.targetDateISO).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full max-w-xl mx-auto my-8 px-4">
      <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#2a0812]/90 via-[#1f050d]/85 to-[#160208]/90 border border-gold-400/40 shadow-gold-glow backdrop-blur-md text-center">
        {/* Decorative corner motifs */}
        <div className="absolute top-2 left-2 text-gold-400/50 text-xs">✦</div>
        <div className="absolute top-2 right-2 text-gold-400/50 text-xs">✦</div>
        <div className="absolute bottom-2 left-2 text-gold-400/50 text-xs">✦</div>
        <div className="absolute bottom-2 right-2 text-gold-400/50 text-xs">✦</div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-gold-300 animate-pulse" />
          <span className="font-serif tracking-[0.25em] text-xs md:text-sm text-gold-200 uppercase font-semibold">
            Counting Down To Forever
          </span>
          <Sparkles className="w-4 h-4 text-gold-300 animate-pulse" />
        </div>

        <h3 className="font-serif text-lg md:text-xl text-gold-100 mb-6 font-medium">
          {timeLeft.isCompleted ? (
            <span className="flex items-center justify-center gap-2 text-gold-300">
              <Heart className="w-5 h-5 fill-burgundy-500 text-burgundy-500 animate-bounce" />
              Today We Celebrate Our Love!
            </span>
          ) : (
            'Until We Say "I Do"'
          )}
        </h3>

        {/* 4 Time Cards */}
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {timeUnits.map((unit, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl bg-gradient-to-b from-burgundy-950/80 to-[#120207] border border-gold-500/30 shadow-inner hover:border-gold-400/70 transition-all duration-300 hover:scale-105"
            >
              {/* Digit with metallic gold glow */}
              <span className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-gold-gradient tracking-tight">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[10px] md:text-xs tracking-[0.2em] font-sans text-gold-200/80 uppercase font-medium">
                {unit.label}
              </span>
              {/* Subtle accent line */}
              <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mt-1.5" />
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-gold-300/80 italic font-cormorant text-sm">
          Saturday, December 19, 2026 • 7:00 PM • Jetwing Blue Hotel, Negombo
        </p>
      </div>
    </div>
  );
}
