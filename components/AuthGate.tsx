import React, { useEffect, useRef, useState } from 'react';
import { getSession, onAuthStateChange, type AppUser } from '../services/authService';
import LoginScreen from './LoginScreen';
import { GuidedTour } from './GuidedTour';
import { getTourCompleted, markTourCompleted } from '../supabaseDb';

interface AuthGateProps {
  children: (user: AppUser) => React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState<boolean>(false);

  /**
   * Guard ref: once we've decided whether to show the tour (after the first
   * successful DB read), we never query again for this page load.
   * This prevents onAuthStateChange (which fires on every token refresh,
   * ~hourly, and on every page reload) from re-opening the tour after the
   * user has already dismissed it.
   */
  const tourDecidedRef = useRef(false);

  const checkTour = async (userId: string) => {
    if (tourDecidedRef.current) return; // already decided this page load
    tourDecidedRef.current = true;
    try {
      const completed = await getTourCompleted(userId);
      if (!completed) setShowTour(true);
    } catch (e) {
      console.error('checkTour:', e);
    }
  };

  useEffect(() => {
    // Check existing session on mount
    getSession().then(async u => {
      setUser(u);
      if (u) await checkTour(u.id);
      setLoading(false);
    });

    // Listen for auth changes (login via OAuth redirect / logout / token refresh).
    // We intentionally DO NOT re-check the tour here unless this is the first
    // resolution (tourDecidedRef guards that).
    const unsubscribe = onAuthStateChange(async u => {
      setUser(u);
      if (u) await checkTour(u.id);
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTourClose = async () => {
    // Hide tour immediately — don't wait for the DB write
    setShowTour(false);
    if (user) {
      try {
        await markTourCompleted(user.id);
      } catch (e) {
        console.error('markTourCompleted:', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-violet-500 animate-spin"></div>
          </div>
          <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      {children(user)}
      {showTour && <GuidedTour onClose={handleTourClose} />}
    </>
  );
};

export default AuthGate;
