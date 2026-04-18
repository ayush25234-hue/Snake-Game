import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2, Disc, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  color: string;
  cover: string;
}

const MOCK_TRACKS: Track[] = [
  {
    id: 1,
    title: "Cybernetic Pulse",
    artist: "AI Architect",
    duration: "3:45",
    color: "var(--color-neon-cyan)",
    cover: "https://picsum.photos/seed/cyber/400/400"
  },
  {
    id: 2,
    title: "Synthwave Dreams",
    artist: "Neural Network",
    duration: "4:20",
    color: "var(--color-neon-magenta)",
    cover: "https://picsum.photos/seed/synth/400/400"
  },
  {
    id: 3,
    title: "Neon Horizon",
    artist: "Quantum Echo",
    duration: "2:55",
    color: "var(--color-neon-green)",
    cover: "https://picsum.photos/seed/neon/400/400"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentTrack = MOCK_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MOCK_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="h-full flex flex-col p-6 bg-panel-bg border border-neon-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Featured Art Section */}
      <div className="relative aspect-square w-full rounded-lg bg-gradient-to-br from-[#12121a] to-bg-dark border border-neon-magenta/20 flex items-center justify-center overflow-hidden mb-5">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            src={currentTrack.cover}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute w-[60px] h-[60px] border-2 border-neon-magenta rounded-full shadow-[0_0_15px_var(--color-neon-magenta)] flex items-center justify-center">
           <Disc className={`text-neon-magenta ${isPlaying ? 'animate-spin-slow' : ''}`} size={32} />
        </div>
      </div>

      {/* Track Info */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight leading-tight uppercase">{currentTrack.title}</h2>
        <p className="text-text-dim text-sm uppercase tracking-widest mt-1">{currentTrack.artist}</p>
      </div>

      {/* Sub-Playlist Section */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {MOCK_TRACKS.map((track, idx) => (
          <div 
            key={track.id}
            onClick={() => { setCurrentTrackIndex(idx); setProgress(0); }}
            className={`p-3 rounded-md flex items-center gap-3 cursor-pointer transition-all border-l-3 ${
              idx === currentTrackIndex 
              ? 'bg-neon-cyan/10 border-neon-cyan' 
              : 'bg-white/5 border-transparent hover:bg-white/10'
            }`}
          >
            <div className="w-10 h-10 bg-black/40 rounded shrink-0 overflow-hidden">
                <img src={track.cover} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-white truncate uppercase">{track.title}</p>
               <p className="text-[10px] text-text-dim truncate">{track.artist}</p>
            </div>
            <span className="text-[10px] text-text-dim font-mono">{track.duration}</span>
          </div>
        ))}
      </div>

      {/* Controls - Move this to be "footer-like" within panel or handled in App.tsx */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between gap-4 mb-4">
             <button onClick={handlePrev} className="p-2 text-text-dim hover:text-neon-cyan transition-colors"><SkipBack size={20} /></button>
             <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full border border-neon-cyan text-neon-cyan flex items-center justify-center hover:bg-neon-cyan/10 transition-all"
             >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
             </button>
             <button onClick={handleNext} className="p-2 text-text-dim hover:text-neon-cyan transition-colors"><SkipForward size={20} /></button>
        </div>
        <div className="space-y-2">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-neon-cyan shadow-[0_0_8px_var(--color-neon-cyan)] transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-text-dim font-mono">
                <span>00:{(Math.floor(progress / 100 * 45)).toString().padStart(2, '0')}</span>
                <span>{currentTrack.duration}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
