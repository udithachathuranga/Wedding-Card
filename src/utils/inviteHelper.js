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
  receptionTime: '6:30 PM',
  receptionText: 'The reception begins at 6:30 PM at White Tower Hotel - Ja-Ela',
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
  const guestCode = guestData.id || guestData.code;
  if (guestCode) params.set('id', guestCode);

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
    id: code,
    code,
    title,
    name,
    companion,
    customSuffix,
    seats,
    note,
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

  return `✨ *WEDDING INVITATION* ✨

Dear *${guestFormatted}*,

Together with our families, we cordially invite you to celebrate the holy matrimony and wedding of

💍 *${WEDDING_DETAILS.coupleTitle}* 💍
_(${WEDDING_DETAILS.bride} & ${WEDDING_DETAILS.groom})_

🗓️ *Save the Date:* ${WEDDING_DETAILS.dateFormatted}

Your presence, prayers, and blessings will make our special day truly complete and unforgettable! 🥂✨

💌 *For complete event schedule, church & reception venues, interactive map directions, and your personalized card, please tap the link below:*
👇👇👇
${inviteUrl}

_We can't wait to celebrate this blessed milestone together with you!_ 🕊️🤍`;
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
const RSVP_STORAGE_KEY = 'ls_wedding_rsvps_v2';

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
    updated[existingIdx] = { ...current[existingIdx], ...guest };
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

  // Also remove from RSVP store if present
  try {
    const rsvps = getSavedRsvps();
    delete rsvps[id];
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));
  } catch {
    // Ignore error
  }

  return updated;
}

// RSVP Storage and Attendance Tracking
export function getSavedRsvps() {
  try {
    const data = localStorage.getItem(RSVP_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveRsvpResponse(rsvpData) {
  try {
    const rsvps = getSavedRsvps();
    const guestId = rsvpData.guestId || rsvpData.id || 'LS-GUEST';
    const guestName = rsvpData.guestName || 'Cherished Guest';
    const submittedAt = rsvpData.submittedAt || new Date().toISOString();

    const record = {
      ...rsvpData,
      guestId,
      guestName,
      submittedAt,
    };

    // Index by both ID and Name to ensure matching across query strings and storage
    rsvps[guestId] = record;
    rsvps[guestName.toLowerCase()] = record;
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));

    // Also update guest entry in Guest Directory if it exists
    const currentGuests = getSavedGuests();
    const matchIdx = currentGuests.findIndex(
      (g) => g.id === guestId || formatGuestFullName(g).toLowerCase() === guestName.toLowerCase() || g.name?.toLowerCase() === guestName.toLowerCase()
    );

    if (matchIdx >= 0) {
      currentGuests[matchIdx] = {
        ...currentGuests[matchIdx],
        attendance: rsvpData.attending === 'yes' ? 'attending' : 'declined',
        attendingCount: rsvpData.attending === 'yes' ? (rsvpData.guestCount ?? currentGuests[matchIdx].seats ?? 1) : 0,
        dietary: rsvpData.dietary || currentGuests[matchIdx].dietary || 'Standard',
        blessing: rsvpData.blessing || currentGuests[matchIdx].blessing || '',
        rsvpAt: submittedAt,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentGuests));
    }

    // Dispatch global event for realtime UI reactivity
    window.dispatchEvent(new CustomEvent('wedding_rsvp_updated', { detail: record }));

    return record;
  } catch (err) {
    console.error('Error saving RSVP response:', err);
    return null;
  }
}

export function getGuestRsvp(guest) {
  if (!guest) return null;
  const rsvps = getSavedRsvps();
  const idKey = guest.id || guest.code;
  const nameKey = formatGuestFullName(guest).toLowerCase();
  const rawNameKey = guest.name?.toLowerCase();

  return (idKey && rsvps[idKey]) || (nameKey && rsvps[nameKey]) || (rawNameKey && rsvps[rawNameKey]) || null;
}

export function getGuestsWithRsvp() {
  const guests = getSavedGuests();
  const rsvps = getSavedRsvps();

  return guests.map((g) => {
    const idKey = g.id;
    const nameKey = formatGuestFullName(g).toLowerCase();
    const rsvp = (idKey && rsvps[idKey]) || (nameKey && rsvps[nameKey]);

    if (rsvp) {
      return {
        ...g,
        attendance: rsvp.attending === 'yes' ? 'attending' : 'declined',
        attendingCount: rsvp.attending === 'yes' ? (rsvp.guestCount ?? g.seats ?? 1) : 0,
        dietary: rsvp.dietary || g.dietary || 'Standard',
        blessing: rsvp.blessing || g.blessing || '',
        rsvpAt: rsvp.submittedAt || g.rsvpAt,
      };
    }

    return {
      ...g,
      attendance: g.attendance || 'pending',
      attendingCount: g.attendance === 'attending' ? (g.attendingCount ?? g.seats ?? 1) : 0,
      dietary: g.dietary || 'Standard',
      blessing: g.blessing || '',
    };
  });
}

export function updateGuestAttendance(guestId, status, attendingCount = 2, dietary = 'Standard', blessing = '') {
  // status: 'attending' | 'declined' | 'pending'
  const guests = getSavedGuests();
  const idx = guests.findIndex((g) => g.id === guestId);
  const now = new Date().toISOString();

  if (idx >= 0) {
    guests[idx].attendance = status;
    guests[idx].attendingCount = status === 'attending' ? (attendingCount || guests[idx].seats || 1) : 0;
    if (dietary) guests[idx].dietary = dietary;
    if (blessing) guests[idx].blessing = blessing;
    guests[idx].rsvpAt = status === 'pending' ? null : now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  }

  // Also update RSVP cache
  const rsvps = getSavedRsvps();
  if (status === 'pending') {
    delete rsvps[guestId];
  } else {
    rsvps[guestId] = {
      guestId,
      guestName: idx >= 0 ? formatGuestFullName(guests[idx]) : guestId,
      attending: status === 'attending' ? 'yes' : 'no',
      guestCount: status === 'attending' ? attendingCount : 0,
      dietary,
      blessing,
      submittedAt: now,
    };
  }
  localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(rsvps));
  window.dispatchEvent(new CustomEvent('wedding_rsvp_updated'));

  return getGuestsWithRsvp();
}

export function getAttendanceStats(guestsList = []) {
  let totalGuests = guestsList.length;
  let totalSeats = 0;
  let attendingGuests = 0;
  let attendingSeats = 0;
  let declinedGuests = 0;
  let pendingGuests = 0;

  guestsList.forEach((g) => {
    const reserved = parseInt(g.seats, 10) || 1;
    totalSeats += reserved;

    if (g.attendance === 'attending') {
      attendingGuests += 1;
      attendingSeats += parseInt(g.attendingCount, 10) || reserved;
    } else if (g.attendance === 'declined') {
      declinedGuests += 1;
    } else {
      pendingGuests += 1;
    }
  });

  return {
    totalGuests,
    totalSeats,
    attendingGuests,
    attendingSeats,
    declinedGuests,
    pendingGuests,
  };
}

export function generateGuestConfirmationWhatsAppMessage(guest, rsvp) {
  const guestFormatted = formatGuestFullName(guest);
  const isAttending = rsvp.attending === 'yes';
  const statusEmoji = isAttending ? '🎉 Joyfully Accepting' : '💌 Regretfully Declining';
  const seatsText = isAttending ? `\n👥 Attending Guests: ${rsvp.guestCount} ${rsvp.guestCount === 1 ? 'Seat' : 'Seats'}` : '';
  const dietText = isAttending && rsvp.dietary ? `\n🍽️ Meal Preference: ${rsvp.dietary}` : '';
  const noteText = rsvp.blessing ? `\n\n💬 Warm Wishes:\n"${rsvp.blessing}"` : '';
  const guestIdText = (guest?.id || guest?.code) ? `\n🆔 Invitation ID: ${guest.id || guest.code}` : '';

  return (
    `💍 *WEDDING RSVP - Shantha & Lakshani* 💍\n\n` +
    `👤 *Guest Name:* ${guestFormatted}\n` +
    `✨ *Attendance Response:* ${statusEmoji}${seatsText}${dietText}${noteText}${guestIdText}\n\n` +
    `📅 Event: Dec 12, 2026 • ${WEDDING_DETAILS.churchTitle} & ${WEDDING_DETAILS.receptionTitle}`
  );
}
