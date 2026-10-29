import { useState } from 'react';
import { X, Heart, CheckCircle2, Send, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatGuestFullName, WEDDING_DETAILS } from '../utils/inviteHelper';

export default function RsvpModal({ guest, isOpen, onClose, onRsvpSubmitted }) {
  const [attending, setAttending] = useState('yes'); // 'yes' | 'no'
  const [guestCount, setGuestCount] = useState(guest?.seats ? parseInt(guest.seats, 10) : 2);
  const [dietary, setDietary] = useState('Standard');
  const [blessing, setBlessing] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const guestFullName = formatGuestFullName(guest);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (attending === 'yes') {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffe28a', '#d8a73f', '#e8758d'],
      });
    }

    setSubmitted(true);

    if (onRsvpSubmitted) {
      onRsvpSubmitted({
        guestName: guestFullName,
        attending,
        guestCount: attending === 'yes' ? guestCount : 0,
        dietary,
        blessing,
        submittedAt: new Date().toISOString(),
      });
    }
  };

  const handleSendWhatsAppRsvp = () => {
    const statusText = attending === 'yes' ? '🎉 Joyfully Accepting' : '💌 Regretfully Declining';
    const countText = attending === 'yes' ? `\n👥 Attending Guests: ${guestCount}` : '';
    const dietText = attending === 'yes' ? `\n🍽️ Meal Preference: ${dietary}` : '';
    const noteText = blessing ? `\n\n💬 Warm Wishes:\n"${blessing}"` : '';

    const text = encodeURIComponent(
      `💍 *WEDDING RSVP - Shantha & Lakshani* 💍\n\n` +
      `👤 *Guest Name:* ${guestFullName}\n` +
      `✨ *Response:* ${statusText}${countText}${dietText}${noteText}\n\n` +
      `📅 Event: Dec 12, 2026 at Jetwing Blue Hotel`
    );

    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#390918] via-[#2a0510] to-[#1e030b] border border-gold-400/50 p-6 md:p-8 shadow-luxury text-ivory-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gold-300/70 hover:text-gold-200 transition-colors rounded-full hover:bg-gold-500/10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <span className="text-[11px] tracking-[0.25em] font-serif uppercase text-gold-300">
                Response Requested
              </span>
              <h3 className="font-serif text-2xl font-bold text-gold-gradient mt-1">
                RSVP for the Wedding
              </h3>
              <p className="text-xs text-gold-200/70 mt-1 font-cormorant text-base">
                Honoring {guestFullName}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Attendance Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`p-3.5 rounded-xl border text-center transition-all ${attending === 'yes'
                    ? 'bg-gold-500/20 border-gold-400 text-gold-200 shadow-gold-glow'
                    : 'bg-black/40 border-gold-400/20 text-ivory-200/60 hover:border-gold-400/40'
                    }`}
                >
                  <Heart className={`w-5 h-5 mx-auto mb-1 ${attending === 'yes' ? 'fill-gold-400 text-gold-400' : ''}`} />
                  <span className="text-xs font-serif font-bold uppercase tracking-wider block">
                    Accepts Joyfully
                  </span>
                  <span className="text-[10px] opacity-75">I / We will attend</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`p-3.5 rounded-xl border text-center transition-all ${attending === 'no'
                    ? 'bg-burgundy-900/40 border-burgundy-400 text-gold-200'
                    : 'bg-black/40 border-gold-400/20 text-ivory-200/60 hover:border-gold-400/40'
                    }`}
                >
                  <X className="w-5 h-5 mx-auto mb-1 text-burgundy-400" />
                  <span className="text-xs font-serif font-bold uppercase tracking-wider block">
                    Declines Regretfully
                  </span>
                  <span className="text-[10px] opacity-75">Will be there in spirit</span>
                </button>
              </div>

              {attending === 'yes' && (
                <>
                  {/* Guest Count */}
                  <div>
                    <label className="block text-xs font-serif text-gold-300 uppercase tracking-wider mb-1.5">
                      Number of Attending Guests
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 focus:outline-none focus:border-gold-400 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                        <option key={num} value={num} className="bg-burgundy-950 text-ivory-100">
                          {num} {num === 1 ? 'Guest' : 'Guests (Family / Party)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dietary Requirements */}
                  <div>
                    <label className="block text-xs font-serif text-gold-300 uppercase tracking-wider mb-1.5">
                      Dietary Preference
                    </label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 focus:outline-none focus:border-gold-400 text-sm"
                    >
                      <option value="Standard Buffet" className="bg-burgundy-950 text-ivory-100">
                        Standard Wedding Banquet Buffet
                      </option>
                      <option value="Vegetarian" className="bg-burgundy-950 text-ivory-100">
                        Vegetarian
                      </option>
                      <option value="Halal Friendly" className="bg-burgundy-950 text-ivory-100">
                        Halal Friendly
                      </option>
                      <option value="Seafood Specialty" className="bg-burgundy-950 text-ivory-100">
                        Seafood Special
                      </option>
                      <option value="Kids Menu" className="bg-burgundy-950 text-ivory-100">
                        Including Children Meals
                      </option>
                    </select>
                  </div>
                </>
              )}

              {/* Warm Wishes & Blessings */}
              <div>
                <label className="block text-xs font-serif text-gold-300 uppercase tracking-wider mb-1.5">
                  Blessing / Message for Shantha &amp; Lakshani
                </label>
                <textarea
                  value={blessing}
                  onChange={(e) => setBlessing(e.target.value)}
                  placeholder="Leave a heartfelt note or blessing for the couple..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 placeholder-gold-300/30 focus:outline-none focus:border-gold-400 text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-burgundy-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-glow hover:shadow-gold-glow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-burgundy-900" />
                  <span>Confirm RSVP</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-gold-gradient">
              Thank You, {guestFullName}!
            </h3>
            <p className="text-sm text-gold-200/90 font-cormorant text-lg">
              {attending === 'yes'
                ? `We are delighted that you will join us at Jetwing Blue on December 12 to celebrate our wedding!`
                : `Thank you for letting us know. You will be dearly missed in person, but with us in spirit!`}
            </p>

            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={handleSendWhatsAppRsvp}
                className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-sans font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send Confirmation Directly via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-gold-300/80 hover:text-gold-200 font-serif uppercase tracking-widest"
              >
                Return to Invitation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
