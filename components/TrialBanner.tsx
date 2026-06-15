import React from 'react';

interface TrialBannerProps {
  sessionCount: number;
  maxSessions: number;
  onDeleteSession?: () => void;
  uiLanguage?: 'en' | 'es';
}

const TrialBanner: React.FC<TrialBannerProps> = ({ sessionCount, maxSessions, onDeleteSession, uiLanguage = 'en' }) => {
  const remaining = maxSessions - sessionCount;
  const isBlocked = remaining <= 0;
  const isWarning = remaining <= 2 && remaining > 0;

  if (!isWarning && !isBlocked) return null;

  if (isBlocked) {
    return (
      <div className="mx-4 mb-3 rounded-xl border border-red-500/20 bg-red-950/30 p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-900/40 flex items-center justify-center shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-400">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-red-400 mb-0.5">
            {uiLanguage === 'es' ? 'Límite de prueba alcanzado' : 'Trial limit reached'}
          </p>
          <p className="text-[11px] text-red-300/70 leading-snug">
            {uiLanguage === 'es'
              ? `Has usado los ${maxSessions} chats incluidos en tu prueba gratuita. Elimina una sesión para continuar.`
              : `You've used all ${maxSessions} chats included in your free trial. Delete a session to continue.`}
          </p>
          {onDeleteSession && (
            <button
              onClick={onDeleteSession}
              className="mt-2 text-[11px] font-mono text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
            >
              {uiLanguage === 'es' ? 'Gestionar sesiones →' : 'Manage sessions →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-3 rounded-xl border border-amber-500/15 bg-amber-950/20 p-3 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></div>
      <p className="text-[11px] text-amber-300/80 leading-snug">
        {uiLanguage === 'es' ? (
          <>
            <span className="font-semibold">{remaining === 1 ? 'Te queda 1 chat' : `Te quedan ${remaining} chats`}</span>
            {` en tu prueba gratuita de ${maxSessions}.`}
          </>
        ) : (
          <>
            <span className="font-semibold">{remaining === 1 ? '1 chat remaining' : `${remaining} chats remaining`}</span>
            {` in your free trial of ${maxSessions}.`}
          </>
        )}
      </p>
    </div>
  );
};

export default TrialBanner;
