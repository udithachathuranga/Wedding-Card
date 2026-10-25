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
  groom: 'Shantha Ruban',
  bride: 'Lakshani Warnakulasooriya',
  dateFormatted: 'Saturday, December 19, 2026',
  timeFormatted: '7:00 PM Onwards',
  targetDateISO: '2026-12-19T19:00:00',
  venue: 'Jetwing Blue Hotel',
  venueAddress: 'Porutota Road, Negombo, Sri Lanka',
  googleMapsUrl: 'https://maps.google.com/?q=Jetwing+Blue+Hotel+Negombo',
  dressCode: 'Formal / Royal Festive Elegance',
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
  const code = params.get('id') || params.get('code') || 'SW-GUEST';

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

Dear *${guestFormatted}*,

Together with our families,
*${WEDDING_DETAILS.groom}* & *${WEDDING_DETAILS.bride}*
request the honor of your presence to celebrate their Holy Matrimony & Wedding Reception.

${companionText}

📅 *Date:* ${WEDDING_DETAILS.dateFormatted}
⏰ *Time:* ${WEDDING_DETAILS.timeFormatted}
📍 *Venue:* ${WEDDING_DETAILS.venue}, ${WEDDING_DETAILS.venueAddress}
✨ *Attire:* ${WEDDING_DETAILS.dressCode}

💌 *Tap the link below to open your personalized invitation card:*
${inviteUrl}

_We would be honored by your blessings and presence!_ 🥂💍`;
}

// Google Calendar URL Generator
export function getGoogleCalendarUrl() {
  const title = encodeURIComponent(`Wedding: ${WEDDING_DETAILS.groom} & ${WEDDING_DETAILS.bride}`);
  const details = encodeURIComponent(`Celebrating the wedding of ${WEDDING_DETAILS.groom} & ${WEDDING_DETAILS.bride} at Jetwing Blue Hotel, Negombo.`);
  const location = encodeURIComponent(`${WEDDING_DETAILS.venue}, ${WEDDING_DETAILS.venueAddress}`);
  // 20261219T133000Z to 20261219T180000Z (7pm to 11:30pm Sri Lanka time +05:30 is 13:30 to 18:00 UTC)
  const dates = '20261219T133000Z/20261219T180000Z';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

// Download .ics Calendar File
export function downloadIcsFile() {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Shantha & Waruni Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Wedding of ${WEDDING_DETAILS.groom} & ${WEDDING_DETAILS.bride}
DESCRIPTION:Celebrating the Holy Matrimony and Wedding Reception of Shantha Ruban and Lakshani Warnakulasooriya at Jetwing Blue Hotel.
LOCATION:${WEDDING_DETAILS.venue}, ${WEDDING_DETAILS.venueAddress}
DTSTART:20261219T133000Z
DTEND:20261219T180000Z
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Shantha-Waruni-Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// LocalStorage Persistence for Admin Guest Directory
const STORAGE_KEY = 'sw_wedding_guest_list_v1';

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
