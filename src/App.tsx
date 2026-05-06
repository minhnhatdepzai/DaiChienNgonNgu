import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Cpu, Users, Settings, Swords, Trophy, RefreshCcw, ArrowRight } from 'lucide-react';
import { Arena } from './components/Arena';
import { DeckManager } from './screens/DeckManager';
import levelsData from './data/levels';
import { quizStore } from './utils/quizStore';

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'prepare' | 'pve' | 'pvp' | 'pve_win' | 'pve_lose' | 'pve_complete'>('menu');
  const [showPlayOptions, setShowPlayOptions] = useState(false);
  const [campaignLevel, setCampaignLevel] = useState(0);

  // Load level deck
  useEffect(() => {
    if (gameState === 'pve') {
      const level = levelsData[campaignLevel];
      if (level) {
        quizStore.setDeck({ name: level.name, questions: level.questions });
      }
    } else if (gameState === 'pvp') {
      if (!quizStore.getDeck()) {
         // Create a composite deck from all levels if none exists
         const allQuestions = levelsData.flatMap(ld => ld.questions);
         quizStore.setDeck({ name: "Bộ Câu Hỏi Tổng Hợp", questions: allQuestions });
      }
    }
  }, [gameState, campaignLevel]);

  const handlePveNextLevel = () => {
    if (campaignLevel + 1 < levelsData.length) {
      setGameState('pve_win');
    } else {
      setGameState('pve_complete');
    }
  };

  const handlePveLose = () => {
    setGameState('pve_lose');
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0B] text-slate-50 font-sans selection:bg-blue-500/30 overflow-x-hidden relative flex flex-col">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      <AnimatePresence mode="wait">
        {gameState === 'menu' ? (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 relative"
          >
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="mb-8 relative flex items-center justify-center w-32 h-32 bg-white/10 rounded-full border-4 border-blue-400"
              >
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full" />
                <span className="text-7xl relative z-10">🐨</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl md:whitespace-nowrap font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-4 text-center">
                Anh Hùng Ngôn Ngữ
              </h1>
              
              <p className="text-lg text-gray-400 mb-12 text-center max-w-md font-light">
                Giải đố thông minh để đánh bại đối thủ. Mọi sai lầm đều phải trả giá. 
              </p>

              <div className="w-full h-[180px]">
                <AnimatePresence mode="wait">
                  {!showPlayOptions ? (
                    <motion.div key="main-options" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="w-full flex gap-4 h-full">
                      <button
                        onClick={() => setShowPlayOptions(true)}
                        className="flex-1 group relative p-6 flex flex-col items-center justify-center gap-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-2xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <Swords size={40} className="text-blue-400" />
                        <span className="text-2xl font-bold uppercase tracking-widest text-white">Chơi Game</span>
                      </button>
                      
                      <button
                        onClick={() => setGameState('prepare')}
                        className="w-1/3 group relative p-6 flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/10 hover:border-gray-400 hover:bg-white/10 rounded-2xl transition-all duration-300 overflow-hidden"
                      >
                         <Settings size={40} className="text-gray-400 group-hover:text-white transition-colors" />
                         <span className="text-lg font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Admin</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="play-options" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex flex-col gap-4 h-full">
                      <div className="flex gap-4 h-full">
                        <button
                          onClick={() => {
                            setCampaignLevel(0);
                            setGameState('pve');
                          }}
                          className="flex-1 p-6 flex flex-col items-center justify-center gap-4 bg-[#1a1a24] border border-blue-500/30 hover:border-blue-400 hover:bg-[#20202d] rounded-2xl transition-all duration-300 overflow-hidden relative group"
                        >
                           <Cpu size={32} className="text-blue-400 group-hover:scale-110 transition-transform" />
                           <span className="text-lg font-bold uppercase tracking-widest text-white">Đấu Với Máy</span>
                        </button>
                        <button
                          onClick={() => setGameState('pvp')}
                          className="flex-1 p-6 flex flex-col items-center justify-center gap-4 bg-[#1a1a24] border border-purple-500/30 hover:border-purple-400 hover:bg-[#20202d] rounded-2xl transition-all duration-300 overflow-hidden relative group"
                        >
                           <Users size={32} className="text-purple-400 group-hover:scale-110 transition-transform" />
                           <span className="text-lg font-bold uppercase tracking-widest text-white">Đấu Người</span>
                        </button>
                      </div>
                      <button onClick={() => setShowPlayOptions(false)} className="mx-auto text-sm text-gray-400 hover:text-white mt-1">
                        ← Trở về
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="absolute bottom-6 text-slate-500 text-xs text-center w-full">
              Khuyên dùng âm thanh. Đọc kỹ câu hỏi trước khi trả lời.
            </div>
          </motion.div>
        ) : gameState === 'prepare' ? (
          <motion.div
            key="prepare"
             initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full flex-1 flex flex-col"
          >
             <DeckManager 
               onBack={() => setGameState('menu')}
             />
          </motion.div>
        ) : gameState === 'pve' || gameState === 'pvp' ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full flex-1 flex flex-col"
          >
            <Arena 
              mode={gameState} 
              levelInfo={gameState === 'pve' ? levelsData[campaignLevel]?.name : undefined}
              levelIndex={gameState === 'pve' ? campaignLevel : 0}
              onBackToMenu={() => setGameState('menu')}
              onPveWin={handlePveNextLevel}
              onPveLose={handlePveLose}
            />
          </motion.div>
        ) : gameState === 'pve_win' ? (
           <motion.div key="pve_win" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-6 text-center">
              <div className="max-w-md w-full bg-[#111114] border border-green-500/30 p-8 rounded-2xl flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(34,197,94,0.15)] relative overflow-hidden">
                <Trophy size={60} className="text-green-400 relative z-10" />
                <h2 className="text-3xl font-black text-white uppercase tracking-widest relative z-10">Màn Hoàn Thành!</h2>
                <p className="text-gray-400 text-sm relative z-10">Bạn đã đánh bại {levelsData[campaignLevel]?.name}. Hãy chuẩn bị cho thử thách tiếp theo!</p>
                <button
                  onClick={() => {
                    setCampaignLevel(prev => prev + 1);
                    setGameState('pve');
                  }}
                  className="mt-4 px-8 py-4 w-full bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all active:scale-95 flex justify-center items-center gap-2 relative z-10"
                >
                  Qua Màn Tới <ArrowRight size={18} />
                </button>
              </div>
           </motion.div>
        ) : gameState === 'pve_lose' ? (
           <motion.div key="pve_lose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-6 text-center">
              <div className="max-w-md w-full bg-[#111114] border border-red-500/30 p-8 rounded-2xl flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
                <BrainCircuit size={60} className="text-red-500" />
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">Thất Bại</h2>
                  <p className="text-gray-400 text-sm">Bạn đã mất tốn toàn bộ sinh lực tại {levelsData[campaignLevel]?.name}.</p>
                </div>
                <div className="flex gap-4 w-full mt-4">
                  <button
                    onClick={() => setGameState('menu')}
                    className="flex-1 px-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-widest"
                  >
                    Trở Về
                  </button>
                  <button
                    onClick={() => {
                      setCampaignLevel(0);
                      setGameState('pve');
                    }}
                    className="flex-[2] px-4 py-4 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white font-bold rounded-xl text-xs uppercase tracking-widest flex justify-center items-center gap-2"
                  >
                    <RefreshCcw size={16} /> Chơi Lại Từ Đầu
                  </button>
                </div>
              </div>
           </motion.div>
        ) : gameState === 'pve_complete' ? (
           <motion.div key="pve_complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0B] to-blue-900/20 p-6 text-center">
              <div className="max-w-md w-full border border-blue-400/50 bg-[#111114]/80 backdrop-blur-xl p-10 rounded-2xl flex flex-col items-center gap-6 shadow-[0_0_100px_rgba(59,130,246,0.3)]">
                <Trophy size={80} className="text-blue-400 animate-bounce" />
                <h2 className="text-4xl font-black text-white uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Khải Hoàn</h2>
                <p className="text-gray-300 font-medium tracking-wide">Bạn đã chinh phục mọi đẳng cấp AI!</p>
                <button
                  onClick={() => setGameState('menu')}
                  className="mt-6 px-8 py-4 w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  Trở Về Menu
                </button>
              </div>
           </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
