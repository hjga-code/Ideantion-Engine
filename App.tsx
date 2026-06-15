import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import HistorySidebar from './components/HistorySidebar';
import AudioInput from './components/AudioInput';
import OutputRenderer from './components/OutputRenderer';
import WidgetMode from './components/WidgetMode';
import TrialBanner from './components/TrialBanner';
import { processContent, validateGeminiConnection, generateSessionTitle } from './services/geminiService';
import { processContentOpenRouter, validateOpenRouterConnection, generateSessionTitleOpenRouter } from './services/openRouterService';
import { signOut } from './services/authService';
import type { AppUser } from './services/authService';
import { getSessions, upsertSession, deleteSession, getUserSettings, saveUserSettings, getSessionCount, MAX_SESSIONS } from './supabaseDb';
import { Session, ChatMessage, ModuleType, ProcessingState, UserInput, AudioState, PresetType, TargetLanguage, OutputFormat, AIProvider } from './types';
import { MODULE_ICONS, MODULE_DESCRIPTIONS, PRESETS, LANGUAGES, FORMATS, GEMINI_MODELS, OPENROUTER_MODELS, MODULE_SPECIFIC_CONFIG } from './constants';
import { ThinkLabLogo } from './components/ThinkLabLogo';


// --- ROBUST CLIPBOARD UTILITY ---
const copyToClipboardRobust = async (text: string, targetWindow: Window = window): Promise<boolean> => {
    if (!text) return false;
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        try {
            const doc = targetWindow.document;
            const textArea = doc.createElement("textarea");
            textArea.value = text;
            textArea.style.cssText = "position: fixed; left: -9999px; top: 0px; opacity: 0; pointer-events: none;";
            textArea.setAttribute('readonly', '');
            doc.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = doc.execCommand('copy');
            doc.body.removeChild(textArea);
            return successful;
        } catch (fallbackError) {
            console.error("All copy methods failed", fallbackError);
            return false;
        }
    }
};

// --- TOAST COMPONENT (Standard) ---
interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-500/10 border-green-500/50 text-green-400',
        error: 'bg-red-500/10 border-red-500/50 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/50 text-blue-400'
    };

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-fade-in-down ${bgColors[type]}`}>
            <span className="font-mono text-xs font-bold tracking-wide">{message}</span>
        </div>
    );
};

// --- MINIMALIST SKILL NOTIFICATION (Apple Style) ---
interface SkillNotificationProps {
    module: ModuleType;
    details: string;
    onClose: () => void;
}

const SkillNotification: React.FC<SkillNotificationProps> = ({ module, details, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2500); // Disappear quickly
        return () => clearTimeout(timer);
    }, [module, onClose]);

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-5 py-2 rounded-full bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-fade-in-down border border-white/40 transform transition-all hover:scale-105 cursor-default select-none">
            <span className="text-sm">{MODULE_ICONS[module]}</span>
            <div className="h-3 w-px bg-gray-300"></div>
            <span className="text-[11px] font-sans font-semibold text-black tracking-wide uppercase">{MODULE_DESCRIPTIONS[module]} ACTIVATED</span>
            <span className="text-[10px] font-mono text-gray-500 hidden md:block">• {details}</span>
        </div>
    );
};

// --- GHOST SVG ICONS FOR CARDS (Neutral Grey) ---
const GHOST_ICONS: Record<ModuleType, React.ReactNode> = {
    [ModuleType.CODE]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    ),
    [ModuleType.DESIGN]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
    ),
    [ModuleType.SEO]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
        </svg>
    ),
    [ModuleType.STRUCTURE]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    ),
    [ModuleType.WRITING]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
    ),
    [ModuleType.TABLES]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625 0v1.5c0 .621-.504 1.125-1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M1.125 6.75v1.5m0 0c0 .621.504 1.125 1.125 1.125" />
        </svg>
    ),
    [ModuleType.PROMPT]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
    ),
    [ModuleType.IDEATION]: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
    )
};

// --- DYNAMIC MODULE COLORS (For Glow Effects) ---
const MODULE_THEMES: Record<ModuleType, { color: string, shadow: string, border: string }> = {
    [ModuleType.CODE]: { color: 'text-violet-400', shadow: 'shadow-violet-500/40', border: 'border-violet-500/50' },
    [ModuleType.DESIGN]: { color: 'text-amber-400', shadow: 'shadow-amber-500/40', border: 'border-amber-500/50' },
    [ModuleType.SEO]: { color: 'text-teal-400', shadow: 'shadow-teal-500/40', border: 'border-teal-500/50' },
    [ModuleType.STRUCTURE]: { color: 'text-purple-400', shadow: 'shadow-purple-500/40', border: 'border-purple-500/50' },
    [ModuleType.WRITING]: { color: 'text-green-400', shadow: 'shadow-green-500/40', border: 'border-green-500/50' },
    [ModuleType.TABLES]: { color: 'text-cyan-400', shadow: 'shadow-cyan-500/40', border: 'border-cyan-500/50' },
    [ModuleType.PROMPT]: { color: 'text-orange-400', shadow: 'shadow-orange-500/40', border: 'border-orange-500/50' },
    [ModuleType.IDEATION]: { color: 'text-pink-400', shadow: 'shadow-pink-500/40', border: 'border-pink-500/50' }
};

// --- SHORT LABELS FOR MODULE MINI-SELECTOR ---
const MODULE_LABELS: Record<ModuleType, string> = {
    [ModuleType.CODE]: 'CON',      // Content Generation
    [ModuleType.DESIGN]: 'CAL',    // Calendar
    [ModuleType.SEO]: 'SEO',       // SEO & Growth
    [ModuleType.STRUCTURE]: 'STR', // Structure
    [ModuleType.WRITING]: 'WRI',   // Writing
    [ModuleType.TABLES]: 'TBL',    // Tables
    [ModuleType.PROMPT]: 'PRM',    // Prompt
    [ModuleType.IDEATION]: 'IDY',  // Ideation
};

interface AppProps {
  user: AppUser;
}

const App: React.FC<AppProps> = ({ user }) => {
  // --- STATE MANAGEMENT ---

  // Supabase-backed sessions (replaces Dexie useLiveQuery)
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionCount, setSessionCount] = useState(0);

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]); 
  
  // UI States - DEFAULT CLOSED for Zen Mode
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  
  const [isWidgetMode, setIsWidgetMode] = useState(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); 
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Guard: prevents saveSettings from firing with empty values before loadSettings resolves
  const settingsLoadedRef = useRef(false);

  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [providerName, setProviderName] = useState("Mi Espacio de Trabajo");

  const [processingState, setProcessingState] = useState<ProcessingState>({
    isRecording: false,
    isProcessing: false,
    error: null,
  });
  
  const [isWidgetSuccess, setIsWidgetSuccess] = useState(false);
  const [widgetManualCopyContent, setWidgetManualCopyContent] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [skillNotification, setSkillNotification] = useState<{module: ModuleType, details: string} | null>(null);

  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.IDEATION);
  
  const [input, setInput] = useState<UserInput>({
    text: '',
    audio: { blob: null, url: null },
    images: [],
    preset: 'GENERAL',
    language: 'AUTO',
    format: 'MARKDOWN',
    provider: 'GEMINI',
    geminiKey: process.env.API_KEY || '',
    openRouterKey: process.env.OPENROUTER_API_KEY || '',
    openRouterModel: 'anthropic/claude-sonnet-4-6',
    geminiModel: 'gemini-3.5-flash' 
  });

  // --- EFFECTS ---

  // Load sessions from Supabase on mount
  const refreshSessions = useCallback(async () => {
    const [data, count] = await Promise.all([
      getSessions(user.id),
      getSessionCount(user.id),
    ]);
    setSessions(data);
    setSessionCount(count);
  }, [user.id]);

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getUserSettings(user.id);
        if (settings) {
          setInput(prev => ({
            ...prev,
            geminiKey: settings.geminiKey || prev.geminiKey,
            openRouterKey: settings.openRouterKey || prev.openRouterKey,
            openRouterModel: settings.openRouterModel || prev.openRouterModel,
            geminiModel: settings.geminiModel || prev.geminiModel,
            provider: settings.provider || prev.provider
          }));
          if (settings.providerName) setProviderName(settings.providerName);
        }
      } catch (e) {
        console.error('Error loading settings', e);
      } finally {
        // Only allow saving AFTER the initial load completes
        settingsLoadedRef.current = true;
      }
    };
    loadSettings();
  }, [user.id]);



  useEffect(() => {
    // Skip saving until initial load from Supabase has completed
    if (!settingsLoadedRef.current) return;
    const saveSettings = async () => {
      try {
        await saveUserSettings(user.id, {
          id: 'global',
          provider: input.provider,
          geminiKey: input.geminiKey,
          openRouterKey: input.openRouterKey,
          openRouterModel: input.openRouterModel,
          geminiModel: input.geminiModel,
          providerName: providerName,
        });
      } catch (e) {
        console.error('Error saving settings', e);
      }
    };
    saveSettings();
  }, [user.id, input.geminiKey, input.openRouterKey, input.openRouterModel, input.provider, input.geminiModel, providerName]);

  useEffect(() => {
      if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages, processingState.isProcessing]);

  // Auto-resize textarea
  useEffect(() => {
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
  }, [input.text]);

  useEffect(() => {
      const handlePaste = (e: ClipboardEvent) => {
          const items = e.clipboardData?.items;
          if (items) {
              for (const item of items) {
                  if (item.type.indexOf('image') !== -1) {
                      const blob = item.getAsFile();
                      if (blob) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                              if (event.target?.result) {
                                  setInput(prev => ({...prev, images: [...prev.images, event.target!.result as string]}));
                                  setToast({ message: "Imagen pegada del portapapeles", type: "success"});
                                  if (!isSettingsPanelOpen) setIsSettingsPanelOpen(true); 
                              }
                          };
                          reader.readAsDataURL(blob);
                      }
                  }
              }
          }
      };
      window.addEventListener('paste', handlePaste);
      return () => window.removeEventListener('paste', handlePaste);
  }, [isSettingsPanelOpen]);

  // --- HANDLERS ---
  
  const handleModuleSelect = (module: ModuleType, defaults: Partial<UserInput> = {}, closePanel: boolean = true) => {
      setActiveModule(module);
      
      // Enforce Strict Configuration for the selected module
      const config = MODULE_SPECIFIC_CONFIG[module];
      const validPreset = config.validPresets[0];
      const validFormat = config.validFormats[0];

      // Merge defaults with strict validation
      const updates: Partial<UserInput> = { ...defaults };
      
      // Ensure preset is valid for this module
      if (!config.validPresets.includes(updates.preset || input.preset)) {
          updates.preset = validPreset;
      }
      // Ensure format is valid for this module
      if (!config.validFormats.includes(updates.format || input.format)) {
          updates.format = validFormat;
      }

      setInput(prev => ({ ...prev, ...updates }));
      
      // Trigger Minimalist Notification
      setSkillNotification({ 
          module, 
          details: `${PRESETS[updates.preset || input.preset]} • ${FORMATS[updates.format || input.format]}` 
      });
      
      // Only close if requested (default behavior for Cards, but NOT for Panel buttons)
      if (closePanel) {
        setIsSettingsPanelOpen(false);
      }
  };

  const handleTestConnection = async () => {
      setConnectionStatus('TESTING');
      let isValid = false;
      if (input.provider === 'GEMINI') {
          isValid = await validateGeminiConnection(input.geminiKey);
      } else {
          isValid = await validateOpenRouterConnection(input.openRouterKey);
      }
      if (isValid) {
          setConnectionStatus('SUCCESS');
          setToast({ message: "Conexión exitosa", type: 'success' });
          setTimeout(() => setConnectionStatus('IDLE'), 3000);
      } else {
          setConnectionStatus('ERROR');
          setToast({ message: "Error al conectar. Verifica tu API Key.", type: 'error' });
      }
  };


  const handleImageUploadClick = () => imageInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  setInput(prev => ({...prev, images: [...prev.images, ev.target!.result as string]}));
              }
          };
          reader.readAsDataURL(file);
      }
  };
  const removeImage = (index: number) => {
      setInput(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index)}));
  };

  const handleAudioCapture = (audio: AudioState) => {
    setInput(prev => ({ ...prev, audio }));
    handleProcessing('', audio.blob, input.images, activeModule, input.preset, input.language, input.format);
  };

  const handleClearAudio = () => {
     if (input.audio.url) URL.revokeObjectURL(input.audio.url);
     setInput(prev => ({ ...prev, audio: { blob: null, url: null } }));
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteSession(id);
    if (currentSessionId === id) resetSession();
    await refreshSessions();
  };

  const handleRenameSession = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    await upsertSession(user.id, { ...session, title: newTitle.trim() });
    await refreshSessions();
  };

  const handleTextSubmit = () => {
      handleProcessing(input.text, input.audio.blob, input.images, activeModule, input.preset, input.language, input.format);
  };

  const handleProcessing = async (
      text: string, 
      audioBlob: Blob | null,
      images: string[], 
      module: ModuleType, 
      preset: PresetType, 
      lang: TargetLanguage, 
      fmt: OutputFormat
  ): Promise<string | null> => {
      if (!audioBlob && !text.trim() && images.length === 0) {
          setProcessingState(prev => ({ ...prev, error: "Ingresa texto, audio o imágenes." }));
          setToast({ message: "Input vacío", type: "error" });
          return null;
      }

      setProcessingState({ isRecording: false, isProcessing: true, error: null });
      setWidgetManualCopyContent(null);

      // Create User Message
      const userMsg: ChatMessage = {
          id: uuidv4(),
          role: 'user',
          content: text || (audioBlob ? 'Audio Input' : 'Image Input'),
          audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : null,
          images: images,
          timestamp: Date.now()
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      // Auto-collapse panel on submit
      setIsSettingsPanelOpen(false);

      try {
        let result = "";
        
        if (input.provider === 'GEMINI') {
            result = await processContent(input.geminiModel, text, audioBlob, images, messages, module, preset, lang, fmt, input.geminiKey);
        } else {
            result = await processContentOpenRouter(input.openRouterKey, input.openRouterModel, text, audioBlob, images, messages, module, preset, lang, fmt);
        }

        const aiMsg: ChatMessage = {
            id: uuidv4(),
            role: 'model',
            content: result,
            timestamp: Date.now()
        };

        const finalMessages = [...newMessages, aiMsg];
        setMessages(finalMessages);

        let sessionId = currentSessionId;
        let isNewSession = false;

        let defaultTitle = "Nueva Sesión";
        if (text && text.trim().length > 0) defaultTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
        else if (images.length > 0) defaultTitle = "Análisis Visual";
        else if (audioBlob) defaultTitle = "Nota de Voz";

        let sessionTitle = currentSessionId
            ? (sessions.find(s => s.id === currentSessionId)?.title ?? defaultTitle)
            : defaultTitle;
        
        if (!sessionId) {
            sessionId = uuidv4();
            setCurrentSessionId(sessionId);
            isNewSession = true;
            sessionTitle = defaultTitle;
        }

        const updatedSession: Session = {
            id: sessionId!,
            title: sessionTitle || "Sesión",
            timestamp: sessions.find(s => s.id === sessionId)?.timestamp || Date.now(),
            lastModified: Date.now(),
            messages: finalMessages,
            module,
            preset,
            language: lang,
            format: fmt,
            provider: input.provider,
            modelUsed: input.provider === 'GEMINI' ? input.geminiModel : input.openRouterModel
        };

        // Enforce 10-chat trial limit for new sessions
        if (isNewSession && sessionCount >= MAX_SESSIONS) {
          setToast({ message: `Límite de ${MAX_SESSIONS} chats alcanzado. Elimina una sesión para continuar.`, type: 'error' });
          setProcessingState(prev => ({ ...prev, isProcessing: false }));
          return null;
        }

        await upsertSession(user.id, updatedSession);
        await refreshSessions();

        if (isNewSession) {
            (async () => {
                let newTitle = "";
                const titleModel = 'gemini-3-flash-preview'; 
                if (input.provider === 'GEMINI') {
                    newTitle = await generateSessionTitle(titleModel, text, result, input.geminiKey);
                } else {
                    newTitle = await generateSessionTitleOpenRouter(input.openRouterKey, input.openRouterModel, text, result);
                }
                
                if (newTitle && newTitle !== 'Sesión') {
                     newTitle = newTitle.replace(/^["']|["']$/g, '');
                     await upsertSession(user.id, { ...updatedSession, title: newTitle });
                     await refreshSessions();
                }
            })();
        }

        setInput(prev => ({ ...prev, text: '', audio: { blob: null, url: null }, images: [] }));
        return result;

      } catch (err: any) {
        setProcessingState(prev => ({ ...prev, error: err.message || "Error al procesar." }));
        setToast({ message: "Error: " + err.message, type: "error" });
        return null;
      } finally {
        setProcessingState(prev => ({ ...prev, isProcessing: false }));
      }
  };

  // --- WIDGET & PIP HANDLERS ---
  const handleWidgetModuleChange = (module: ModuleType) => { setActiveModule(module); };
  const handleWidgetStateChange = (updates: Partial<UserInput>) => { setInput(prev => ({ ...prev, ...updates })); };
  const handleWidgetProcess = async (audio: AudioState) => {
      const result = await handleProcessing('', audio.blob, [], activeModule, input.preset, input.language, input.format);
      if (result) {
          if (pipWindow) { setWidgetManualCopyContent(result); return; }
          const copied = await copyToClipboardRobust(result, window);
          if (copied) {
              setIsWidgetSuccess(true);
              setToast({ message: "COPIADO", type: "success" });
              setTimeout(() => { setIsWidgetSuccess(false); }, 2000);
          } else { setWidgetManualCopyContent(result); }
      }
  };
  const handleManualCopy = async (text: string) => {
      const targetWin = pipWindow || window;
      const copied = await copyToClipboardRobust(text, targetWin);
      if (copied) {
          setIsWidgetSuccess(true);
          setWidgetManualCopyContent(null);
          setToast({ message: "COPIADO", type: "success" });
          setTimeout(() => setIsWidgetSuccess(false), 2000);
      } else { setToast({ message: "ERROR DE COPIADO", type: "error" }); }
  };
  const handleTogglePiP = async () => {
      if (window.self !== window.top) return;
      if (pipWindow) { pipWindow.close(); setPipWindow(null); return; }
      if ('documentPictureInPicture' in window) {
          try {
              const dpip = window.documentPictureInPicture as any;
              const pipWin = await dpip.requestWindow({ width: 150, height: 150 });
              pipWin.addEventListener('pagehide', () => { setPipWindow(null); });
              setPipWindow(pipWin);
          } catch (err) { console.error(err); }
      }
  };

  const loadSession = (session: Session) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setInput(prev => ({ 
        ...prev, 
        text: '', 
        audio: { blob: null, url: null }, 
        images: [],
        preset: session.preset,
        language: session.language,
        format: session.format,
        provider: session.provider || 'GEMINI'
    })); 
    setActiveModule(session.module); 
    setIsWidgetMode(false);
    if (pipWindow) pipWindow.close();
  };

  const resetSession = () => {
      setMessages([]);
      setCurrentSessionId(null);
      handleClearAudio();
      setInput(prev => ({ ...prev, text: '', images: [] }));
      setProcessingState({ isProcessing: false, isRecording: false, error: null });
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-thinklab-bg text-thinklab-text font-sans isolate">
      
      {/* Notifications */}
      {toast && ( pipWindow ? createPortal(<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />, pipWindow.document.body) : <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> )}
      {skillNotification && <SkillNotification module={skillNotification.module} details={skillNotification.details} onClose={() => setSkillNotification(null)} />}

      <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

      {isWidgetMode && !pipWindow && (
          <WidgetMode onExit={() => setIsWidgetMode(false)} onProcess={handleWidgetProcess} isProcessing={processingState.isProcessing} isSuccess={isWidgetSuccess} manualCopyContent={widgetManualCopyContent} onManualCopy={handleManualCopy} onTogglePiP={handleTogglePiP} isPip={false} activeModule={activeModule} userInput={input} onModuleChange={handleWidgetModuleChange} onStateChange={handleWidgetStateChange} />
      )}
      {pipWindow && createPortal(
          <WidgetMode onExit={() => { pipWindow.close(); setIsWidgetMode(false); }} onProcess={handleWidgetProcess} isProcessing={processingState.isProcessing} isSuccess={isWidgetSuccess} manualCopyContent={widgetManualCopyContent} onManualCopy={handleManualCopy} onTogglePiP={handleTogglePiP} isPip={true} activeModule={activeModule} userInput={input} onModuleChange={handleWidgetModuleChange} onStateChange={handleWidgetStateChange} />,
          pipWindow.document.body
      )}

      <HistorySidebar sessions={sessions} activeSessionId={currentSessionId} onSelect={loadSession} onNew={resetSession} onDelete={handleDeleteSession} onRename={handleRenameSession} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="flex-1 flex flex-col relative w-full h-full min-h-0 bg-thinklab-bg">
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-thinklab-border bg-thinklab-bg z-10">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-thinklab-text hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
             </button>
             <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-white uppercase select-none">IDEATION ENGINE</span>
          </div>

          {/* Right side: desktop shows full menu, mobile shows avatar+logout only */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Desktop-only extras */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-thinklab-surface border border-thinklab-border rounded-full">
                <div className={`w-1.5 h-1.5 rounded-full ${sessionCount >= MAX_SESSIONS ? 'bg-red-400' : sessionCount >= MAX_SESSIONS - 2 ? 'bg-amber-400' : 'bg-thinklab-cyan shadow-[0_0_8px_#00d4ff]'}`}></div>
                <span className="text-[10px] font-mono text-thinklab-text">{sessionCount}/{MAX_SESSIONS} chats</span>
              </div>
              <button onClick={() => setIsWidgetMode(true)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono border border-thinklab-border rounded hover:bg-thinklab-surface transition-all text-thinklab-text">
                 WIDGET
              </button>
            </div>

            {/* Always visible: avatar + logout */}
            <div className="flex items-center gap-2">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full border border-white/10" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center text-[11px] font-bold text-white border border-white/10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-[10px] font-mono text-thinklab-text max-w-[120px] truncate hidden lg:block">{user.name}</span>
              <button
                onClick={signOut}
                title="Cerrar sesión"
                className="p-1.5 text-thinklab-text hover:text-red-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>

          </div>
        </header>


        {/* Trial Banner */}
        <TrialBanner
          sessionCount={sessionCount}
          maxSessions={MAX_SESSIONS}
          onDeleteSession={() => setIsSidebarOpen(true)}
        />

        {/* --- SCROLLABLE CHAT AREA --- */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center min-h-0 pb-80 scroll-smooth bg-thinklab-bg" 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => { 
            e.preventDefault(); 
            if(e.dataTransfer.files && e.dataTransfer.files[0]) { 
              const file = e.dataTransfer.files[0]; 
              if(file.type.startsWith('image/')) { 
                const reader = new FileReader(); 
                reader.onload = () => { 
                  if (reader.result) {
                    setInput(prev => ({...prev, images: [...prev.images, reader.result as string]})); 
                    setIsSettingsPanelOpen(true); 
                  }
                }; 
                reader.readAsDataURL(file); 
              } 
            }
          }}
        >
          <div className="w-full max-w-5xl space-y-8">
            {processingState.error && (
              <div className="p-4 rounded border border-red-900/50 bg-red-900/10 text-red-200 text-sm font-mono">ERROR: {processingState.error}</div>
            )}
            
            {messages.length === 0 && !processingState.isProcessing && (
              <div className="flex flex-col items-center justify-start mt-10 select-none space-y-4 animate-fade-in">

                {/* 8-GRID WORKFLOW LAYOUT (REDESIGNED: SVG GHOST ICONS) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl px-4">
                    
                    {/* 1. CONTENT GENERATION */}
                    <div 
                        onClick={() => handleModuleSelect(ModuleType.CODE, { preset: 'SOCIAL_REEL', format: 'MARKDOWN' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-violet-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-violet-900/20"
                    >
                        <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.CODE]}
                        </div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-violet-400 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #1</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">Content Generation</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Reels, carruseles, posts y captions. Contenido listo para publicar con estrategia incluida.
                            </p>
                        </div>
                    </div>

                    {/* 2. SMART CALENDAR */}
                    <div 
                        onClick={() => handleModuleSelect(ModuleType.DESIGN, { preset: 'CALENDAR_CONTENT', format: 'MARKDOWN' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-amber-900/20"
                    >
                         <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.DESIGN]}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-amber-400 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #2</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">Smart Calendar</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Calendarios de contenido, tareas, proyectos y lanzamientos. Tu plan, estructurado al instante.
                            </p>
                        </div>
                    </div>

                    {/* 3. SEO & CAMPAIGNS */}
                    <div 
                        onClick={() => handleModuleSelect(ModuleType.SEO, { preset: 'SEO_AUDIT', format: 'MARKDOWN' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-teal-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-teal-900/20"
                    >
                         <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.SEO]}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-teal-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #3</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">SEO & Growth</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Organic and Paid dominance. Technical audits, EEAT strategy, and ad copy designed to convert.
                            </p>
                        </div>
                    </div>

                    {/* 4. DATA & STRUCTURE */}
                    <div 
                        onClick={() => handleModuleSelect(ModuleType.STRUCTURE, { preset: 'NOTES', format: 'JSON' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-purple-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-purple-900/20"
                    >
                         <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.STRUCTURE]}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-purple-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #4</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">Voice to Structure</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Chaos to Order. Synthesize messy voice notes into rigid data structures, valid JSON, or technical documentation.
                            </p>
                        </div>
                    </div>

                    {/* 5. COPY ALCHEMIST */}
                    <div 
                        onClick={() => handleModuleSelect(ModuleType.WRITING, { preset: 'EMAIL' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-green-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-green-900/20"
                    >
                         <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.WRITING]}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-green-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #5</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">Pro Refinement</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Persuasive Engineering. Elevate drafts to hypnotic narratives using psychological frameworks (AIDA, PAS).
                            </p>
                        </div>
                    </div>

                     {/* 6. TABLES & CSV */}
                     <div 
                        onClick={() => handleModuleSelect(ModuleType.TABLES, { preset: 'CONTENT_CALENDAR', format: 'CSV' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-cyan-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-cyan-900/20"
                    >
                         <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.TABLES]}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-cyan-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #6</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">Table Engine</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Data Matrix. Generate content calendars and complex databases, exportable directly to CSV.
                            </p>
                        </div>
                    </div>

                    {/* 7. META PROMPTING */}
                    <div 
                        onClick={() => handleModuleSelect(ModuleType.PROMPT, { preset: 'PROMPT', format: 'MARKDOWN' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-orange-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-900/20"
                    >
                         <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.PROMPT]}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-orange-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #7</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">Universal Prompt</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Meta-Programming. Design master instructions to dominate Midjourney v6, Flux, or XML Systems.
                            </p>
                        </div>
                    </div>

                    {/* 8. IDEATION */}
                    <div 
                        onClick={() => handleModuleSelect(ModuleType.IDEATION, { preset: 'GENERAL', format: 'MARKDOWN' }, true)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 h-40 cursor-pointer hover:border-pink-500/50 transition-all hover:-translate-y-1 shadow-lg hover:shadow-pink-900/20"
                    >
                         <div className="absolute -right-2 -bottom-2 w-20 h-20 text-neutral-500/10 group-hover:text-white/5 transition-all duration-500 transform rotate-12 scale-100 group-hover:scale-110 group-hover:rotate-6">
                            {GHOST_ICONS[ModuleType.IDEATION]}
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-pink-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-1">WORKFLOW #8</h3>
                                <h2 className="text-white font-bold text-lg leading-tight">Brainstorming</h2>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed font-light">
                                Creative Unlocking. Expand horizons with lateral thinking, SCAMPER, and First Principles.
                            </p>
                        </div>
                    </div>

                </div>
              </div>
            )}
            {/* Rest of Component... */}
            {/* MESSAGE LIST RENDERER */}
            {messages.map((msg, idx) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                    <div className={`max-w-[90%] md:max-w-[95%] w-full`}>
                        {msg.role === 'user' ? (
                            <div className="flex justify-end mb-2">
                                <div className="bg-thinklab-surface border border-thinklab-border rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-thinklab-accent">
                                    {/* Images Display */}
                                    {msg.images && msg.images.length > 0 && (
                                        <div className="flex gap-2 mb-3 flex-wrap justify-end">
                                            {msg.images.map((img, i) => (
                                                <img key={i} src={img} className="w-32 h-32 object-cover rounded-lg border border-thinklab-border" />
                                            ))}
                                        </div>
                                    )}
                                    {msg.audioUrl && (
                                        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-thinklab-highlight">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /><path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" /></svg>
                                            AUDIO INPUT
                                        </div>
                                    )}
                                    {msg.content}
                                </div>
                            </div>
                        ) : (
                            // MODEL OUTPUT
                            <OutputRenderer
                                content={msg.content}
                                isTableContent={activeModule === ModuleType.TABLES}
                                module={activeModule}
                                preset={input.preset}
                            />
                        )}
                    </div>
                </div>
            ))}
            {/* Rest of render... */}
            {processingState.isProcessing && (
               <div className="flex items-center gap-4 py-4 animate-pulse px-4">
                  <div className="w-8 h-8 rounded-full border border-thinklab-highlight/50 flex items-center justify-center bg-black/40">
                      <div className="w-4 h-4 rounded-full border-t border-thinklab-accent animate-spin"></div>
                  </div>
                  <span className="font-mono text-xs text-thinklab-text/50">Thinking...</span>
               </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* --- INPUT PANEL TAB (always visible, simple fixed button) --- */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <button
            onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
            className="pointer-events-auto bg-[#0a0a0a] border border-b-0 border-white/10 rounded-t-xl px-8 py-2 text-[10px] font-mono font-bold text-gray-400 hover:text-white transition-colors shadow-[0_-5px_20px_rgba(0,0,0,0.5)] flex items-center gap-2 group tracking-widest"
          >
            {isSettingsPanelOpen ? (
              <><div className="w-2 h-0.5 bg-gray-500 group-hover:bg-white rounded-full transition-colors"></div> OCULTAR</>
            ) : (
              <><div className="w-2 h-0.5 bg-gray-500 group-hover:bg-white rounded-full transition-colors"></div> INPUT PANEL</>
            )}
          </button>
        </div>

        {/* --- COLLAPSIBLE INPUT PANEL (only in DOM when open) --- */}
        {isSettingsPanelOpen && (
        <div className="fixed bottom-0 left-0 w-full z-[19] bg-[#050505] border-t border-white/5 shadow-2xl animate-fade-in">
          <div className="h-8" /> {/* spacer so content doesn't overlap the tab */}
          <div className="w-full">

              {/* PROVIDER SETTINGS */}
              {showProviderSettings && (
                <div className="w-full bg-[#0a0a0a]/50 border-b border-white/5 p-4 animate-fade-in">
                    {/* ... Settings Form ... */}
                    <div className="max-w-md mx-auto space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-mono font-bold text-gray-400 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                CONNECTION MANAGER
                            </span>
                            <button onClick={() => setShowProviderSettings(false)} className="text-xs text-gray-500 hover:text-white ml-2">✕</button>
                        </div>
                        
                        <div className="flex p-1 bg-black/40 rounded-lg border border-white/5 mb-4">
                            <button onClick={() => setInput(prev => ({ ...prev, provider: 'GEMINI' }))} className={`flex-1 py-2 text-xs font-mono rounded-md transition-all ${input.provider === 'GEMINI' ? 'bg-[#171717] text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}>GEMINI</button>
                            <button onClick={() => setInput(prev => ({ ...prev, provider: 'OPENROUTER' }))} className={`flex-1 py-2 text-xs font-mono rounded-md transition-all ${input.provider === 'OPENROUTER' ? 'bg-[#171717] text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}>OPENROUTER</button>
                        </div>

                        <div className="space-y-3 bg-[#0a0a0a] p-4 rounded-xl border border-white/5 shadow-inner">
                            <div>
                                <label className="block text-[9px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Workspace Name</label>
                                <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} className="w-full bg-[#111] border border-white/5 rounded px-3 py-2 text-xs text-white outline-none focus:border-blue-500/30 transition-colors" />
                            </div>
                            {input.provider === 'GEMINI' && (
                                <>
                                    <div>
                                        <label className="block text-[9px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Gemini API Key</label>
                                        <input
                                            type="password"
                                            value={input.geminiKey}
                                            onChange={(e) => setInput(prev => ({ ...prev, geminiKey: e.target.value }))}
                                            placeholder="AIza..."
                                            className="w-full bg-[#111] border border-white/5 rounded px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/30 transition-colors font-mono"
                                        />
                                        <p className="text-[9px] text-gray-600 mt-1">Obtén tu key en <span className="text-cyan-600">aistudio.google.com</span></p>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Model Selection</label>
                                        <div className="relative">
                                            <select value={input.geminiModel} onChange={(e) => setInput(prev => ({ ...prev, geminiModel: e.target.value }))} className="w-full bg-[#111] border border-white/5 rounded px-3 py-2 text-xs text-white outline-none appearance-none focus:border-blue-500/30 transition-colors cursor-pointer">
                                                {Object.entries(GEMINI_MODELS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {input.provider === 'OPENROUTER' && (
                                <>
                                    <div>
                                        <label className="block text-[9px] font-mono text-gray-500 mb-1 uppercase tracking-widest">API Key</label>
                                        <input type="password" value={input.openRouterKey} onChange={(e) => setInput(prev => ({ ...prev, openRouterKey: e.target.value }))} className="w-full bg-[#111] border border-white/5 rounded px-3 py-2 text-xs text-white outline-none focus:border-purple-500/30 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Model ID</label>
                                        <input type="text" value={input.openRouterModel} onChange={(e) => setInput(prev => ({ ...prev, openRouterModel: e.target.value }))} list="or-models" className="w-full bg-[#111] border border-white/5 rounded px-3 py-2 text-xs text-white outline-none focus:border-purple-500/30 transition-colors" />
                                        <datalist id="or-models">{Object.entries(OPENROUTER_MODELS).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</datalist>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-2 pt-2">
                                <button onClick={handleTestConnection} disabled={connectionStatus === 'TESTING'} className={`flex-1 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${connectionStatus === 'SUCCESS' ? 'bg-green-900/20 border-green-500/30 text-green-400' : connectionStatus === 'ERROR' ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-[#111] border-white/5 text-gray-400 hover:text-white'}`}>
                                    {connectionStatus === 'TESTING' ? 'CONNECTING...' : connectionStatus === 'SUCCESS' ? 'CONNECTED ✓' : 'TEST CONNECTION'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* Pending Images */}
              {input.images.length > 0 && (
                  <div className="px-6 pt-4 flex gap-3 overflow-x-auto justify-center">
                      {input.images.map((img, idx) => (
                          <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                              <img src={img} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                              <button onClick={() => removeImage(idx)} className="absolute top-0 right-0 p-1 bg-black/60 hover:bg-red-500 text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                              </button>
                          </div>
                      ))}
                  </div>
              )}

              <div className="p-4 md:p-6 flex flex-col items-center gap-5">
                {/* SETTINGS BAR (Provider, Language, Preset, Format) */}
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                    {/* ... Selectors ... */}
                    {/* Provider Toggle */}
                    <button onClick={() => setShowProviderSettings(!showProviderSettings)} className={`group relative flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-lg border text-[10px] md:text-xs font-mono transition-all overflow-hidden ${input.provider === 'OPENROUTER' ? 'bg-purple-900/10 border-purple-500/30 text-purple-300 hover:border-purple-500/50' : 'bg-thinklab-cyan/10 border-thinklab-cyan/30 text-thinklab-cyan hover:border-thinklab-cyan/50'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor] ${input.provider === 'OPENROUTER' ? 'bg-purple-400' : 'bg-thinklab-cyan'}`} />
                        {input.provider === 'OPENROUTER' ? 'OPENROUTER' : 'GEMINI'}
                    </button>
                    
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    
                    {/* Select Wrapper Helper */}
                    {([
                        { value: input.language, options: Object.entries(LANGUAGES), setter: (v: string) => setInput(p => ({ ...p, language: v as TargetLanguage })) },
                        { value: input.preset, options: MODULE_SPECIFIC_CONFIG[activeModule].validPresets.map(p => [p, PRESETS[p]]), setter: (v: string) => setInput(p => ({ ...p, preset: v as PresetType })) },
                        { value: input.format, options: MODULE_SPECIFIC_CONFIG[activeModule].validFormats.map(f => [f, FORMATS[f]]), setter: (v: string) => setInput(p => ({ ...p, format: v as OutputFormat })) }
                    ] as const).map((item, idx) => (
                        <div key={idx} className="relative group">
                            <select 
                                value={item.value} 
                                onChange={(e) => item.setter(e.target.value)} 
                                className="appearance-none bg-[#111] border border-white/10 text-[10px] md:text-xs text-gray-300 rounded-lg pl-3 pr-7 py-1.5 outline-none focus:border-blue-500/40 hover:bg-[#161616] hover:text-white transition-all cursor-pointer shadow-sm min-w-[100px]"
                            >
                                {item.options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            {/* Custom Chevron */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-gray-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MAIN INPUT CAPSULE */}
                <div className="flex items-end justify-center w-full gap-2 relative bg-[#111] p-1.5 rounded-3xl border border-white/10 shadow-2xl max-w-4xl transition-all focus-within:border-white/20 focus-within:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <button 
                        onClick={handleImageUploadClick} 
                        className="p-3 mb-0.5 rounded-full text-gray-500 hover:text-white hover:bg-white/5 transition-all flex-shrink-0"
                        title="Subir Imagen"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                    </button>
                    
                    <textarea 
                        ref={textareaRef}
                        value={input.text}
                        onChange={(e) => setInput(prev => ({ ...prev, text: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSubmit(); } }}
                        placeholder="Describe tu idea, pega contenido o usa el micrófono..."
                        className="flex-1 bg-transparent border-0 outline-none text-sm text-gray-200 placeholder-gray-600 resize-none max-h-32 py-3.5 scrollbar-hide font-light"
                        rows={1}
                    />

                    {(input.text.trim().length > 0 || input.images.length > 0) ? (
                        <button 
                            onClick={handleTextSubmit}
                            className="p-3 mb-0.5 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:to-blue-600 transition-all flex-shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-fade-in"
                            title="Enviar"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>
                        </button>
                    ) : (
                        <div className="mb-0.5">
                            <AudioInput onAudioCapture={handleAudioCapture} onClear={handleClearAudio} currentAudio={input.audio} />
                        </div>
                    )}
                </div>

                {/* MODULE SELECTOR (Mini Cards - Ghost Watermark Style) */}
                <div className="flex gap-2 pb-2 overflow-x-auto w-full justify-center px-4 pt-1">
                    {Object.values(ModuleType).map((mod) => {
                        const theme = MODULE_THEMES[mod];
                        const isActive = activeModule === mod;
                        return (
                            <button 
                                key={mod} 
                                onClick={() => handleModuleSelect(mod, {}, false)} 
                                className={`
                                    relative group flex flex-col items-center justify-center 
                                    w-12 h-12 md:w-14 md:h-14 rounded-xl border transition-all duration-300 flex-shrink-0 overflow-hidden
                                    ${isActive 
                                        ? `bg-black/20 ${theme.border} ${theme.shadow} scale-[1.05]` 
                                        : 'bg-transparent border-transparent hover:bg-white/5 opacity-60 hover:opacity-100'
                                    }
                                `}
                            >
                                {/* Watermark Ghost Icon (Background) */}
                                <div className={`
                                    absolute inset-0 flex items-center justify-center 
                                    transition-all duration-500 transform pointer-events-none
                                    ${isActive ? `opacity-30 scale-125 rotate-0 ${theme.color}` : 'opacity-10 scale-110 -rotate-12 text-gray-400 group-hover:opacity-20 group-hover:rotate-0'}
                                `}>
                                    <div className="w-8 h-8 md:w-9 md:h-9">
                                        {GHOST_ICONS[mod]}
                                    </div>
                                </div>
                                
                                {/* Label Text (Foreground) */}
                                <span className={`
                                    relative z-10 text-[8px] md:text-[9px] font-mono font-bold tracking-widest uppercase transition-colors
                                    ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}
                                `}>
                                    {MODULE_LABELS[mod]}
                                </span>
                            </button>
                        );
                    })}
                </div>
              </div>
          </div>
        </div>
        )} {/* end isSettingsPanelOpen */}

      </main>

    </div>
  );
};

export default App;
