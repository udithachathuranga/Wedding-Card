import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  CalendarPlus,
  Compass,
  Sparkles,
  MailOpen,
  ExternalLink,
  Church,
} from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import {
  formatGuestFullName,
  getCompanionBadgeText,
  WEDDING_DETAILS,
  getGoogleCalendarUrl,
  downloadIcsFile,
} from '../utils/inviteHelper';
import { weddingAudio } from '../utils/audioPlayer';

export default function WeddingCard({
  guest,
  onReplayEnvelope,
}) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(weddingAudio.isPlaying);

  const currentGuest = guest || {
    title: 'Honored',
    name: 'Guest',
    companion: 'none',
    customSuffix: '',
    seats: 2,
    note: '',
  };

  const guestFullName = formatGuestFullName(currentGuest);
  const companionBadge = getCompanionBadgeText(currentGuest.companion, currentGuest.customSuffix);

  const toggleMusic = () => {
    const active = weddingAudio.toggle();
    setIsPlayingMusic(active);
  };

  return (
    <div className="relative min-h-screen pb-24 text-ivory-100 overflow-x-hidden">
      {/* Top Floating Control Bar */}
      <header className="fixed top-4 inset-x-0 z-40 px-4 max-w-4xl mx-auto flex items-center justify-between pointer-events-none">
        {/* Audio Toggle */}
        <button
          onClick={toggleMusic}
          className="pointer-events-auto p-2.5 rounded-full bg-burgundy-950/80 hover:bg-burgundy-900 border border-gold-400/50 shadow-gold-glow backdrop-blur-md text-gold-300 hover:text-gold-100 transition-all hover:scale-110 flex items-center gap-2 text-xs font-serif"
          title={isPlayingMusic ? 'Mute Background Music' : 'Play Background Music'}
          aria-label="Toggle wedding music"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
              <span className="hidden sm:inline pr-1">Music Playing</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-gold-300/60" />
              <span className="hidden sm:inline pr-1">Play Music</span>
            </>
          )}
        </button>

        {/* Envelope Replay Button */}
        {onReplayEnvelope && (
          <button
            onClick={onReplayEnvelope}
            className="pointer-events-auto p-2.5 rounded-full bg-burgundy-950/80 hover:bg-burgundy-900 border border-gold-400/40 shadow backdrop-blur-md text-gold-300 hover:text-gold-100 transition-all hover:scale-105 flex items-center gap-1.5 text-xs font-serif"
            title="Re-open Envelope Animation"
          >
            <MailOpen className="w-4 h-4 text-gold-400" />
            <span className="hidden md:inline">View Envelope</span>
          </button>
        )}
      </header>

      {/* Hero Wedding Announcement Card */}
      <section className="relative pt-20 md:pt-28 pb-12 px-4 max-w-3xl mx-auto text-center">
        {/* Iconic Date Crest (12 • 12 • 26 & Monogram L & S) */}
        <div className="relative inline-flex flex-col items-center justify-center mb-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-gold-400/60 p-2.5 shadow-gold-glow flex items-center justify-center bg-gradient-to-br from-burgundy-900/70 to-black/85 backdrop-blur-sm animate-float-gentle">
            <div className="w-full h-full rounded-full border border-dashed border-gold-400/40 flex flex-col items-center justify-center px-3">
              <div className="font-serif text-2xl sm:text-3xl whitespace-nowrap leading-none select-none inline-flex items-center justify-center">
                <span className="text-[1.5em] font-black text-gold-gradient">L</span>
                <span className="font-normal mx-1.5 self-center text-gold-300 text-xl sm:text-2xl leading-none">&amp;</span>
                <span className="text-[1.5em] font-black text-gold-gradient">S</span>
              </div>
              <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.16em] text-gold-300/90 uppercase whitespace-nowrap mt-2.5 select-none">
                {WEDDING_DETAILS.shortDate}
              </span>
            </div>
          </div>
          <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-3" />
        </div>

        {/* Parents / Hosts Official Invitation Header (from actual card) */}
        <div className="space-y-1 animate-fade-in-up">
          <p className="font-serif text-xs sm:text-sm text-gold-200/90 tracking-[0.2em] uppercase font-medium">
            {WEDDING_DETAILS.groomParents} Together with
          </p>
          <p className="font-serif text-xs sm:text-sm text-gold-200/90 tracking-[0.2em] uppercase font-medium">
            {WEDDING_DETAILS.brideParents}
          </p>
          <p className="font-cormorant italic text-base sm:text-lg text-gold-300/80 mt-2">
            Request the honour of the presence of
          </p>
        </div>



        {/* Couple Names (Lakshani & Shan) */}
        <div className="space-y-2 mb-6">
          <h1 className="font-script text-5xl sm:text-6xl md:text-7xl text-gold-foil leading-normal pt-3 pb-1 overflow-visible inline-block filter drop-shadow-[0_2px_12px_rgba(200,153,50,0.4)]">
            {WEDDING_DETAILS.coupleTitle}
          </h1>
          <p className="pb-6 font-serif text-xs sm:text-sm text-gold-300/70 tracking-widest uppercase">
            ({WEDDING_DETAILS.bride} &amp; {WEDDING_DETAILS.groom})
          </p>

          {/* Personalized Guest Badge / Addressee Callout */}
          <div className="my-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#2e0611]/90 via-[#1f030a]/85 to-[#160207]/90 border-2 border-gold-400/50 shadow-luxury max-w-xl mx-auto backdrop-blur-md relative overflow-hidden">
            {/* Subtle gold ribbon top accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />

            <span className="text-[10px] md:text-xs font-serif uppercase tracking-[0.25em] text-gold-300/80 block mb-2 font-semibold">
              ✦ Cordially Invited ✦
            </span>

            {/* Formatted Guest Name with Title */}
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gold-gradient tracking-wide">
              {guestFullName}
            </h3>

            {/* Companion / Family Scope Pill */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/40 text-xs sm:text-sm text-gold-200 font-sans shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span className="font-medium">{companionBadge}</span>
            </div>

            {currentGuest?.seats && (
              <p className="mt-2 text-xs text-gold-300/70 font-sans">
                Seats Reserved in Your Honor: <strong className="text-gold-200">{currentGuest.seats}</strong>
              </p>
            )}

            {currentGuest?.note && (
              <div className="mt-3 pt-3 border-t border-gold-400/20 text-xs italic text-gold-200/80 font-cormorant text-base">
                &ldquo;{currentGuest.note}&rdquo;
              </div>
            )}
          </div>

          <p className="font-cormorant italic text-lg sm:text-xl md:text-2xl text-gold-200/90 max-w-xl mx-auto leading-relaxed pt-2">
            Invite you to join them on their special day
          </p>
          <div className="inline-block px-4 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-xs sm:text-sm font-serif font-bold text-gold-200 tracking-widest uppercase mt-2">
            {WEDDING_DETAILS.dateFormatted}
          </div>
        </div>

        {/* Hero Photo Showcase */}
        <div className="mt-6 relative rounded-2xl overflow-hidden border border-gold-400/40 shadow-luxury group max-w-2xl mx-auto">
          <img
            src="/images/wedding_hero.jpg"
            alt="Lakshani and Shan wedding celebration"
            className="w-full h-[280px] sm:h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-6 text-center">
            <p className="font-serif italic text-sm sm:text-base text-gold-200 drop-shadow">
              &ldquo;Two lives, two hearts, joined together in friendship, united forever in love.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section className="px-4">
        <CountdownTimer />
      </section>

      {/* Key Wedding Locations Section (Church Mass & Reception) */}
      <section className="py-12 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-serif tracking-[0.25em] text-xs text-gold-300 uppercase mb-2">
            Order of the Day
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gold-gradient">
            Ceremony &amp; Reception Venues
          </h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-2" />
        </div>

        {/* Two Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Church Mass */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#26050e] via-[#1a0309] to-[#120105] border-2 border-gold-400/40 shadow-luxury flex flex-col justify-between text-left group hover:border-gold-400/70 transition-all">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-400/40 font-serif font-bold text-[10px] uppercase tracking-wider whitespace-nowrap shrink-0">
                  Holy Matrimony
                </span>
                <span className="text-xs font-serif font-bold text-gold-gradient flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  {WEDDING_DETAILS.churchTime}
                </span>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center shrink-0 text-gold-300 group-hover:scale-110 transition-transform">
                  <Church className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-gold-100 group-hover:text-gold-gradient transition-colors">
                    {WEDDING_DETAILS.churchTitle}
                  </h3>
                  <p className="text-xs text-gold-200/80 font-cormorant text-base mt-1 italic">
                    church mass begins at 4.00 pm at St. John&apos;s church - Modera
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gold-400/20 mt-4">
              <a
                href={WEDDING_DETAILS.churchMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-400 text-burgundy-950 font-serif font-bold text-xs tracking-wider uppercase shadow-gold-glow flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-center"
              >
                <MapPin className="w-4 h-4 text-burgundy-950 fill-burgundy-950 shrink-0" />
                <span>Open Church in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-burgundy-950 shrink-0" />
              </a>
            </div>
          </div>

          {/* Card 2: Reception */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#26050e] via-[#1a0309] to-[#120105] border-2 border-gold-400/40 shadow-luxury flex flex-col justify-between text-left group hover:border-gold-400/70 transition-all">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-400/40 font-serif font-bold text-[10px] uppercase tracking-wider whitespace-nowrap shrink-0">
                  Wedding Reception
                </span>
                <span className="text-xs font-serif font-bold text-gold-gradient flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  {WEDDING_DETAILS.receptionTime}
                </span>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center shrink-0 text-gold-300 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-gold-100 group-hover:text-gold-gradient transition-colors">
                    {WEDDING_DETAILS.receptionTitle}
                  </h3>
                  <p className="text-xs text-gold-200/80 font-cormorant text-base mt-1 italic">
                    followed by the reception At white tower hotel - Ja-ela
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gold-400/20 mt-4">
              <a
                href={WEDDING_DETAILS.receptionMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-400 text-burgundy-950 font-serif font-bold text-xs tracking-wider uppercase shadow-gold-glow flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-center"
              >
                <MapPin className="w-4 h-4 text-burgundy-950 fill-burgundy-950 shrink-0" />
                <span>Open Reception in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-burgundy-950 shrink-0" />
              </a>
            </div>
          </div>
        </div>


        {/* Save The Date / Calendar Action Bar */}
        <div className="max-w-lg mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#24040d]/90 to-[#120105]/90 border border-gold-400/30 flex flex-col items-center text-center justify-between gap-4 shadow-lg hover:border-gold-400/60 transition-colors">
            <div>
              <CalendarPlus className="w-8 h-8 text-gold-400 mx-auto mb-2 animate-pulse" />
              <h4 className="font-serif text-base font-bold text-gold-100 uppercase tracking-wider">
                Save The Date
              </h4>
              <p className="text-xs text-gold-200/80 font-cormorant text-base mt-1">
                Add Lakshani &amp; Shan&apos;s wedding to your personal calendar so you don&apos;t miss the celebration.
              </p>
            </div>
            <div className="flex items-stretch gap-3 w-full">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/50 text-gold-200 text-xs font-serif uppercase tracking-wider transition-colors font-bold flex flex-col items-center justify-center leading-tight min-h-[54px]"
              >
                <span>Google</span>
                <span className="mt-0.5">Calendar</span>
              </a>
              <button
                onClick={downloadIcsFile}
                className="flex-1 py-2.5 px-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/50 text-gold-200 text-xs font-serif uppercase tracking-wider transition-colors font-bold flex flex-col items-center justify-center leading-tight min-h-[54px]"
              >
                <span>Apple / Outlook</span>
                <span className="mt-0.5">(.ics)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Royal Footer */}
      <footer className="mt-12 pt-10 border-t border-gold-400/20 text-center px-4 max-w-xl mx-auto">
        {/* <span className="font-serif text-3xl font-black text-gold-gradient block mb-2 whitespace-nowrap leading-none select-none inline-flex items-center justify-center">
          <span>L</span>
          <span className="text-[0.58em] font-normal mx-2 self-center opacity-95 leading-none">&amp;</span>
          <span>S</span>
        </span> */}
        <p className="font-script text-3xl sm:text-4xl text-gold-foil leading-normal pt-2 pb-1 overflow-visible inline-block">
          {WEDDING_DETAILS.coupleTitle}
        </p>
        <p className="text-xs text-gold-300/70 mt-2 font-serif tracking-widest uppercase">
          {WEDDING_DETAILS.dateFormatted} • {WEDDING_DETAILS.churchTitle}
        </p>
        <p className="text-[11px] text-gold-400/50 mt-3 italic font-cormorant text-sm">
          We look forward to celebrating the joy of our holy union with you!
        </p>
      </footer>
    </div>
  );
}
