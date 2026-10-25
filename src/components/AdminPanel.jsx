import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  QrCode,
  Users,
  Eye,
  Trash2,
  Download,
  Sparkles,
  PlusCircle,
  FileSpreadsheet,
  Search,
} from 'lucide-react';
import {
  TITLE_OPTIONS,
  COMPANION_OPTIONS,
  generateInviteUrl,
  generateWhatsAppMessage,
  formatGuestFullName,
  getSavedGuests,
  saveGuestToStorage,
  deleteGuestFromStorage,
} from '../utils/inviteHelper';

export default function AdminPanel({ onPreviewGuest, onClose }) {
  const [title, setTitle] = useState('Mr.');
  const [customTitle, setCustomTitle] = useState('');
  const [name, setName] = useState('');
  const [companion, setCompanion] = useState('none');
  const [customSuffix, setCustomSuffix] = useState('');
  const [seats, setSeats] = useState(2);
  const [note, setNote] = useState('');

  // Generated Result
  const [generatedGuest, setGeneratedGuest] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Guest List from Storage
  const [guestList, setGuestList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    setGuestList(getSavedGuests());
  }, []);

  // Update QR Code whenever URL changes
  useEffect(() => {
    if (generatedUrl && qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        generatedUrl,
        {
          width: 180,
          margin: 1.5,
          color: {
            dark: '#3d2400',
            light: '#fdfaf2',
          },
        },
        (err) => {
          if (err) console.error('QR Error:', err);
        }
      );
    }
  }, [generatedUrl]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalTitle = title === 'Custom...' ? customTitle : title;
    const newGuest = {
      id: 'SW-' + Date.now().toString(36).toUpperCase(),
      title: finalTitle,
      name: name.trim(),
      companion,
      customSuffix: companion === 'custom' ? customSuffix.trim() : '',
      seats,
      note: note.trim(),
      createdAt: new Date().toLocaleDateString(),
    };

    const url = generateInviteUrl(newGuest);
    setGeneratedGuest(newGuest);
    setGeneratedUrl(url);

    const updated = saveGuestToStorage(newGuest);
    setGuestList(updated);
  };

  const handleCopyLink = (urlToCopy = generatedUrl) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyWhatsAppMsg = (guest = generatedGuest, url = generatedUrl) => {
    const msg = generateWhatsAppMessage(guest, url);
    navigator.clipboard.writeText(msg);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleShareWhatsApp = (guest = generatedGuest, url = generatedUrl) => {
    const msg = generateWhatsAppMessage(guest, url);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDelete = (id) => {
    const updated = deleteGuestFromStorage(id);
    setGuestList(updated);
    if (generatedGuest?.id === id) {
      setGeneratedGuest(null);
      setGeneratedUrl('');
    }
  };

  const handleDownloadQr = () => {
    if (!qrCanvasRef.current) return;
    const pngUrl = qrCanvasRef.current.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `Wedding-QR-${generatedGuest?.name || 'Guest'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleLoadDemoGuests = () => {
    const samples = [
      {
        id: 'SW-DEMO1',
        title: 'Rev. Fr.',
        name: 'Jude Fernando',
        companion: 'none',
        customSuffix: '',
        seats: 1,
        note: 'Special blessings for the holy ceremony',
        createdAt: new Date().toLocaleDateString(),
      },
      {
        id: 'SW-DEMO2',
        title: 'Mr. & Mrs.',
        name: 'Kasun Wickramasinghe',
        companion: 'family',
        customSuffix: '',
        seats: 4,
        note: 'Looking forward to hosting your entire family!',
        createdAt: new Date().toLocaleDateString(),
      },
      {
        id: 'SW-DEMO3',
        title: 'Dr.',
        name: 'Samantha Jayawardena',
        companion: 'partner',
        customSuffix: '',
        seats: 2,
        note: 'Warmest regards',
        createdAt: new Date().toLocaleDateString(),
      },
      {
        id: 'SW-DEMO4',
        title: 'Miss',
        name: 'Amali Perera',
        companion: 'none',
        customSuffix: '',
        seats: 1,
        note: '',
        createdAt: new Date().toLocaleDateString(),
      },
    ];

    samples.forEach((g) => saveGuestToStorage(g));
    const updated = getSavedGuests();
    setGuestList(updated);
  };

  const handleExportCsv = () => {
    if (guestList.length === 0) return;
    const headers = ['ID', 'Title', 'Name', 'Full Greeting', 'Scope', 'Reserved Seats', 'Personal Note', 'Date Added'];
    const rows = guestList.map((g) => [
      g.id,
      g.title,
      `"${g.name}"`,
      `"${formatGuestFullName(g)}"`,
      g.companion,
      g.seats,
      `"${g.note || ''}"`,
      g.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Shantha-Waruni-Wedding-GuestList.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = guestList.filter((g) => {
    const q = searchQuery.toLowerCase();
    const fullName = formatGuestFullName(g).toLowerCase();
    return fullName.includes(q) || (g.note && g.note.toLowerCase().includes(q));
  });

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4 text-ivory-100">
      {/* Header Banner */}
      <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#2c050f] via-[#1a0309] to-[#2c050f] border border-gold-400/50 shadow-luxury mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-[11px] text-gold-300 font-serif tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Couple &amp; Planner Control Center
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-gold-gradient">
              Wedding Invitation Link Generator
            </h2>
            <p className="text-xs md:text-sm text-gold-200/70 font-cormorant text-base mt-1">
              Create unique, personalized digital invitation links for Shantha Ruban &amp; Lakshani Warnakulasooriya&apos;s guests with custom titles and family / partner addressees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemoGuests}
              className="px-4 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-400/40 text-gold-200 text-xs font-serif uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-gold-400" />
              <span>Load Samples</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-xs font-serif uppercase tracking-wider transition-colors"
              >
                Close Admin
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Input Guest Details (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#1e0309] to-[#120105] p-6 rounded-2xl border border-gold-400/40 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-gold-200 flex items-center gap-2 pb-2 border-b border-gold-400/20">
            <Users className="w-5 h-5 text-gold-400" />
            <span>Enter Guest Details</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Title Selection */}
            <div>
              <label className="block text-xs font-serif text-gold-300 uppercase tracking-wider mb-1.5">
                Title / Salutation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                >
                  {TITLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-burgundy-950 text-ivory-100">
                      {opt}
                    </option>
                  ))}
                  <option value="Custom..." className="bg-burgundy-950 text-ivory-100">
                    Custom Title...
                  </option>
                </select>

                {title === 'Custom...' && (
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. His Lordship, Bishop"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                    required
                  />
                )}
              </div>
            </div>

            {/* Guest Full Name */}
            <div>
              <label className="block text-xs font-serif text-gold-300 uppercase tracking-wider mb-1.5">
                Guest Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Samantha Silva, Jude Fernando"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 placeholder-gold-300/30 text-sm focus:outline-none focus:border-gold-400"
                required
              />
            </div>

            {/* Invitation Type / Companion Scope */}
            <div>
              <label className="block text-xs font-serif text-gold-300 uppercase tracking-wider mb-1.5">
                Invitation Scope (Individual, Partner, or Family)
              </label>
              <div className="grid grid-cols-1 gap-2">
                {COMPANION_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${companion === opt.id
                      ? 'bg-gold-500/20 border-gold-400 text-gold-200'
                      : 'bg-black/30 border-gold-400/20 text-ivory-200/70 hover:border-gold-400/40'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="companion"
                        value={opt.id}
                        checked={companion === opt.id}
                        onChange={(e) => setCompanion(e.target.value)}
                        className="accent-gold-500"
                      />
                      <span className="text-xs font-medium">{opt.label}</span>
                    </div>
                    {opt.suffix && (
                      <span className="text-[11px] text-gold-300/80 font-serif italic">
                        {opt.suffix}
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {companion === 'custom' && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customSuffix}
                    onChange={(e) => setCustomSuffix(e.target.value)}
                    placeholder="e.g. &amp; Colleague, &amp; Guest"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>
              )}
            </div>

            {/* Reserved Seats & Personal Note */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-serif text-gold-300 uppercase tracking-wider mb-1">
                  Allotted Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 text-sm focus:outline-none focus:border-gold-400 text-center"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-serif text-gold-300 uppercase tracking-wider mb-1">
                  Personal Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Reserved Table 4"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-gold-400/30 text-gold-100 placeholder-gold-300/30 text-sm focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-burgundy-950 font-serif font-bold text-xs uppercase tracking-widest shadow-gold-glow hover:shadow-gold-glow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-burgundy-900" />
              <span>Generate Invitation Link</span>
            </button>
          </form>
        </div>

        {/* Right Output: Generated Card & QR Code (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {generatedGuest && generatedUrl ? (
            <div className="bg-gradient-to-b from-[#24040d] via-[#1a0309] to-[#120105] p-6 rounded-2xl border border-gold-400/60 shadow-luxury space-y-5 animate-fade-in-up">
              <div className="flex items-center justify-between pb-3 border-b border-gold-400/20">
                <span className="text-xs font-serif uppercase tracking-widest text-gold-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  Invitation Ready
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-200 border border-gold-400/30 font-mono">
                  {generatedGuest.id}
                </span>
              </div>

              {/* Addressee Preview */}
              <div className="p-4 rounded-xl bg-black/40 border border-gold-400/30 text-center">
                <span className="text-[10px] uppercase font-sans tracking-widest text-gold-300/70 block">
                  Addressed In Invitation As
                </span>
                <h4 className="font-serif text-xl md:text-2xl font-bold text-gold-gradient mt-1">
                  {formatGuestFullName(generatedGuest)}
                </h4>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gold-200/80">
                  <span>Seats: {generatedGuest.seats}</span>
                  <span>•</span>
                  <span>Scope: {generatedGuest.companion}</span>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div>
                <label className="block text-[11px] font-serif text-gold-300 uppercase tracking-wider mb-1.5">
                  Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-gold-400/30 text-gold-200 font-mono text-xs truncate">
                    {generatedUrl}
                  </div>
                  <button
                    onClick={() => handleCopyLink(generatedUrl)}
                    className="px-3.5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-serif font-bold text-xs uppercase transition-colors flex items-center gap-1.5 shadow"
                    title="Copy Link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-burgundy-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleShareWhatsApp(generatedGuest, generatedUrl)}
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-sans font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    if (onPreviewGuest) onPreviewGuest(generatedGuest);
                  }}
                  className="py-3 px-4 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-400 text-gold-200 font-serif font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Eye className="w-4 h-4 text-gold-300" />
                  <span>Preview as Guest</span>
                </button>
              </div>

              {/* QR Code and Quick WhatsApp Message Generator */}
              <div className="p-4 rounded-xl bg-black/40 border border-gold-400/20 flex flex-col sm:flex-row items-center gap-5">
                <div className="flex flex-col items-center">
                  <canvas ref={qrCanvasRef} className="rounded-lg shadow border border-gold-400/40" />
                  <button
                    onClick={handleDownloadQr}
                    className="mt-2 text-[11px] text-gold-300 hover:text-gold-100 flex items-center gap-1 font-sans"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download QR</span>
                  </button>
                </div>

                <div className="flex-1 text-xs text-gold-200/80 space-y-2">
                  <p className="font-serif font-semibold text-gold-300 uppercase tracking-wider text-[11px]">
                    Quick WhatsApp Invitation Text
                  </p>
                  <p className="line-clamp-4 italic text-[11px] opacity-80 border-l-2 border-gold-400/40 pl-2">
                    &ldquo;👑 WEDDING INVITATION: Dear {formatGuestFullName(generatedGuest)}, Shantha Ruban &amp; Lakshani Warnakulasooriya cordially invite you...&rdquo;
                  </p>
                  <button
                    onClick={() => handleCopyWhatsAppMsg(generatedGuest, generatedUrl)}
                    className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 underline underline-offset-4"
                  >
                    {copiedMsg ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMsg ? 'Message Copied to Clipboard!' : 'Copy Formatted WhatsApp Message'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Placeholder before first generation */
            <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-b from-[#1b0309] to-[#100105] border border-dashed border-gold-400/30 text-center">
              <QrCode className="w-16 h-16 text-gold-400/40 mb-3" />
              <h4 className="font-serif text-lg text-gold-200 font-medium">
                No Link Generated Yet
              </h4>
              <p className="text-xs text-gold-300/60 font-cormorant text-base max-w-sm mt-1">
                Enter the guest&apos;s title and name on the left and click &ldquo;Generate Invitation Link&rdquo; to create a shareable URL, QR code, and pre-formatted WhatsApp invitation.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Guest Directory / History Table */}
      <div className="mt-10 bg-gradient-to-b from-[#1c0309] to-[#120105] p-6 rounded-2xl border border-gold-400/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold-400/20">
          <div>
            <h3 className="font-serif text-lg font-bold text-gold-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-400" />
              <span>Guest Invitation Directory ({guestList.length})</span>
            </h3>
            <p className="text-xs text-gold-200/60 font-cormorant text-sm">
              All generated invitations are stored safely in local storage for easy tracking and sharing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gold-400/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-black/50 border border-gold-400/30 text-gold-100 text-xs focus:outline-none focus:border-gold-400 w-44 md:w-56"
              />
            </div>

            {guestList.length > 0 && (
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-400/30 text-gold-300 text-xs font-serif uppercase tracking-wider flex items-center gap-1.5"
                title="Export guest list to Excel/CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Directory Table */}
        <div className="mt-4 overflow-x-auto">
          {filteredGuests.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gold-400/20 text-gold-300/80 font-serif uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Full Addressee</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Scope</th>
                  <th className="py-2.5 px-3 text-center">Seats</th>
                  <th className="py-2.5 px-3">Note</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-400/10 text-ivory-100/90 font-sans">
                {filteredGuests.map((g) => {
                  const url = generateInviteUrl(g);
                  return (
                    <tr key={g.id} className="hover:bg-gold-500/5 transition-colors">
                      <td className="py-3 px-3 font-medium text-gold-100 font-serif text-sm">
                        {formatGuestFullName(g)}
                      </td>
                      <td className="py-3 px-3 text-gold-300/80">{g.title}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-400/20 text-[10px] text-gold-200">
                          {g.companion === 'family'
                            ? 'Whole Family'
                            : g.companion === 'partner'
                              ? 'With Partner'
                              : 'Single'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">{g.seats || 2}</td>
                      <td className="py-3 px-3 text-gold-300/60 italic text-[11px] truncate max-w-[150px]">
                        {g.note || '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              if (onPreviewGuest) onPreviewGuest(g);
                            }}
                            className="p-1.5 rounded-lg hover:bg-gold-500/20 text-gold-300"
                            title="Preview as this Guest"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyLink(url)}
                            className="p-1.5 rounded-lg hover:bg-gold-500/20 text-gold-300"
                            title="Copy Guest URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShareWhatsApp(g, url)}
                            className="p-1.5 rounded-lg hover:bg-[#25D366]/20 text-[#25D366]"
                            title="Send via WhatsApp"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(g.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"
                            title="Delete guest"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-xs text-gold-300/60 font-cormorant text-base">
              No guests found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
