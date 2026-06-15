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
   * Guard: only query the DB once per page load.
   * onAuthStateChange fires on every token refresh (~hourly) and on every
   * reload — without this guard, the tour would re-appear each time.
   */
  const tourDecidedRef = useRef(false);

  const checkTour = async (userId: string) => {
    if (tourDecidedRef.current) return;
    tourDecidedRef.current = true;
    try {
      const completed = await getTourCompleted(userId);
      if (!completed) setShowTour(true);
    } catch (e) {
      console.error('checkTour:', e);
    }
  };

  useEffect(() => {
    getSession().then(async u => {
      setUser(u);
      if (u) await checkTour(u.id);
      setLoading(false);
    });

    const unsubscribe = onAuthStateChange(async u => {
      setUser(u);
      if (u) await checkTour(u.id);
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTourClose = async () => {
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
