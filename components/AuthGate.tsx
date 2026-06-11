import React, { useEffect, useState } from 'react';
import { getSession, onAuthStateChange, type AppUser } from '../services/authService';
import LoginScreen from './LoginScreen';
import { GuidedTour } from './GuidedTour';

const TOUR_KEY = 'thinklab_guided_tour_completed_v2';

interface AuthGateProps {
  children: (user: AppUser) => React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  // Read localStorage synchronously — no race condition
  const [showTour, setShowTour] = useState<boolean>(false);

  useEffect(() => {
    // Check existing session on mount
    getSession().then(u => {
      setUser(u);
      setLoading(false);
      // Show tour only after auth resolves and user is logged in
      if (u && !localStorage.getItem(TOUR_KEY)) {
        setShowTour(true);
      }
    });

    // Listen for auth changes (login / logout / token refresh)
    const unsubscribe = onAuthStateChange(u => {
      setUser(u);
      setLoading(false);
      // Also trigger tour on fresh login via OAuth redirect
      if (u && !localStorage.getItem(TOUR_KEY)) {
        setShowTour(true);
      }
    });

    return unsubscribe;
  }, []);

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
      {showTour && <GuidedTour onClose={() => setShowTour(false)} />}
    </>
  );
};

export default AuthGate;
