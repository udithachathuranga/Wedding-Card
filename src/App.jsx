import { useState, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import EnvelopeModal from './components/EnvelopeModal';
import WeddingCard from './components/WeddingCard';
import AdminPanel from './components/AdminPanel';
import { parseInviteFromUrl, generateInviteUrl } from './utils/inviteHelper';

// Helper to determine if current path is admin route (/admin or #admin)
function checkIsAdminRoute() {
  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return path === '/admin' || hash === '#admin';
}

export default function App() {
  const [guest, setGuest] = useState(() => parseInviteFromUrl());
  const [isAdminView, setIsAdminView] = useState(() => checkIsAdminRoute());
  const [showEnvelope, setShowEnvelope] = useState(() => !checkIsAdminRoute());

  // Sync route on popstate (browser back/forward) or hashchange
  useEffect(() => {
    const handleRouteSync = () => {
      const isAdmin = checkIsAdminRoute();
      setIsAdminView(isAdmin);
      if (isAdmin) {
        setShowEnvelope(false);
      }
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  const handlePreviewGuest = (previewGuest) => {
    setGuest(previewGuest);
    setIsAdminView(false);
    setShowEnvelope(true); // Re-trigger envelope opening to test exact guest experience!

    // Update browser URL to guest invite link without reloading
    const newUrl = generateInviteUrl(previewGuest);
    window.history.pushState({}, '', newUrl);
  };

  const handleCloseAdmin = () => {
    setIsAdminView(false);
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="relative min-h-screen bg-[#110105] text-ivory-100 font-sans selection:bg-gold-500 selection:text-burgundy-950 overflow-x-hidden">
      {/* Dynamic Floating Golden Dust & Rose Petals */}
      <ParticleBackground />

      {/* Admin Panel View (Only accessible at /admin) */}
      {isAdminView ? (
        <div className="relative z-10 py-6">
          <AdminPanel
            onPreviewGuest={handlePreviewGuest}
            onClose={handleCloseAdmin}
          />
        </div>
      ) : (
        <>
          {/* Virtual Wax-Seal Envelope Opening Ceremony for Guests */}
          {showEnvelope && guest && (
            <EnvelopeModal
              guest={guest}
              onOpened={() => setShowEnvelope(false)}
            />
          )}

          {/* Main Royal Wedding Card */}
          <main className="relative z-10">
            <WeddingCard
              guest={guest}
              onReplayEnvelope={() => setShowEnvelope(true)}
            />
          </main>
        </>
      )}
    </div>
  );
}
