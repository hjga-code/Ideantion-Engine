
import React, { useState } from 'react';
import { Session } from '../types';
import { MODULE_ICONS } from '../constants';
import { ThinkLabLogo } from './ThinkLabLogo';

interface HistorySidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelect: (session: Session) => void;
  onNew: () => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onRename: (id: string, newTitle: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
    sessions, 
    activeSessionId, 
    onSelect, 
    onNew, 
    onDelete, 
    onRename,
    isOpen, 
    toggleSidebar 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (session: Session, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingId(session.id);
      setEditTitle(session.title);
  };

  const saveEditing = () => {
      if (editingId && editTitle.trim()) {
          onRename(editingId, editTitle);
      }
      setEditingId(null);
      setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          saveEditing();
      } else if (e.key === 'Escape') {
          setEditingId(null);
      }
  };

  return (
    <>
      {/* Mobile Overlay — only rendered when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container
          Mobile:  hidden (display:none) when closed → no GPU layer, no bleed-through
                   flex + fixed when open
          Desktop: always flex + relative, animate width 0↔72
      */}
      <div className={`
        fixed md:relative z-30 flex-col h-[100dvh] md:h-full
        bg-thinklab-bg border-r border-thinklab-border overflow-hidden
        md:transition-all md:duration-300 md:ease-in-out
        ${isOpen ? 'flex w-72' : 'hidden md:flex md:w-0'}
      `}>
        <div className="w-72 flex flex-col h-full">
            <div className="p-4 border-b border-thinklab-border flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
                <ThinkLabLogo className="w-6 h-6 text-thinklab-accent flex-shrink-0" />
                <h1 className="font-mono text-xs font-bold tracking-wider text-thinklab-accent truncate">THINKLAB IDEATION ENGINE</h1>
            </div>
            <button onClick={onNew} className="p-2 hover:bg-thinklab-surface rounded text-thinklab-text transition-colors flex-shrink-0" title="Nueva Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {sessions.length === 0 ? (
                <div className="text-center text-xs text-thinklab-text mt-10 opacity-50 font-mono px-4">
                NO HAY SESIONES<br/>GUARDADAS
                </div>
            ) : (
                sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                const isEditing = editingId === session.id;
                const lastMessage = session.messages[session.messages.length - 1];
                
                return (
                <div
                    key={session.id}
                    onClick={() => {
                        onSelect(session);
                        if (window.innerWidth < 768) toggleSidebar();
                    }}
                    className={`w-full text-left p-3 rounded-md border transition-all group relative cursor-pointer
                        ${isActive 
                            ? 'bg-thinklab-surface border-thinklab-border/80 shadow-inner' 
                            : 'bg-transparent border-transparent hover:bg-thinklab-surface/50 hover:border-thinklab-border/30'
                        }
                    `}
                >
                    <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono ${isActive ? 'text-thinklab-highlight' : 'text-thinklab-text opacity-50'}`}>
                        {new Date(session.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour:'2-digit', minute:'2-digit' })}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-thinklab-text bg-black/20 px-1 rounded uppercase">{session.preset.slice(0,3)}</span>
                        <span className="text-xs" title={session.module}>{MODULE_ICONS[session.module]}</span>
                    </div>
                    </div>
                    
                    <div className="pr-6">
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={saveEditing}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-black/30 border border-thinklab-highlight/50 rounded px-1 py-0.5 text-sm text-white outline-none font-medium"
                            />
                        ) : (
                            <div 
                                className={`text-sm font-medium truncate hover:text-white hover:underline decoration-thinklab-border/50 underline-offset-4 ${isActive ? 'text-white' : 'text-thinklab-accent'}`}
                                title="Click para renombrar"
                                onClick={(e) => {
                                    startEditing(session, e);
                                }}
                            >
                                {session.title}
                            </div>
                        )}
                    </div>
                    
                    <div className="text-xs text-thinklab-text truncate mt-1 opacity-60 font-mono flex items-center gap-1">
                    <span>{session.messages.length} msgs</span>
                    <span>•</span>
                    <span>{lastMessage?.content?.slice(0, 15) || '...'}</span>
                    </div>

                    {/* Delete Action - Visible on Hover */}
                    <button 
                        onClick={(e) => onDelete(session.id, e)}
                        className="absolute right-2 bottom-3 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1.5 bg-thinklab-surface rounded z-10 hover:bg-red-900/20"
                        title="Borrar Sesión"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
                )})
            )}
            </div>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
