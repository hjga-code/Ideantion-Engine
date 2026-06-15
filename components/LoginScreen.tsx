import React, { useState } from 'react';
import { signInWithGoogle } from '../services/authService';

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'es'>(() => {
    const saved = localStorage.getItem('thinklab_ui_lang');
    return (saved === 'es' || saved === 'en') ? saved : 'en';
  });

  const handleLangToggle = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    localStorage.setItem('thinklab_ui_lang', next);
  };

  const isEs = lang === 'es';
  const subtitle = isEs ? 'Tu estudio creativo con IA' : 'Your AI-powered creative studio';
  const badge = isEs ? 'Prueba gratuita · 10 chats incluidos' : 'Free trial · 10 chats included';
  const f1 = isEs ? '8 workflows especializados con IA' : '8 specialized AI workflows';
  const f2 = isEs ? 'Exportación a PDF, DOC, CSV y Markdown' : 'Export to PDF, DOC, CSV & Markdown';
  const f3 = isEs ? 'Tus chats guardados de forma privada' : 'Your chats saved privately';
  const f4 = isEs ? 'Gemini 3.5 + OpenRouter (8 modelos)' : 'Gemini 3.5 + OpenRouter (8 models)';
  const divider = isEs ? 'Acceder con' : 'Sign in with';
  const btnConnecting = isEs ? 'Conectando...' : 'Connecting...';
  const btnContinue = isEs ? 'Continuar con Google' : 'Continue with Google';
  const footerText = isEs 
    ? 'Al continuar, aceptas que tus chats se almacenan de forma segura y privada con tu cuenta de Google.'
    : 'By continuing, you agree that your chats are stored securely and privately with your Google account.';
  const errLogin = isEs ? 'No se pudo iniciar sesión. Intenta de nuevo.' : 'Failed to sign in. Please try again.';

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(errLogin);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Language Toggle in Top-Right Corner */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={handleLangToggle}
          className="px-3 py-1.5 text-xs font-mono border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/10 text-white/60 hover:text-white transition-all flex items-center gap-1.5"
        >
          🌐 {isEs ? 'ENGLISH' : 'ESPAÑOL'}
        </button>
      </div>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-5 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="url(#ie-grad)" strokeWidth="1.5" className="w-8 h-8">
              <defs>
                <linearGradient id="ie-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Ideation Engine
          </h1>
          <p className="text-[13px] text-white/40 font-light">
            {subtitle}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">

          {/* Trial badge */}
          <div className="flex items-center gap-2 bg-violet-950/60 border border-violet-500/20 rounded-full px-4 py-2 mb-6 w-fit mx-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></div>
            <span className="text-[11px] font-mono text-violet-300 tracking-wide">{badge}</span>
          </div>

          {/* Features */}
          <ul className="space-y-2.5 mb-7">
            {[
              { icon: '⚡', text: f1 },
              { icon: '📄', text: f2 },
              { icon: '🔒', text: f3 },
              { icon: '🤖', text: f4 },
            ].map(f => (
              <li key={f.text} className="flex items-start gap-2.5">
                <span className="text-sm mt-0.5">{f.icon}</span>
                <span className="text-[12.5px] text-white/50 leading-snug">{f.text}</span>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]"></div>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{divider}</span>
            <div className="flex-1 h-px bg-white/[0.06]"></div>
          </div>

          {/* Google Sign-In button */}
          <button
            id="btn-google-login"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold text-[13.5px] py-3.5 px-5 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                {btnConnecting}
              </>
            ) : (
              <>
                {/* Official Google icon */}
                <svg className="w-[18px] h-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.14z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                </svg>
                {btnContinue}
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <p className="text-[11px] text-red-400 text-center mt-3 font-mono">{error}</p>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10.5px] text-white/20 mt-6 leading-relaxed">
          {footerText}
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
