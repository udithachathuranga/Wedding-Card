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
    <div className="relative min-h-screen bg-gradient-to-b from-[#2d0714] via-[#1e040d] to-[#270611] text-ivory-100 font-sans selection:bg-gold-500 selection:text-burgundy-950 overflow-x-hidden">
      {/* Soft Ambient Radial Light Glows to Lift & Brighten Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(215,178,88,0.15)_0%,rgba(180,30,68,0.18)_40%,transparent_70%)] blur-2xl" />
        <div className="absolute top-1/3 left-1/4 w-[540px] h-[540px] bg-[radial-gradient(circle_at_center,rgba(195,45,82,0.14)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute top-2/3 right-1/4 w-[620px] h-[520px] bg-[radial-gradient(circle_at_center,rgba(215,178,88,0.12)_0%,rgba(175,28,64,0.15)_45%,transparent_70%)] blur-3xl" />
      </div>

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
