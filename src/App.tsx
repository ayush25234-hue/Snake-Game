import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-bg-dark text-white font-sans selection:bg-neon-cyan/30">
      {/* Header */}
      <header className="h-[60px] px-10 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-[#0a0a14] to-bg-dark z-20 shrink-0">
        <div className="text-lg font-black tracking-[4px] uppercase text-neon-cyan neon-glow-cyan">
          NEON_RHYTHM v1.0
        </div>
        <div className="text-[10px] text-text-dim font-mono tracking-widest opacity-60">
          [W,A,S,D] TO NAVIGATE SNAKE / [SPACE] TO PAUSE
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex p-5 gap-5 overflow-hidden z-10">
        {/* Left Side: Music Player */}
        <section className="w-[340px] shrink-0 h-full overflow-hidden">
          <MusicPlayer />
        </section>

        {/* Right Side: Snake Game */}
        <section className="flex-1 h-full overflow-hidden">
          <SnakeGame />
        </section>
      </main>

      {/* Footer / Controls Bar (Shared visual space, functionality is handled inside components or passed down) */}
      <footer className="h-[100px] px-10 bg-[#0a0a14] flex items-center justify-between border-t border-white/5 z-20 shrink-0">
        <div id="footer-music-controls" className="flex-1">
          {/* Note: The music player controls are currently inside the MusicPlayer component. 
              The Design HTML shows them in the footer. I will move the display components 
              to match the layout while keeping logic where it belongs. 
              Ideally, we'd have a global player state, but for now I'll style 
              the components to look like they are part of this footer if needed, 
              or just follow the design's instruction to adjust layout. */}
          <div className="text-[10px] text-text-dim/60 uppercase tracking-[0.2em] font-bold">Audio Interface Sync Active</div>
        </div>
        <div className="flex flex-col items-end">
           <div className="text-[10px] text-text-dim uppercase tracking-[0.2em] font-bold mb-1">System Status</div>
           <div className="text-neon-magenta text-sm font-mono tracking-widest lowercase neon-glow-magenta">resonating...</div>
        </div>
      </footer>
    </div>
  );
}
