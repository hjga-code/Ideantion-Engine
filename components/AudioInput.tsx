import React, { useRef } from 'react';
import { AudioState } from '../types';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface AudioInputProps {
  onAudioCapture: (audio: AudioState) => void;
  onClear: () => void;
  currentAudio: AudioState;
}

const AudioInput: React.FC<AudioInputProps> = ({ onAudioCapture, onClear, currentAudio }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { isRecording, recordingTime, startRecording, stopRecording, cancelRecording } = useAudioRecorder({
    onAudioCapture
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Visualizer Canvas / Placeholder - Only shown when active or has audio */}
      {(isRecording || currentAudio.url) && (
        <div className="h-12 w-full max-w-[200px] flex items-center justify-center relative overflow-hidden rounded bg-thinklab-surface/50 border border-thinklab-border">
            {isRecording ? (
            <canvas ref={canvasRef} width="200" height="48" className="w-full h-full opacity-70" />
            ) : currentAudio.url ? (
                <div className="flex items-center gap-2 px-4 w-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-thinklab-accent font-mono truncate">Audio capturado</span>
                    <audio src={currentAudio.url} controls className="hidden" />
                </div>
            ) : null}
        </div>
      )}

      <div className="flex items-center gap-4">
        {isRecording ? (
          <div className="flex items-center gap-3">
              {/* CANCEL BUTTON */}
              <button
                onClick={cancelRecording}
                className="group flex items-center justify-center w-10 h-10 rounded-full border border-thinklab-border bg-thinklab-surface hover:bg-red-900/30 hover:border-red-800 transition-all"
                title="Cancelar grabación (Descartar)"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-thinklab-text group-hover:text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
              </button>

              {/* STOP & PROCESS BUTTON */}
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-6 py-2 bg-red-900/20 text-red-500 border border-red-900 hover:bg-red-900/40 rounded-full transition-all"
                title="Detener y Procesar"
              >
                <div className="w-3 h-3 bg-red-500 rounded-sm animate-pulse" />
                <span className="font-mono text-xs">{formatTime(recordingTime)}</span>
              </button>
          </div>
        ) : (
          <div className="flex gap-2">
             <button
                onClick={() => startRecording(canvasRef)}
                disabled={!!currentAudio.blob}
                className={`p-4 rounded-full transition-all duration-300 border ${
                  currentAudio.blob 
                  ? 'bg-thinklab-surface border-thinklab-border text-thinklab-text opacity-50 cursor-not-allowed' 
                  : 'bg-thinklab-accent text-thinklab-bg border-transparent hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                }`}
                title="Grabar Audio"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                  <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
              </button>
             
              {currentAudio.blob && (
                  <button 
                    onClick={onClear}
                    className="p-4 rounded-full bg-thinklab-surface border border-thinklab-border text-thinklab-text hover:text-red-400 hover:border-red-900/50 transition-all"
                    title="Eliminar Audio"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                  </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioInput;