import React, { useState } from 'react';

interface GuidedTourProps {
  onClose: () => void;
}

interface Step {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: "Welcome to Ideation Engine",
      subtitle: "Your high-performance multi-workflow AI companion",
      description: "This platform is designed to help you transform chaotic voice notes, raw drafts, or reference images into structured professional documents, valid data schemas (JSON), or spreadsheets (CSV) instantly using state-of-the-art AI models.",
      icon: (
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-pulse-slow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-blue-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
      )
    },
    {
      title: "Specialized Workflows",
      subtitle: "8 modules designed to automate your recurring tasks",
      description: "At the bottom of the screen, you will find 8 modules (Content Generation, Smart Calendar, SEO, Voice to Structure, Pro Refinement, Table Engine, Universal Prompting, and Brainstorming). Each workflow adapts the AI logic and prompts to deliver optimal results.",
      icon: (
        <div className="relative grid grid-cols-3 gap-2 p-3 w-28 h-28 rounded-2xl bg-violet-500/10 border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
          <div className="rounded bg-violet-500/20 border border-violet-500/30"></div>
          <div className="rounded bg-pink-500/20 border border-pink-500/30"></div>
          <div className="rounded bg-amber-500/20 border border-amber-500/30"></div>
          <div className="rounded bg-teal-500/20 border border-teal-500/30"></div>
          <div className="rounded bg-purple-500/40 border border-purple-400/50 animate-pulse"></div>
          <div className="rounded bg-green-500/20 border border-green-500/30"></div>
          <div className="rounded bg-cyan-500/20 border border-cyan-500/30"></div>
          <div className="rounded bg-orange-500/20 border border-orange-500/30"></div>
          <div className="rounded bg-blue-500/20 border border-blue-500/30"></div>
        </div>
      )
    },
    {
      title: "Input Control Panel",
      subtitle: "Define output language, presets, and output formats",
      description: "Click the 'INPUT PANEL' tab at the bottom to expand settings. Here you can configure API keys, select models, choose output languages, change presets, or select your final document format (Markdown, structured JSON, or CSV).",
      icon: (
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-amber-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
        </div>
      )
    },
    {
      title: "Integrated Audio & Images",
      subtitle: "Capture ideas on the go with your voice or visual references",
      description: "Drag, paste, or upload images directly to serve as visual context. In addition, with our Smart Audio support, you can click the microphone icon to record chaotic voice notes up to 10 minutes long, which will be processed instantly.",
      icon: (
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
          <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0Z" />
            </svg>
          </div>
        </div>
      )
    },
    {
      title: "Floating Widget (PiP)",
      subtitle: "Work ultra-productively in the background",
      description: "Click the 'WIDGET' button in the header to open a compact, minimalist view. If your browser supports it, you can activate Picture-in-Picture (PiP) mode to keep a floating window always visible, letting you dictate notes and copy results to the clipboard while working in other apps.",
      icon: (
        <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 text-cyan-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25M19.5 3h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 18h15a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 19.5 3Z" />
          </svg>
          <div className="absolute top-4 right-4 w-10 h-8 rounded border border-cyan-400/50 bg-cyan-900/30 flex items-center justify-center animate-bounce">
            <div className="w-4 h-3 bg-cyan-400/80 rounded-sm"></div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('thinklab_guided_tour_completed_v2', 'true');
    onClose();
  };

  const activeStep = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center justify-between text-center overflow-hidden min-h-[440px] transition-all">
        
        {/* Glow effect in background */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px] pointer-events-none"></div>

        {/* Skip button in corner */}
        <button 
          onClick={handleComplete} 
          className="absolute top-4 right-4 text-xs font-mono text-gray-500 hover:text-white transition-colors"
        >
          Skip Tour ✕
        </button>

        {/* Dynamic Step Icon */}
        <div className="mb-6 flex justify-center items-center h-28">
          {activeStep.icon}
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-2 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {activeStep.title}
          </h2>
          <h3 className="text-xs md:text-sm font-mono text-blue-400 font-medium uppercase tracking-wider">
            {activeStep.subtitle}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-sm mx-auto font-light pt-2">
            {activeStep.description}
          </p>
        </div>

        {/* Controls and Progress */}
        <div className="w-full space-y-6">
          {/* Progress Indicators (Bullets) */}
          <div className="flex justify-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentStep === idx 
                    ? 'w-6 bg-blue-500' 
                    : 'w-2 bg-gray-700 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 w-full">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg text-xs font-mono border transition-all ${
                currentStep === 0 
                  ? 'border-transparent text-transparent pointer-events-none' 
                  : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              {currentStep === steps.length - 1 ? 'Get Started!' : 'Next →'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
