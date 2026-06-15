import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Check existing session on mount
    getSession().then(async u => {
      setUser(u);
      // Show tour only after auth resolves and user is logged in
      if (u) {
        const completed = await getTourCompleted(u.id);
        if (!completed) setShowTour(true);
      }
      setLoading(false);
    });

    // Listen for auth changes (login / logout / token refresh)
    const unsubscribe = onAuthStateChange(async u => {
      setUser(u);
      // Also trigger tour on fresh login via OAuth redirect
      if (u) {
        const completed = await getTourCompleted(u.id);
        if (!completed) setShowTour(true);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleTourClose = async () => {
    if (user) {
      await markTourCompleted(user.id);
    }
    setShowTour(false);
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
