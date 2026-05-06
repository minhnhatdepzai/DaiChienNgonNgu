import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { FileUp, FileText, Wand2, X, AlertTriangle, ArrowRight, ListFilter, Eye, EyeOff, Save, Image as ImageIcon, Settings } from 'lucide-react';
import { AnyQuestion, QuizDeck } from '../types/game';
import { generateQuizFromText } from '../utils/gemini';
import { quizStore } from '../utils/quizStore';
import { settingsStore } from '../utils/settingsStore';

interface DeckManagerProps {
  onBack: () => void;
}

export const DeckManager: React.FC<DeckManagerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'DECK' | 'AVATARS'>('DECK');
  const [docText, setDocText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedQuestions, setLoadedQuestions] = useState<AnyQuestion[]>([]);
  const [sortOrder, setSortOrder] = useState<'default' | 'type' | 'alphabetical'>('default');
  const [showQuestions, setShowQuestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatars
  const [avatarP1, setAvatarP1] = useState('');
  const [avatarP2, setAvatarP2] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setAvatarP1(settingsStore.getAvatar(1) || '');
    setAvatarP2(settingsStore.getAvatar(2) || '');
  }, []);

  const saveAvatars = () => {
    settingsStore.setAvatar(1, avatarP1.trim() || null);
    settingsStore.setAvatar(2, avatarP2.trim() || null);
    setSaveMessage('Lưu Hình Đại Diện Thành Công!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleImageUpload = (player: 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (player === 1) setAvatarP1(result);
      else setAvatarP2(result);
    };
    reader.readAsDataURL(file);
  };

  const sortedQuestions = useMemo(() => {
    if (sortOrder === 'default') return loadedQuestions;
    const sorted = [...loadedQuestions];
    if (sortOrder === 'type') {
      sorted.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortOrder === 'alphabetical') {
      sorted.sort((a, b) => a.question.localeCompare(b.question));
    }
    return sorted;
  }, [loadedQuestions, sortOrder]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const extension = file.name.split('.').pop()?.toLowerCase();

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        if (extension === 'json') {
          const parsed = JSON.parse(content);
          // Basic validation could be added here
          if (Array.isArray(parsed)) {
            setLoadedQuestions(parsed);
          } else {
            throw new Error("JSON phải là một mảng object câu hỏi.");
          }
        } else if (extension === 'csv') {
          Papa.parse(content, {
            header: true,
            complete: (results) => {
              const qs: AnyQuestion[] = results.data.map((row: any, i) => {
                const type = row.type || 'MULTIPLE_CHOICE';
                const id = `csv_${i}`;
                if (type === 'MULTIPLE_CHOICE') {
                  const options = [row.opt1, row.opt2, row.opt3, row.opt4].filter(Boolean);
                  return { id, type, question: row.question, options, correctAnswer: row.correctAnswer };
                } else if (type === 'ORDER_WORDS') {
                  const words = row.words ? row.words.split(',') : [];
                  const correctOrder = row.correctOrder ? row.correctOrder.split(',') : [];
                  return { id, type, question: row.question, words, correctOrder };
                } else {
                  return { id, type: 'FILL_BLANK', question: row.question, correctAnswer: row.correctAnswer };
                }
              }).filter((q: any) => q.question) as AnyQuestion[];
              setLoadedQuestions(qs);
            }
          });
        } else {
          throw new Error("Vui lòng tải lên file .json hoặc .csv");
        }
      } catch (err: any) {
        setError(err.message || "Đã có lỗi khi đọc file.");
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!docText.trim()) {
      setError("Vui lòng nhập tài liệu vào ô chữ.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const qs = await generateQuizFromText(docText);
      setLoadedQuestions(qs);
      setDocText(''); // Clear to show success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDeckAndBack = () => {
    if (sortedQuestions.length > 0) {
      quizStore.setDeck({ name: "Custom Deck", questions: sortedQuestions });
    }
    onBack();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10 p-6 sm:p-12 min-h-screen justify-center">
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 z-20">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <X size={24} /> Trở về
        </button>
        <div className="flex bg-[#111114] rounded-lg p-1 border border-white/10">
          <button 
            onClick={() => setActiveTab('DECK')}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'DECK' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Câu Hỏi
          </button>
          <button 
            onClick={() => setActiveTab('AVATARS')}
            className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'AVATARS' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            Nhân Vật
          </button>
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-widest text-center mt-28 sm:mt-0 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] w-full px-4">
        {activeTab === 'DECK' ? 'Chuẩn Bị Cuộc Chiến' : 'Tùy Chỉnh Nhân Vật'}
      </h2>
      
      {/* Container */}
      {activeTab === 'DECK' && (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-0">
        
        {/* Left: AI Generator */}
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="flex items-center gap-3 mb-4 text-blue-400 font-bold uppercase tracking-widest text-sm">
            <Wand2 size={20} /> Tạo Câu Hỏi Bằng AI
          </div>
          <p className="text-gray-400 text-xs mb-4">Paste tài liệu của bạn vào đây, AI sẽ phân tích và tạo quiz.</p>
          
          <textarea
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 resize-none focus:outline-none focus:border-blue-500/50 min-h-[150px] mb-4"
            placeholder="Ví dụ: Lịch sử Chiến tranh thế giới thứ 2 bắt đầu từ..."
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            disabled={isGenerating}
          ></textarea>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !docText.trim()}
            className="w-full py-4 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 font-bold rounded-xl uppercase tracking-widest text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? <span className="animate-pulse">Đang phân tích...</span> : "Tạo Bộ Câu Hỏi"}
          </button>
        </div>

        {/* Right: Manual Upload & Start */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col flex-1 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700"></div>
            <div className="flex items-center gap-3 mb-4 text-gray-400 font-bold uppercase tracking-widest text-sm">
              <FileUp size={20} /> Tải File Lên (.csv / .json)
            </div>
            
            <div 
              className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:border-gray-500 hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText size={40} className="text-gray-600 mb-4" />
              <div className="text-sm text-gray-400">Click để tải file chứa bộ câu hỏi</div>
              <input type="file" ref={fileInputRef} className="hidden" accept=".json,.csv" onChange={handleFileUpload} />
            </div>
          </div>

          {/* Status Panel */}
          <AnimatePresence mode="popLayout">
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-900/30 border border-red-500/30 text-red-400 rounded-xl flex items-start gap-3 text-sm">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
            
            {loadedQuestions.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-3">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl text-green-400 text-center font-bold">
                  Đã tải thành công {loadedQuestions.length} câu hỏi!
                </div>
                <div className="flex items-center gap-3 text-sm p-4 bg-white/5 border border-white/10 rounded-xl">
                  <ListFilter size={18} className="text-gray-400 shrink-0" />
                  <span className="text-gray-400 font-medium shrink-0">Sắp xếp theo:</span>
                  <select 
                    className="bg-[#1a1a1f] border border-white/10 text-gray-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-500 flex-1 hover:border-white/20 transition-colors"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                  >
                    <option value="default">Thứ tự gốc</option>
                    <option value="type">Phân loại (Trắc nghiệm, Điền từ...)</option>
                    <option value="alphabetical">Bảng chữ cái (A-Z)</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            {loadedQuestions.length > 0 && (
              <button
                onClick={() => setShowQuestions(!showQuestions)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {showQuestions ? <><EyeOff size={18} /> Ẩn Danh Sách</> : <><Eye size={18} /> Hiển Thị Toàn Bộ Câu Hỏi</>}
              </button>
            )}
            
            <button
              onClick={saveDeckAndBack}
              className="w-full py-4 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={18} /> {loadedQuestions.length > 0 ? "Lưu Bộ Câu Hỏi & Trở Về" : "Trở Về"}
            </button>
          </div>
        </div>
        
      </div>
      )}

      {activeTab === 'AVATARS' && (
        <div className="w-full flex justify-center gap-8 items-stretch pt-4 flex-col md:flex-row px-4 sm:px-0">
          {/* Default Image Option component logic goes inside */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col flex-1 relative gap-4">
            <h3 className="text-xl font-bold text-blue-400">Player 1 (Trí Tuệ)</h3>
            <p className="text-gray-400 text-xs">Nhập URL hình ảnh hoặc tải lên từ máy tính.</p>
            <div className="flex-1 flex flex-col gap-4">
              <input 
                type="text" 
                value={avatarP1}
                onChange={(e) => setAvatarP1(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(1, e)} 
                  className="hidden" 
                  id="p1-upload" 
                />
                <label 
                  htmlFor="p1-upload" 
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-lg text-xs uppercase tracking-widest text-white cursor-pointer transition-colors w-full text-center font-bold flex items-center justify-center gap-2"
                >
                  <ImageIcon size={14} /> Tải Ảnh Lên
                </label>
              </div>
              <div className="flex-1 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center p-4 min-h-[150px]">
                {avatarP1 ? (
                  <img src={avatarP1} className="max-w-[120px] max-h-[120px] object-contain drop-shadow-2xl" alt="P1 Preview" onError={(e) => { e.currentTarget.style.display='none' }} onLoad={(e) => { e.currentTarget.style.display='block' }} />
                ) : (
                  <span className="text-5xl">🧑‍🚀</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col flex-1 relative gap-4">
            <h3 className="text-xl font-bold text-red-400">Player 2 / AI (Mã Độc)</h3>
            <p className="text-gray-400 text-xs">Nhập URL hình ảnh hoặc tải lên từ máy tính.</p>
            <div className="flex-1 flex flex-col gap-4">
              <input 
                type="text" 
                value={avatarP2}
                onChange={(e) => setAvatarP2(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-red-500"
              />
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(2, e)} 
                  className="hidden" 
                  id="p2-upload" 
                />
                <label 
                  htmlFor="p2-upload" 
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-lg text-xs uppercase tracking-widest text-white cursor-pointer transition-colors w-full text-center font-bold flex items-center justify-center gap-2"
                >
                  <ImageIcon size={14} /> Tải Ảnh Lên
                </label>
              </div>
              <div className="flex-1 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center p-4 min-h-[150px]">
                {avatarP2 ? (
                  <img src={avatarP2} className="max-w-[120px] max-h-[120px] object-contain drop-shadow-2xl" alt="P2 Preview" onError={(e) => { e.currentTarget.style.display='none' }} onLoad={(e) => { e.currentTarget.style.display='block' }} />
                ) : (
                  <span className="text-5xl text-gray-500">👾 / 🥷</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'AVATARS' && (
        <div className="flex flex-col items-center mt-6">
          <button
            onClick={saveAvatars}
            className="py-4 px-12 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-white font-bold rounded-xl text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={20} /> Lưu Hình Đại Diện
          </button>
          
          <AnimatePresence>
            {saveMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-green-400 font-bold"
              >
                {saveMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Questions Modal / List */}
      <AnimatePresence>
        {showQuestions && sortedQuestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-h-[60vh] overflow-y-auto bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 mt-4 font-sans no-scrollbar"
          >
            <h3 className="text-xl font-bold text-white mb-6 sticky top-0 bg-[#1a1a1f] pb-2 z-10 border-b border-white/10">Danh Sách Câu Hỏi ({sortedQuestions.length})</h3>
            <div className="flex flex-col gap-4">
              {sortedQuestions.map((q, idx) => (
                <div key={q.id || idx} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">
                      {q.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : q.type === 'FILL_BLANK' ? 'Điền từ' : 'Sắp xếp'}
                    </span>
                    <span className="text-gray-500 text-xs">#{idx + 1}</span>
                  </div>
                  <p className="text-gray-200 font-medium mb-3">{q.question}</p>
                  
                  {q.type === 'MULTIPLE_CHOICE' && (
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`px-3 py-1.5 rounded-lg bg-white/5 ${opt === q.correctAnswer ? 'border border-green-500/50 text-green-400' : ''}`}>
                          {opt} {opt === q.correctAnswer && '(Đúng)'}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'FILL_BLANK' && (
                    <p className="text-sm text-gray-400">Đáp án: <span className="text-green-400 font-bold">{q.correctAnswer}</span></p>
                  )}
                  {q.type === 'ORDER_WORDS' && (
                    <div className="text-sm text-gray-400 flex flex-wrap gap-2">
                       {q.correctOrder.map((w, i) => <span key={i} className="px-2 py-1 bg-white/10 rounded text-gray-300">{w}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
