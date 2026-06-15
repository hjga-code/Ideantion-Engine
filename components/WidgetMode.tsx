
import React, { useState, useRef, useEffect } from 'react';
import { ModuleType, PresetType, AudioState, UserInput, TargetLanguage, OutputFormat } from '../types';
import { MODULE_ICONS, PRESETS, LANGUAGES, FORMATS, GEMINI_MODELS, OPENROUTER_MODELS, MODULE_SPECIFIC_CONFIG, LOCALIZED_PRESETS, LOCALIZED_LANGUAGES, LOCALIZED_FORMATS } from '../constants';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface WidgetModeProps {
  onExit: () => void;
  onProcess: (audio: AudioState) => void;
  isProcessing: boolean;
  isSuccess?: boolean;
  manualCopyContent?: string | null;
  onManualCopy?: (text: string) => void;
  onTogglePiP?: () => void;
  isPip?: boolean;
  
  // Synced Props
  activeModule: ModuleType;
  userInput: UserInput;
  onModuleChange: (module: ModuleType) => void;
  onStateChange: (updates: Partial<UserInput>) => void;
  uiLanguage?: 'en' | 'es';
}

const WidgetMode: React.FC<WidgetModeProps> = ({ 
    onExit, 
    onProcess, 
    isProcessing, 
    isSuccess = false,
    manualCopyContent = null,
    onManualCopy,
    onTogglePiP, 
    isPip = false,
    activeModule,
    userInput,
    onModuleChange,
    onStateChange,
    uiLanguage = 'en'
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [subSettings, setSubSettings] = useState<'MAIN' | 'AI'>('MAIN'); 

  const isEs = uiLanguage === 'es';
  const labelSettings = isEs ? 'AJUSTES' : 'SETTINGS';
  const labelBack = isEs ? '< VOLVER' : '< BACK';
  const labelCopy = isEs ? 'COPIAR' : 'COPY';
  const labelCopied = isEs ? 'COPIADO' : 'COPIED';
  const titleClose = isEs ? 'Cerrar' : 'Close';
  const titleSettings = isEs ? 'Ajustes' : 'Settings';
  const titleFloating = isEs ? 'Ventana Flotante' : 'Floating Window';
  const titleCancel = isEs ? 'Cancelar' : 'Cancel';
  
  // Draggable State
  const [position, setPosition] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 180 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleAudioCapture = (audio: AudioState) => {
    onProcess(audio);
  };

  const { isRecording, startRecording, stopRecording, cancelRecording } = useAudioRecorder({
    onAudioCapture: handleAudioCapture
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPip) return; 
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('select') || (e.target as HTMLElement).closest('input')) return;
    
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const containerStyle: React.CSSProperties = isPip 
    ? { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', width: '100%', height: '100%' }
    : { position: 'fixed', left: position.x, top: position.y, touchAction: 'none', zIndex: 50, cursor: isDragging ? 'grabbing' : 'grab' };

  const handleMainButtonClick = () => {
      if (manualCopyContent && onManualCopy) {
          onManualCopy(manualCopyContent);
      } else if (isRecording) {
          stopRecording();
      } else {
          startRecording(canvasRef);
      }
  };

  return (
    <div style={containerStyle} onMouseDown={handleMouseDown} className={!isPip ? "animate-fade-in" : ""}>
      <div className="relative flex items-center justify-center">
        
        {/* Config Button */}
        {!isRecording && !manualCopyContent && (
        <button 
            onClick={() => { setIsSettingsOpen(!isSettingsOpen); setSubSettings('MAIN'); }}
            className="absolute p-2 bg-black/60 backdrop-blur rounded-full border border-white/10 text-white/50 hover:text-white hover:scale-110 transition-all z-50 shadow-xl"
            style={{ position: 'absolute', top: '-15px', right: '-15px' }} 
            title={titleSettings}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.795" />
            </svg>
        </button>
        )}

        {/* Exit Button */}
        {!isRecording && !manualCopyContent && (
        <button 
            onClick={onExit}
            className="absolute p-2 bg-black/60 backdrop-blur rounded-full border border-white/10 text-white/50 hover:text-red-400 hover:scale-110 transition-all z-50 shadow-xl"
            style={{ position: 'absolute', top: '-15px', left: '-15px' }}
            title={titleClose}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        )}

        {/* PiP Button */}
        {!isPip && onTogglePiP && !isRecording && !manualCopyContent && (
            <button
                onClick={onTogglePiP}
                className="absolute p-2 bg-black/60 backdrop-blur rounded-full border border-white/10 text-white/50 hover:text-white hover:scale-110 transition-all z-50 shadow-xl"
                style={{ position: 'absolute', bottom: '-15px', right: '-15px' }}
                title={titleFloating}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </button>
        )}

        {/* --- SETTINGS MENU --- */}
        {isSettingsOpen && !manualCopyContent && (
             <div 
                className="absolute z-[60] w-48 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-2 shadow-2xl animate-fade-in flex flex-col gap-2"
                style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)' }}
             >
                 {subSettings === 'MAIN' ? (
                     <>
                        <div className="flex justify-between items-center pb-1 border-b border-white/5">
                            <span className="text-[9px] font-mono text-white/50">{labelSettings}</span>
                            <div className="flex gap-2">
                                <button onClick={() => setSubSettings('AI')} className="text-[8px] px-1 bg-white/10 rounded text-blue-300">AI KEY</button>
                                <button onClick={() => setIsSettingsOpen(false)} className="text-white/50 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg></button>
                            </div>
                        </div>
                        {/* Dynamic Module Grid */}
                        <div className="grid grid-cols-4 gap-1">
                            {Object.values(ModuleType).map(m => (
                                <button key={m} onClick={() => onModuleChange(m)} className={`rounded flex items-center justify-center h-6 text-[9px] border transition-colors ${activeModule === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`} title={m}>
                                    {MODULE_ICONS[m]}
                                </button>
                            ))}
                        </div>
                        
                        {/* Dynamic Presets (Filtered) */}
                        <select value={userInput.preset} onChange={(e) => onStateChange({ preset: e.target.value as PresetType })} className="bg-white/5 border border-white/10 rounded text-[9px] text-gray-300 px-1 py-1 outline-none">
                            {MODULE_SPECIFIC_CONFIG[activeModule].validPresets.map(preset => (
                                <option key={preset} value={preset}>{LOCALIZED_PRESETS[uiLanguage][preset]}</option>
                            ))}
                        </select>
                        
                        <select value={userInput.language} onChange={(e) => onStateChange({ language: e.target.value as TargetLanguage })} className="bg-white/5 border border-white/10 rounded text-[9px] text-gray-300 px-1 py-1 outline-none">
                            {Object.entries(LOCALIZED_LANGUAGES[uiLanguage]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        
                        {/* Dynamic Formats (Filtered) */}
                        <select value={userInput.format} onChange={(e) => onStateChange({ format: e.target.value as OutputFormat })} className="bg-white/5 border border-white/10 rounded text-[9px] text-gray-300 px-1 py-1 outline-none">
                            {MODULE_SPECIFIC_CONFIG[activeModule].validFormats.map(fmt => (
                                <option key={fmt} value={fmt}>{LOCALIZED_FORMATS[uiLanguage][fmt]}</option>
                            ))}
                        </select>
                     </>
                 ) : (
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center pb-1 border-b border-white/5">
                            <button onClick={() => setSubSettings('MAIN')} className="text-[9px] text-white/50 hover:text-white flex items-center gap-1">
                                <span>{labelBack}</span>
                            </button>
                        </div>
                        <div className="flex gap-1 mb-1">
                            <button onClick={() => onStateChange({ provider: 'GEMINI' })} className={`flex-1 text-[8px] py-1 rounded ${userInput.provider === 'GEMINI' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400'}`}>GEMINI</button>
                            <button onClick={() => onStateChange({ provider: 'OPENROUTER' })} className={`flex-1 text-[8px] py-1 rounded ${userInput.provider === 'OPENROUTER' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'}`}>OPENROUTER</button>
                        </div>
                        {userInput.provider === 'OPENROUTER' && (
                            <>
                                <input type="password" value={userInput.openRouterKey} onChange={(e) => onStateChange({ openRouterKey: e.target.value })} placeholder="OR Key..." className="bg-white/5 border border-white/10 rounded text-[9px] text-white px-1 py-1 outline-none w-full" />
                                <select 
                                    value={userInput.openRouterModel}
                                    onChange={(e) => onStateChange({ openRouterModel: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded text-[9px] text-white px-1 py-1 outline-none w-full"
                                >
                                    {Object.entries(OPENROUTER_MODELS).map(([id, name]) => (
                                        <option key={id} value={id}>{name.replace('(Free)', '')}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        {userInput.provider === 'GEMINI' && (
                            <>
                                <select 
                                    value={userInput.geminiModel}
                                    onChange={(e) => onStateChange({ geminiModel: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded text-[9px] text-white px-1 py-1 outline-none w-full"
                                >
                                    {Object.entries(GEMINI_MODELS).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                                <span className="text-[8px] text-gray-500 text-center">API Key: ENV</span>
                            </>
                        )}
                     </div>
                 )}
             </div>
        )}

        {/* --- MAIN WIDGET CIRCLE --- */}
        <div className="relative group" style={{ width: '100px', height: '100px', position: 'relative' }}> 
            {isRecording && (
                <div className="absolute inset-0 rounded-3xl bg-red-600/30 blur-xl animate-pulse-slow scale-125 z-0 pointer-events-none" style={{ backgroundColor: 'rgba(220, 38, 38, 0.3)', filter: 'blur(24px)' }}></div>
            )}

            <div 
              className={`relative w-full h-full rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden z-10 ${isSuccess ? 'bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.6)] scale-105' : manualCopyContent ? 'bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.6)] ring-2 ring-white/50' : isRecording ? 'shadow-[0_0_40px_rgba(255,255,255,0.2)] bg-thinklab-bg/60 border border-red-500/30' : 'shadow-2xl bg-black/40 border border-white/10'} backdrop-blur-xl`}
              style={{ borderRadius: '20px' }}
            >
                {/* Visualizer & Content */}
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center animate-fade-in text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg><span className="font-mono text-[9px] font-bold tracking-widest">{labelCopied}</span></div>
                ) : (
                    <>
                        {isRecording && (
                            <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-50 pointer-events-none flex items-center justify-center">
                                <canvas ref={canvasRef} width="100" height="100" className="w-full h-full scale-125" />
                                <div className="absolute inset-0 border-2 border-red-500/50 rounded-2xl animate-ping opacity-20" style={{ borderColor: 'rgba(239, 68, 68, 0.5)', borderRadius: '20px' }}></div>
                            </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <button
                                onClick={handleMainButtonClick}
                                disabled={isProcessing}
                                style={{ backgroundColor: isRecording ? '#ef4444' : manualCopyContent ? '#2563eb' : undefined, width: '50px', height: '50px', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                                className={`z-10 w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-500 ${manualCopyContent ? 'bg-white text-blue-600 shadow-lg hover:scale-105' : isRecording ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-90 animate-pulse' : isProcessing ? 'bg-thinklab-surface/50 border border-white/10' : 'bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md'}`}
                            >
                                {isProcessing ? (
                                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }}>
                                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                    </div>
                                ) : manualCopyContent ? (
                                    <div className="flex flex-col items-center animate-fade-in text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg><span className="text-[7px] font-bold font-mono">{labelCopy}</span></div>
                                ) : isRecording ? (
                                    <div className="w-4 h-4 bg-white rounded-sm" /> 
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/90"><path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /><path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" /></svg>
                                )}
                            </button>
                            <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-yellow-500' : userInput.provider === 'OPENROUTER' ? 'bg-purple-500' : 'bg-green-500/50'}`} style={{ position: 'absolute', bottom: '-8px' }} />
                            {isRecording && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); cancelRecording(); }}
                                    className="absolute p-1.5 bg-red-900/80 backdrop-blur rounded-full border border-red-500/50 text-white hover:bg-red-800 transition-all z-20 shadow-lg animate-fade-in"
                                    style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translate(-50%, 16px)' }}
                                    title={titleCancel}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetMode;
