import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      if (!currentSnake.some(segment => segment.x === newFood?.x && segment.y === newFood?.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: 0 });
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          if (isPaused) setIsPaused(false);
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          if (isPaused) setIsPaused(false);
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          if (isPaused) setIsPaused(false);
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          if (isPaused) setIsPaused(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      if (direction.x === 0 && direction.y === 0) return;

      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= CANVAS_SIZE / GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= CANVAS_SIZE / GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines subtly
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw snake with neon effect
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = isHead ? 15 : 10;
      ctx.shadowColor = isHead ? '#00ffff' : '#ff00ff';
      ctx.fillRect(
        segment.x * GRID_SIZE + 2,
        segment.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
      );
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#39ff14';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#39ff14';
    ctx.beginPath();
    const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;
    ctx.arc(centerX, centerY, GRID_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="flex flex-col h-full p-6 bg-panel-bg border border-neon-green/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] font-mono">
      <div className="flex justify-between items-end mb-4 shrink-0">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-dim uppercase tracking-wider">Score</span>
            <span className="text-2xl font-bold text-neon-green neon-glow-green">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-dim uppercase tracking-wider">High Score</span>
            <span className="text-2xl font-bold text-neon-cyan neon-glow-cyan">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
             <span className="text-[10px] text-text-dim uppercase tracking-wider">Status</span>
             <span className="text-sm text-neon-magenta uppercase tracking-widest">{isGameOver ? 'HALTED' : isPaused ? 'IDLE' : 'ACTIVE'}</span>
        </div>
      </div>

      <div className="relative flex-1 bg-black border-2 border-[#1a1a2a] rounded-lg overflow-hidden group">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />

        <AnimatePresence>
          {(isGameOver || (isPaused && score === 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              {isGameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-5xl font-black text-neon-magenta neon-glow-magenta mb-4">GAME_OVER</h2>
                  <p className="text-text-dim uppercase tracking-[0.2em]">Return Code: 0xDEADBEEF</p>
                  <button
                    onClick={resetGame}
                    className="mt-8 px-10 py-4 bg-transparent border border-neon-green text-neon-green font-bold uppercase tracking-widest hover:bg-neon-green hover:text-black transition-all"
                  >
                    Reinitialize
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-8">
                  <h2 className="text-4xl font-black text-neon-green neon-glow-green tracking-[0.2em]">NEON_PROTOCOL</h2>
                  <div className="space-y-2 text-text-dim text-xs tracking-widest uppercase opacity-70">
                    <p>[ ARROWS ] : SET VECTOR</p>
                    <p>[ SPACE ] : TOGGLE STATE</p>
                  </div>
                  <button
                    onClick={resetGame}
                    className="px-12 py-5 bg-neon-green text-black font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all"
                  >
                    Execute Start
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${!isPaused && !isGameOver ? 'bg-neon-green animate-pulse' : 'bg-white/10'}`} style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="text-[10px] text-text-dim hover:text-white uppercase tracking-widest font-bold transition-colors"
          >
            {isPaused ? '[ Resume Processing ]' : '[ Interrupt Vector ]'}
          </button>
      </div>
    </div>
  );
};
