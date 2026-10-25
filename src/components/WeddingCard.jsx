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
      {/* Top Floating Control Bar (Clean: only audio and envelope replay, NO admin button) */}
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
        {/* Regal Monogram Crest */}
        <div className="relative inline-flex flex-col items-center justify-center mb-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-gold-400/60 p-2.5 shadow-gold-glow flex items-center justify-center bg-gradient-to-br from-burgundy-900/70 to-black/85 backdrop-blur-sm animate-float-gentle">
            <div className="w-full h-full rounded-full border border-dashed border-gold-400/40 flex flex-col items-center justify-center px-3">
              <span className="font-serif text-2xl sm:text-3xl font-black text-gold-gradient tracking-wider whitespace-nowrap leading-none select-none">
                S &amp; W
              </span>
              <span className="text-[10px] sm:text-xs font-sans font-semibold tracking-[0.16em] text-gold-300/90 uppercase whitespace-nowrap mt-2.5 select-none">
                19 • 12 • 2026
              </span>
            </div>
          </div>
          <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-3" />
        </div>

        {/* Wedding Invitation Intro */}
        <p className="font-serif tracking-[0.3em] uppercase text-xs md:text-sm text-gold-300/90 mb-3 font-medium">
          Together With Their Families
        </p>

        {/* Couple Names */}
        <div className="space-y-1 mb-6">
          <h1 className="font-script text-5xl sm:text-6xl md:text-7xl text-gold-foil leading-tight filter drop-shadow-[0_2px_12px_rgba(200,153,50,0.4)]">
            Shantha Ruban
          </h1>
          <div className="flex items-center justify-center gap-3 my-1">
            <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-gold-400/60" />
            <span className="font-serif italic text-gold-300 text-lg md:text-xl font-light">
              and
            </span>
            <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-gold-400/60" />
          </div>
          <h2 className="font-script text-5xl sm:text-6xl md:text-7xl text-gold-foil leading-tight filter drop-shadow-[0_2px_12px_rgba(200,153,50,0.4)]">
            Waruni Dissanayaka
          </h2>
        </div>

        <p className="font-cormorant italic text-lg sm:text-xl md:text-2xl text-gold-200/90 max-w-xl mx-auto leading-relaxed">
          Request the honor of your presence and blessings as they exchange sacred vows and unite in Holy Matrimony.
        </p>

        {/* Personalized Guest Badge / Addressee Callout */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#2e0611]/90 via-[#1f030a]/85 to-[#160207]/90 border-2 border-gold-400/50 shadow-luxury max-w-xl mx-auto backdrop-blur-md relative overflow-hidden">
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

        {/* Hero Image Showcase */}
        <div className="mt-8 relative rounded-2xl overflow-hidden border border-gold-400/40 shadow-luxury group max-w-2xl mx-auto">
          <img
            src="/images/wedding_hero.jpg"
            alt="Shantha Ruban and Waruni Dissanayaka wedding celebration"
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

      {/* Date, Time & Venue Showcase */}
      <section className="py-12 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-serif tracking-[0.25em] text-xs text-gold-300 uppercase mb-2">
            The Celebration
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gold-gradient">
            Event Details &amp; Venue
          </h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-2" />
        </div>

        {/* Key Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Date Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#24040d]/90 to-[#140105]/90 border border-gold-400/30 text-center shadow-lg hover:border-gold-400/60 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center mx-auto mb-3 text-gold-300">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xs uppercase tracking-wider text-gold-300 mb-1">
              Date
            </h4>
            <p className="font-serif text-base font-bold text-gold-100">
              Saturday
            </p>
            <p className="font-serif text-lg font-extrabold text-gold-gradient">
              Dec 19, 2026
            </p>
          </div>

          {/* Time Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#24040d]/90 to-[#140105]/90 border border-gold-400/30 text-center shadow-lg hover:border-gold-400/60 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center mx-auto mb-3 text-gold-300">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xs uppercase tracking-wider text-gold-300 mb-1">
              Time
            </h4>
            <p className="font-serif text-base font-bold text-gold-100">
              Evening
            </p>
            <p className="font-serif text-lg font-extrabold text-gold-gradient">
              7:00 PM Onwards
            </p>
          </div>

          {/* Venue Card (Clickable to Google Maps) */}
          <a
            href={WEDDING_DETAILS.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl bg-gradient-to-b from-[#24040d]/90 to-[#140105]/90 border border-gold-400/30 hover:border-gold-400 text-center shadow-lg transition-all duration-300 hover:scale-[1.02] block cursor-pointer"
            title="Open Jetwing Blue Hotel in Google Maps"
          >
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/40 group-hover:bg-gold-500/30 flex items-center justify-center mx-auto mb-3 text-gold-300">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-xs uppercase tracking-wider text-gold-300 mb-1 flex items-center justify-center gap-1">
              <span>Location</span>
              <ExternalLink className="w-3 h-3 text-gold-400" />
            </h4>
            <p className="font-serif text-base font-bold text-gold-100 group-hover:text-gold-200">
              Jetwing Blue Hotel
            </p>
            <p className="text-xs text-gold-300/80 font-sans mt-0.5">
              Porutota Rd, Negombo ↗
            </p>
          </a>
        </div>

        {/* Venue Showcase with Image & Highly Visible Google Maps Integration for Desktop & Mobile */}
        <div className="rounded-2xl overflow-hidden border-2 border-gold-400/50 bg-gradient-to-b from-[#26050e] via-[#1a0309] to-[#120105] shadow-luxury">
          {/* Venue Image */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img
              src="/images/venue_jetwing.jpg"
              alt="Jetwing Blue Hotel Negombo wedding venue"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            {/* Overlay Headline */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-gold-500 text-burgundy-950 font-serif font-bold text-[10px] uppercase tracking-widest shadow-md mb-2">
                Luxury Seaside Destination
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-ivory-100 drop-shadow">
                Jetwing Blue Hotel, Negombo
              </h3>
              <p className="text-xs sm:text-sm text-gold-200 font-sans mt-1">
                Porutota Road, Ethukala, Negombo, Sri Lanka
              </p>
            </div>
          </div>

          {/* Prominent Desktop & Mobile Google Maps Action Bar */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-[#20030b] via-[#180208] to-[#20030b] border-t border-gold-400/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="text-left space-y-1">
                <span className="text-[11px] font-serif uppercase tracking-[0.2em] text-gold-300 font-semibold block">
                  ✦ Directions &amp; Guest Arrival ✦
                </span>
                <p className="font-serif text-lg font-bold text-gold-100">
                  Join Us on the Negombo Coastline
                </p>
                <p className="font-cormorant text-base sm:text-lg text-gold-200/90 leading-relaxed max-w-xl">
                  Jetwing Blue is situated right along the scenic Negombo beach with complimentary valet parking and dedicated entrance for wedding guests.
                </p>
              </div>

              {/* Bold, Glowing, High-Visibility Google Maps Button */}
              <div className="shrink-0 w-full md:w-auto">
                <a
                  href={WEDDING_DETAILS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto min-w-[240px] px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-400 text-burgundy-950 font-serif font-bold text-sm tracking-wider uppercase shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 flex items-center justify-center gap-3 text-center cursor-pointer select-none hover:scale-105 active:scale-95 border border-gold-200"
                >
                  <MapPin className="w-5 h-5 text-burgundy-950 fill-burgundy-950 shrink-0" />
                  <span className="font-extrabold whitespace-nowrap">Open in Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-burgundy-950 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Action Bar */}
        <div className="mt-8 max-w-lg mx-auto">
          {/* Add To Calendar */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#24040d]/90 to-[#120105]/90 border border-gold-400/30 flex flex-col items-center text-center justify-between gap-4 shadow-lg hover:border-gold-400/60 transition-colors">
            <div>
              <CalendarPlus className="w-8 h-8 text-gold-400 mx-auto mb-2 animate-pulse" />
              <h4 className="font-serif text-base font-bold text-gold-100 uppercase tracking-wider">
                Save The Date
              </h4>
              <p className="text-xs text-gold-200/80 font-cormorant text-base mt-1">
                Add Shantha &amp; Waruni&apos;s wedding to your personal calendar so you don&apos;t miss the celebration.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/50 text-gold-200 text-xs font-serif uppercase tracking-wider transition-colors text-center font-bold"
              >
                Google<br /> Calendar
              </a>
              <button
                onClick={downloadIcsFile}
                className="flex-1 py-3 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400/50 text-gold-200 text-xs font-serif uppercase tracking-wider transition-colors font-bold"
              >
                Apple / Outlook (.ics)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Royal Footer */}
      <footer className="mt-12 pt-10 border-t border-gold-400/20 text-center px-4 max-w-xl mx-auto">
        <span className="font-serif text-3xl font-black text-gold-gradient tracking-widest block mb-2">
          S &amp; W
        </span>
        <p className="font-script text-3xl sm:text-4xl text-gold-foil">
          Shantha Ruban &amp; Waruni Dissanayaka
        </p>
        <p className="text-xs text-gold-300/70 mt-2 font-serif tracking-widest uppercase">
          December 19, 2026 • Jetwing Blue Hotel, Negombo
        </p>
        <p className="text-[11px] text-gold-400/50 mt-3 italic font-cormorant text-sm">
          We look forward to celebrating the joy of our holy union with you!
        </p>
      </footer>
    </div>
  );
}
