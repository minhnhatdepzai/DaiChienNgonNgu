import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from '../utils/audio';
import { Swords } from 'lucide-react';
import { AnyQuestion } from '../types/game';
import { quizStore } from '../utils/quizStore';
import { settingsStore } from '../utils/settingsStore';

type GameMode = 'pve' | 'pvp';

interface ArenaProps {
  mode: string;
  levelInfo?: string;
  levelIndex?: number;
  onBackToMenu: () => void;
  onPveWin?: () => void;
  onPveLose?: () => void;
}

const PLAYER_MAX_HP = 200;
const BASE_ATTACK = 35;
const AI_ATTACK = 20;

export const Arena: React.FC<ArenaProps> = ({ mode, levelInfo, levelIndex = 0, onBackToMenu, onPveWin, onPveLose }) => {
  const [hp1, setHp1] = useState(PLAYER_MAX_HP);
  const getAiMaxHp = () => mode === 'pve' ? 100 + (levelIndex * 50) : PLAYER_MAX_HP;
  const aiMaxHp = getAiMaxHp();
  const [hp2, setHp2] = useState(aiMaxHp);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [puzzle, setPuzzle] = useState<AnyQuestion | null>(null);
  const [isSpecial, setIsSpecial] = useState(false);
  
  const [phase, setPhase] = useState<'IDLE' | 'PUZZLE' | 'PROJECTILE' | 'IMPACT' | 'MISS'>('IDLE');
  const [projectile, setProjectile] = useState<{ from: 1|2, to: 1|2, damage: number, isCritical: boolean } | null>(null);
  const [impactPlayer, setImpactPlayer] = useState<1 | 2 | null>(null);
  const [damageText, setDamageText] = useState<{ player: 1 | 2, amount: number, isCrit: boolean } | null>(null);
  const [gameOver, setGameOver] = useState<1 | 2 | null>(null);

  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Multiple Choice states
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isChoiceRevealed, setIsChoiceRevealed] = useState(false);

  // Fill in the blank states
  const [blankAnswer, setBlankAnswer] = useState('');
  
  // Order words states
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  // Start sequence
  const timeoutCallbackRef = useRef(() => {});

  useEffect(() => {
    timeoutCallbackRef.current = () => {
      handleResult(false);
    };
  });

  // Game over check
  useEffect(() => {
    if (hp1 <= 0) setGameOver(2);
    else if (hp2 <= 0) setGameOver(1);
  }, [hp1, hp2]);

  // Turn management machine
  useEffect(() => {
    if (hp1 <= 0 || hp2 <= 0) return;
    if (phase !== 'IDLE') return;
      
    if (turn === 2 && mode === 'pve') {
      const timer = setTimeout(() => {
        executeAttack(2, 1, AI_ATTACK, false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const q = quizStore.getRandomQuestion();
      if (!q) {
        setGameOver(turn === 1 ? 2 : 1);
        return;
      }
      setIsSpecial(quizStore.isSpecialRound());
      setPuzzle(q);
      setPhase('PUZZLE');
      
      setSelectedChoice(null);
      setIsChoiceRevealed(false);
      if (q.type === 'ORDER_WORDS') {
        setAvailableWords(q.words);
        setSelectedWords([]);
      } else if (q.type === 'FILL_BLANK') {
        setBlankAnswer('');
      }

      setTimeLeft(10);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            timeoutCallbackRef.current();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  }, [turn, phase, mode, hp1, hp2]); // Re-run when it's IDLE

  // Timer cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleResult = (isCorrect: boolean, skipSound: boolean = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPuzzle(null);

    if (isCorrect) {
      if (!skipSound) audio.playCorrect();
      const dmg = BASE_ATTACK * (isSpecial ? 2 : 1);
      executeAttack(turn, turn === 1 ? 2 : 1, dmg, isSpecial);
    } else {
      if (!skipSound) audio.playWrong();
      setPhase('MISS');
      setTimeout(() => {
        setPhase('IDLE');
        setTurn(prev => prev === 1 ? 2 : 1);
      }, 1500);
    }
  };

  // Check answers
  const submitMCQ = (choice: string) => {
    if (puzzle?.type !== 'MULTIPLE_CHOICE' || selectedChoice !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedChoice(choice);
    audio.playClick();
    
    setTimeout(() => {
      setIsChoiceRevealed(true);
      const isCorrect = choice === puzzle.correctAnswer;
      if (isCorrect) {
        audio.playCorrect();
      } else {
        audio.playWrong();
      }
      
      setTimeout(() => {
        handleResult(isCorrect, true);
        setSelectedChoice(null);
        setIsChoiceRevealed(false);
      }, 1000);
    }, 600);
  };

  const submitBlank = () => {
    if (puzzle?.type !== 'FILL_BLANK') return;
    handleResult(blankAnswer.trim().toLowerCase() === puzzle.correctAnswer.toLowerCase());
  };

  const toggleWord = (word: string, fromAvailable: boolean) => {
    if (fromAvailable) {
      setAvailableWords(prev => {
        const idx = prev.findIndex(w => w === word);
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      });
      setSelectedWords(prev => [...prev, word]);
    } else {
      setSelectedWords(prev => {
        const idx = prev.findIndex(w => w === word);
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      });
      setAvailableWords(prev => [...prev, word]);
    }
  };

  const submitOrder = () => {
    if (puzzle?.type !== 'ORDER_WORDS') return;
    const isCorrect = selectedWords.join(' ') === puzzle.correctOrder.join(' ');
    handleResult(isCorrect);
  };

  const executeAttack = (attacker: 1 | 2, target: 1 | 2, baseDamage: number, critical: boolean) => {
    setPhase('PROJECTILE');
    const vary = Math.floor(Math.random() * 10) - 5;
    const actualDamage = Math.max(1, baseDamage + vary);
    
    setProjectile({ from: attacker, to: target, damage: actualDamage, isCritical: critical });
    audio.playAttack();

    // Projectile flight time
    setTimeout(() => {
      setPhase('IMPACT');
      setImpactPlayer(target);
      setProjectile(null);
      setDamageText({ player: target, amount: actualDamage, isCrit: critical });
      audio.playHit();
      
      if (target === 1) {
        setHp1(h => Math.max(0, h - actualDamage));
      } else {
        setHp2(h => Math.max(0, h - actualDamage));
      }

      // Visual impact linger
      setTimeout(() => {
        setPhase('IDLE');
        setImpactPlayer(null);
        setDamageText(null);
        
        setTurn(prevTurn => prevTurn === 1 ? 2 : 1);
      }, 1000);
      
    }, 600);
  };

  const renderHealth = (current: number, max: number, reverse: boolean = false) => {
    const pct = Math.max(0, (current / max) * 100);
    const bgGradient = reverse 
      ? 'bg-gradient-to-l from-red-600 to-orange-400' 
      : 'bg-gradient-to-r from-blue-600 to-cyan-400';
    return (
      <div className={`w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700 ${reverse ? 'flex justify-end' : ''}`}>
        <motion.div 
          className={`h-full ${bgGradient} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        />
      </div>
    );
  };

  return (
    <div className="relative w-full flex-1 flex flex-col font-sans" style={{ perspective: '1000px' }}>
      {/* Background Detail Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Header HUD */}
      <div className="flex justify-between items-start p-6 sm:p-8 w-full z-20">
        <div className="flex flex-col w-[40%]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-lg bg-blue-900 border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center font-bold text-xl">P1</div>
            <div className="">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-400 font-bold mb-1">Chiến Binh Trí Tuệ</div>
              <div className="text-sm sm:text-xl font-bold truncate">PLAYER 1</div>
            </div>
          </div>
          {renderHealth(hp1, PLAYER_MAX_HP, false)}
          <div className="mt-2 text-xs text-blue-300 font-mono">{hp1} HP</div>
        </div>

        <div className="flex flex-col items-center mt-2 mx-4">
          <div className="text-2xl sm:text-4xl font-black tracking-tighter text-gray-500 opacity-50 mb-[-10px]">VS</div>
          {levelInfo && (
            <div className="mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-widest text-center">
              {levelInfo}
            </div>
          )}
        </div>

        <div className="flex flex-col w-[40%] items-end">
          <div className="flex items-center gap-4 mb-2 flex-row-reverse">
            <div className="w-12 h-12 rounded-lg bg-red-900 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center font-bold text-xl">
              {mode === 'pve' ? 'AI' : 'P2'}
            </div>
            <div className="text-right">
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
                {mode === 'pve' ? 'Mã Độc' : 'Kẻ Thách Thức'}
              </div>
              <div className="text-sm sm:text-xl font-bold truncate">
                {mode === 'pve' ? 'MALWARE_CPU' : 'PLAYER 2'}
              </div>
            </div>
          </div>
          {renderHealth(hp2, aiMaxHp, true)}
          <div className="mt-2 text-xs text-red-300 font-mono">{hp2} HP</div>
        </div>
      </div>

      {/* Arena Space */}
      <div className="flex-1 flex justify-around items-center px-4 sm:px-20 relative pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,30,40,1)_0%,rgba(10,10,11,1)_70%)] opacity-80" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-20 bg-blue-500/10 blur-[60px]" />

        {/* Projectile Animation */}
        <AnimatePresence>
          {projectile && (
            <motion.div
              initial={{ 
                left: projectile.from === 1 ? '25%' : '75%', 
                x: '-50%',
                y: '-50%', 
                scale: 0.2, 
                opacity: 0,
                rotate: projectile.from === 1 ? 0 : 180
              }}
              animate={{ 
                left: projectile.to === 1 ? '25%' : '75%', 
                scale: projectile.isCritical ? 1.5 : 1, 
                opacity: [0, 1, 1, 0.5]
              }}
              exit={{ opacity: 0, scale: 3 }}
              transition={{ duration: 0.6, ease: "circIn" }}
              className="absolute top-1/2 z-50 pointer-events-none flex items-center"
            >
              <div className="relative flex items-center">
                {/* Motion Trail */}
                <div className={`absolute right-1/2 w-32 sm:w-64 h-4 sm:h-8 blur-[4px] rounded-full bg-gradient-to-r ${projectile.from === 1 ? 'from-transparent to-blue-400/80' : 'from-transparent to-red-400/80'} opacity-80`} />
                
                {/* Energy Core */}
                <div className={`relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full blur-[1px] flex items-center justify-center font-black text-2xl sm:text-4xl ${projectile.from === 1 ? 'bg-blue-300 text-blue-900 shadow-[0_0_40px_rgba(59,130,246,1)]' : 'bg-red-300 text-red-900 shadow-[0_0_40px_rgba(239,68,68,1)]'} ${projectile.isCritical ? 'bg-yellow-300 shadow-[0_0_60px_rgba(250,204,21,1)] w-20 h-20 sm:w-24 sm:h-24 blur-[2px]' : ''}`}>
                  <div className="animate-spin">{projectile.isCritical ? '⚡' : '🔥'}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player 1 3D Character */}
        <motion.div
          animate={{
            x: projectile?.from === 1 ? [0, 50, 0] : 0,
            rotateY: 15,
            rotateX: 10,
            scale: impactPlayer === 1 ? [1, 0.9, 1.1, 1] : 1,
            filter: impactPlayer === 1 ? ['brightness(1)','brightness(2) drop-shadow(0 0 2rem red)','hue-rotate(90deg)','brightness(1)'] : 'drop-shadow(10px 20px 20px rgba(0,0,0,0.8))'
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative flex flex-col items-center z-10 w-32 sm:w-48"
        >
          <div className="w-full h-56 sm:h-80 bg-gradient-to-t from-blue-900/90 to-blue-600/40 border-l border-t border-blue-400/50 flex flex-col items-center justify-end rounded-t-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5)] overflow-hidden">
             <div className="mb-4 sm:mb-10 w-[80%] aspect-square flex items-center justify-center opacity-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] filter">
               {hp1 <= 0 ? (
                 <span className="text-5xl sm:text-7xl">☠️</span>
               ) : settingsStore.getAvatar(1) ? (
                 <img src={settingsStore.getAvatar(1)!} alt="P1 Avatar" className="w-full h-full object-contain" />
               ) : (
                 <span className="text-5xl sm:text-7xl">🧑‍🚀</span>
               )}
             </div>
             <div className="w-[120%] h-4 bg-blue-500/30 blur-[10px] mt-2 rounded-full absolute bottom-4"></div>
          </div>
          
          <AnimatePresence>
            {damageText?.player === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: damageText.isCrit ? 1.5 : 1 }}
                exit={{ opacity: 0 }}
                className={`absolute -top-10 left-1/2 -translate-x-1/2 font-black drop-shadow-lg z-50 pointer-events-none ${damageText.isCrit ? 'text-yellow-400 text-5xl' : 'text-red-500 text-3xl sm:text-4xl'}`}
              >
                -{damageText.amount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden sm:block">
            <div className="text-6xl font-black italic text-white/5 select-none tracking-tighter">VERSUS</div>
        </div>

        {/* Player 2 3D Character */}
        <motion.div
           animate={{
            x: projectile?.from === 2 ? [0, -50, 0] : 0,
            rotateY: -15,
            rotateX: 10,
            scale: impactPlayer === 2 ? [1, 0.9, 1.1, 1] : 1,
            filter: impactPlayer === 2 ? ['brightness(1)','brightness(2) drop-shadow(0 0 2rem red)','hue-rotate(-90deg)','brightness(1)'] : 'drop-shadow(-10px 20px 20px rgba(0,0,0,0.8))'
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative flex flex-col items-center z-10 w-32 sm:w-48"
        >
          <div className="w-full h-56 sm:h-80 bg-gradient-to-t from-red-900/90 to-red-600/40 border-r border-t border-red-400/50 flex flex-col items-center justify-end rounded-t-full shadow-[inset_10px_-10px_20px_rgba(0,0,0,0.5)] overflow-hidden">
             <div className="mb-4 sm:mb-10 w-[80%] aspect-square flex items-center justify-center opacity-90 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] filter">
               {hp2 <= 0 ? (
                 <span className="text-5xl sm:text-7xl">☠️</span>
               ) : settingsStore.getAvatar(2) ? (
                 <img src={settingsStore.getAvatar(2)!} alt="P2 Avatar" className="w-full h-full object-contain" />
               ) : (
                 <span className="text-5xl sm:text-7xl">{mode === 'pve' ? '👾' : '🥷'}</span>
               )}
             </div>
             <div className="w-[120%] h-4 bg-red-500/30 blur-[10px] mt-2 rounded-full absolute bottom-4"></div>
          </div>
          
          <AnimatePresence>
            {damageText?.player === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: damageText.isCrit ? 1.5 : 1 }}
                exit={{ opacity: 0 }}
                className={`absolute -top-10 left-1/2 -translate-x-1/2 font-black drop-shadow-lg z-50 pointer-events-none ${damageText.isCrit ? 'text-yellow-400 text-5xl' : 'text-red-500 text-3xl sm:text-4xl'}`}
              >
                -{damageText.amount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Action Interface */}
      <AnimatePresence>
        {phase === 'MISS' && !gameOver && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="bg-red-900/90 text-red-100 font-bold border-2 border-red-500 px-8 py-4 rounded-2xl text-2xl uppercase tracking-widest shadow-[0_0_50px_rgba(239,68,68,0.5)]">
              ❌ Bỏ Qua Lượt!
            </div>
          </motion.div>
        )}

        {phase === 'PUZZLE' && puzzle && !gameOver && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '20%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-[#111114] border-t border-white/10 p-4 sm:p-6 flex flex-col z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.8)]"
          >
            {/* Context Header */}
            <div className="flex justify-between items-center mb-4">
              <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${isSpecial ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 animate-pulse' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                {isSpecial ? '⚠️ CÂU HỎI ĐẶC BIỆT (X2 SÁT THƯƠNG)' : `LƯỢT P${turn}`}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">THỜI GIAN:</span>
                <span className={`text-xl font-black font-mono ${timeLeft <= 3 ? 'text-red-500 animate-bounce' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 w-full max-w-3xl mx-auto">
              <h3 className="text-lg sm:text-2xl font-bold mb-6 text-center">{puzzle.question}</h3>
              
              {/* Question Types Handlers */}
              {puzzle.type === 'MULTIPLE_CHOICE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {puzzle.options.map((opt, i) => {
                    const isSelected = selectedChoice === opt;
                    const isCorrectInfo = opt === puzzle.correctAnswer;
                    
                    let btnClass = "py-3 px-4 rounded-xl border transition-all text-left font-medium text-sm sm:text-base group ";
                    if (selectedChoice) {
                      if (isChoiceRevealed) {
                        if (isSelected) {
                          btnClass += isCorrectInfo ? "bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)] " : "bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] ";
                        } else {
                          btnClass += isCorrectInfo ? "bg-green-600/30 border-green-500/30 text-white opacity-70 " : "bg-white/5 border-white/5 opacity-50 cursor-not-allowed ";
                        }
                      } else {
                        if (isSelected) {
                          btnClass += "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-[1.02] ";
                        } else {
                          btnClass += "bg-white/5 border-white/5 opacity-50 cursor-not-allowed ";
                        }
                      }
                    } else {
                      btnClass += "bg-white/5 border-white/10 hover:bg-blue-600 hover:border-blue-400 cursor-pointer active:scale-95 ";
                    }

                    return (
                      <motion.button
                        key={i}
                        disabled={selectedChoice !== null}
                        onClick={() => submitMCQ(opt)}
                        animate={isSelected && isChoiceRevealed ? (isCorrectInfo ? { scale: [1, 1.05, 1], transition: { duration: 0.3 } } : { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } }) : { x: 0, scale: isSelected && !isChoiceRevealed ? 1.02 : 1 }}
                        className={btnClass}
                      >
                        <span className={`font-bold mr-2 ${selectedChoice ? '' : 'text-blue-500 opacity-50 group-hover:text-white group-hover:opacity-100'}`}>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {puzzle.type === 'FILL_BLANK' && (
                <div className="w-full flex gap-2">
                  <input 
                    type="text" 
                    autoFocus
                    value={blankAnswer}
                    onChange={e => setBlankAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && submitBlank()}
                    placeholder="Nhập câu trả lời..."
                    className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={submitBlank} className="bg-blue-600 hover:bg-blue-500 font-bold px-6 py-3 rounded-xl uppercase tracking-widest text-sm">
                    Gửi
                  </button>
                </div>
              )}

              {puzzle.type === 'ORDER_WORDS' && (
                <div className="w-full flex flex-col gap-4">
                  {/* Drop zone */}
                  <div className="min-h-[60px] p-2 bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex flex-wrap gap-2 items-center">
                    {selectedWords.length === 0 && <span className="text-gray-500 text-sm ml-2">Click các từ bên dưới...</span>}
                    {selectedWords.map((w, i) => (
                      <button key={`sel_${i}`} onClick={() => toggleWord(w, false)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium shadow-md active:scale-95">
                        {w}
                      </button>
                    ))}
                  </div>
                  {/* Available words */}
                  <div className="flex flex-wrap gap-2">
                    {availableWords.map((w, i) => (
                      <button key={`avail_${i}`} onClick={() => toggleWord(w, true)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg font-medium transition-colors active:scale-95">
                        {w}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={submitOrder} 
                    disabled={availableWords.length > 0} 
                    className="mt-2 w-full py-3 bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 font-bold max-w-sm mx-auto rounded-xl uppercase tracking-widest text-sm transition-all"
                  >
                    Xác nhận câu
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Processing Mode Warning */}
      {!puzzle && !gameOver && mode === 'pve' && turn === 2 && phase === 'IDLE' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-red-500/10 text-red-400 font-bold border border-red-500/20 px-6 py-2 rounded-full uppercase tracking-widest animate-pulse backdrop-blur-sm text-sm">
            AI ĐANG TẤN CÔNG...
          </div>
        </motion.div>
      )}

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="bg-[#111114] border border-white/10 p-10 rounded-2xl flex flex-col items-center gap-6 shadow-2xl text-center max-w-md w-full mx-4 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] ${gameOver === 1 ? 'bg-blue-500/30' : 'bg-red-500/30'}`}></div>
              <Swords size={60} className={gameOver === 1 ? "text-blue-500" : "text-red-500"} />
              <div>
                <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-widest">Victory</h2>
                <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mt-2">
                  {gameOver === 1 
                    ? 'PLAYER 1 WINS' 
                    : (mode === 'pve' ? 'MALWARE INCURSION SUCCESS' : 'PLAYER 2 WINS')}
                </p>
              </div>
              <button
                onClick={() => {
                  if (mode === 'pve') {
                    if (gameOver === 1 && onPveWin) onPveWin();
                    else if (gameOver === 2 && onPveLose) onPveLose();
                    else onBackToMenu();
                  } else {
                    onBackToMenu();
                  }
                }}
                className="mt-6 px-8 py-4 w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all active:scale-95"
              >
                {mode === 'pve' ? (gameOver === 1 ? 'Tiếp Tục' : 'Chơi Lại') : 'Trở Về'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

