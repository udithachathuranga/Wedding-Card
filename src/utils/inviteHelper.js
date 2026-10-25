// Helper utilities for managing wedding invitations, URL parameters, WhatsApp sharing, and Calendar events

export const TITLE_OPTIONS = [
  'Mr.',
  'Mrs.',
  'Miss',
  'Ms.',
  'Rev.',
  'Rev. Fr.',
  'Dr.',
  'Hon.',
  'Prof.',
  'Pastor',
  'Eng.',
  'Master',
  'Mr. & Mrs.',
];

export const COMPANION_OPTIONS = [
  { id: 'none', label: 'Single / Individual', suffix: '' },
  { id: 'partner', label: 'With Partner / Spouse', suffix: '& Partner' },
  { id: 'family', label: 'With Whole Family', suffix: '& Family' },
  { id: 'custom', label: 'Custom Suffix', suffix: '' },
];

export const WEDDING_DETAILS = {
  coupleTitle: 'Lakshani & Shan',
  groom: 'Shantha Ruban',
  bride: 'Lakshani Warnakulasooriya',
  monogram: 'L & S',
  groomParents: 'Mr. & Mrs. Idayaraja',
  brideParents: 'Mr. & Mrs. Warnakulasooriya',
  dateFormatted: '12th of December 2026',
  dateDayFormatted: 'Saturday, December 12, 2026',
  shortDate: '12 • 12 • 26',
  targetDateISO: '2026-12-12T16:00:00', // 4:00 PM
  churchTitle: "St. John's Church - Modera",
  churchTime: '4:00 PM',
  churchMassText: "church mass begins at 4.00 pm at St. John's church - Modera",
  churchMapsUrl: "https://maps.google.com/?q=St.+John's+Church+Modera",
  receptionTitle: 'White Tower Hotel - Ja-Ela',
  receptionTime: 'Followed by reception',
  receptionText: 'followed by the reception At white tower hotel - Ja-ela',
  receptionMapsUrl: 'https://maps.google.com/?q=White+Tower+Hotel+Ja-Ela',
  rsvpText: 'rsvp (regrets only)',
  rsvpPhone: '076 0522561',
  rsvpPhoneTel: 'tel:0760522561',
  rsvpWhatsappUrl: 'https://wa.me/94760522561',
};

// Generate clean query string or encoded payload
export function generateInviteUrl(guestData) {
  // Always generate root '/' URL for guest links so they never point to /admin
  const origin = window.location.origin;
  const baseUrl = `${origin}/`;
  const params = new URLSearchParams();

  if (guestData.title) params.set('t', guestData.title);
  if (guestData.name) params.set('n', guestData.name);
  if (guestData.companion) params.set('c', guestData.companion);
  if (guestData.customSuffix) params.set('s', guestData.customSuffix);
  if (guestData.seats) params.set('p', guestData.seats);
  if (guestData.note) params.set('msg', guestData.note);
  if (guestData.code) params.set('id', guestData.code);

  return `${baseUrl}?${params.toString()}`;
}

// Parse invite parameters from URL
export function parseInviteFromUrl() {
  const search = window.location.search;
  const params = new URLSearchParams(search);

  // Check if params exist
  const title = params.get('t') || params.get('title') || 'Honored';
  const name = params.get('n') || params.get('name') || 'Guest';
  const companion = params.get('c') || params.get('companion') || 'none';
  const customSuffix = params.get('s') || params.get('suffix') || '';
  const seats = params.get('p') || params.get('seats') || '2';
  const note = params.get('msg') || params.get('note') || '';
  const code = params.get('id') || params.get('code') || 'LS-GUEST';

  const isCustomGuest = params.has('n') || params.has('name') || params.has('t');

  return {
    title,
    name,
    companion,
    customSuffix,
    seats,
    note,
    code,
    isCustomGuest,
  };
}

// Compute the full formatted greeting string (e.g., "Rev. Fr. Jude Silva", "Mr. & Mrs. Perera & Family")
export function formatGuestFullName(guest) {
  if (!guest) return 'Cherished Guest';

  const titlePart = guest.title ? `${guest.title} ` : '';
  let companionPart = '';

  if (guest.companion === 'partner') {
    companionPart = ' & Partner';
  } else if (guest.companion === 'family') {
    companionPart = ' & Family';
  } else if (guest.companion === 'custom' && guest.customSuffix) {
    companionPart = ` ${guest.customSuffix}`;
  }

  return `${titlePart}${guest.name}${companionPart}`.trim();
}

// Format descriptive companion badge text
export function getCompanionBadgeText(companion, customSuffix) {
  switch (companion) {
    case 'family':
      return 'Cordially Inviting the Whole Family';
    case 'partner':
      return 'Cordially Inviting with Partner / Spouse';
    case 'custom':
      return customSuffix ? `Invited: ${customSuffix}` : 'Special Guest';
    case 'none':
    default:
      return 'Individual Invitation';
  }
}

// Generate formatted WhatsApp message for quick sharing
export function generateWhatsAppMessage(guest, inviteUrl) {
  const guestFormatted = formatGuestFullName(guest);
  const companionText = guest?.companion === 'family'
    ? 'We warmly invite you and your entire family to join us.'
    : guest?.companion === 'partner'
      ? 'We warmly invite you and your partner to join us.'
      : 'We warmly invite you to join us.';

  return `👑 *WEDDING INVITATION* 👑

${WEDDING_DETAILS.groomParents} Together with
${WEDDING_DETAILS.brideParents}
Request the honour of the presence of

*${guestFormatted}*

To celebrate the special day of
💍 *${WEDDING_DETAILS.coupleTitle}* 💍
(${WEDDING_DETAILS.bride} & ${WEDDING_DETAILS.groom})

${companionText}

📅 *Date:* ${WEDDING_DETAILS.dateFormatted} (${WEDDING_DETAILS.dateDayFormatted})
⛪ *Church Mass:* ${WEDDING_DETAILS.churchTime} at ${WEDDING_DETAILS.churchTitle}
🥂 *Reception:* Followed by reception at ${WEDDING_DETAILS.receptionTitle}
💌 *RSVP (Regrets Only):* ${WEDDING_DETAILS.rsvpPhone}

💌 *Tap the link below to open your personalized invitation card:*
${inviteUrl}

_We look forward to celebrating this blessed day together!_ ✨💍`;
}

// Google Calendar URL Generator
export function getGoogleCalendarUrl() {
  const title = encodeURIComponent(`Wedding: ${WEDDING_DETAILS.coupleTitle}`);
  const details = encodeURIComponent(
    `Wedding of ${WEDDING_DETAILS.coupleTitle} (${WEDDING_DETAILS.bride} & ${WEDDING_DETAILS.groom}).\n` +
    `• Church Mass: 4:00 PM at ${WEDDING_DETAILS.churchTitle}\n` +
    `• Reception: Following the mass at ${WEDDING_DETAILS.receptionTitle}\n` +
    `• RSVP (Regrets only): ${WEDDING_DETAILS.rsvpPhone}`
  );
  const location = encodeURIComponent(`${WEDDING_DETAILS.churchTitle} & ${WEDDING_DETAILS.receptionTitle}`);
  // Dec 12, 2026: 4:00 PM (16:00 SLT = 10:30 UTC) to 11:30 PM (23:30 SLT = 18:00 UTC)
  const dates = '20261212T103000Z/20261212T180000Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

// Download .ics Calendar File
export function downloadIcsFile() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lakshani & Shan Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Wedding of ${WEDDING_DETAILS.coupleTitle}
DESCRIPTION:Celebrating the Wedding of ${WEDDING_DETAILS.coupleTitle} (${WEDDING_DETAILS.bride} & ${WEDDING_DETAILS.groom}). Church mass at 4.00 pm at St. John's church - Modera, followed by reception at White Tower Hotel - Ja-Ela. RSVP (regrets only): 076 0522561.
LOCATION:${WEDDING_DETAILS.churchTitle} / ${WEDDING_DETAILS.receptionTitle}
DTSTART:20261212T103000Z
DTEND:20261212T180000Z
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Lakshani-Shan-Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// LocalStorage Persistence for Admin Guest Directory
const STORAGE_KEY = 'ls_wedding_guest_list_v2';

export function getSavedGuests() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGuestToStorage(guest) {
  const current = getSavedGuests();
  const existingIdx = current.findIndex((g) => g.id === guest.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = guest;
  } else {
    updated = [guest, ...current];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteGuestFromStorage(id) {
  const current = getSavedGuests();
  const updated = current.filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
