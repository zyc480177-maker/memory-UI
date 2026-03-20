import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

interface Chapter {
  id: string;
  title: string;
  year: number;
  status: string;
  content: string;
}

export default function Writing() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: '1', title: '呱呱坠地', year: 1952, status: '80%', content: '那时候的门槛很高，我总喜欢坐在上面看屋外的雨落到石阶上。雨水顺着瓦片流下来，像是一串串晶莹的珍珠...' },
    { id: '2', title: '书香岁月', year: 1970, status: '45%', content: '青葱校园，笔墨留香。那是知识启蒙的年代，也是梦想扎根的土壤。' },
    { id: '3', title: '事业启航', year: 1982, status: '20%', content: '步入社会，满怀憧憬。在改革发展的浪潮中，您用汗水书写着奋斗的故事。' }
  ]);

  const [selectedChapterId, setSelectedChapterId] = useState('1');
  const [isEditingList, setIsEditingList] = useState(false);

  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => a.year - b.year);
  }, [chapters]);

  const currentChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];

  const handleUpdateChapter = (id: string, updates: Partial<Chapter>) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleAddChapter = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newChapter: Chapter = {
      id: newId,
      title: '新章节',
      year: new Date().getFullYear(),
      status: '0%',
      content: ''
    };
    setChapters(prev => [...prev, newChapter]);
    setSelectedChapterId(newId);
    setIsEditingList(true);
  };

  const handleDeleteChapter = (id: string) => {
    if (chapters.length <= 1) return;
    setChapters(prev => prev.filter(c => c.id !== id));
    if (selectedChapterId === id) {
      setSelectedChapterId(chapters.find(c => c.id !== id)?.id || '');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] pt-24 pb-20 px-6 md:px-[8.5rem]">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">续写华章</h1>
          <p className="text-on-surface-variant/70 italic">笔耕不辍，记录生命中的每一个精彩瞬间</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsEditingList(!isEditingList)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${isEditingList ? 'bg-primary text-white shadow-lg' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          >
            <span className="material-symbols-outlined text-sm">{isEditingList ? 'check' : 'edit_note'}</span>
            {isEditingList ? '完成整理' : '整理目录'}
          </button>
          <Link to="/timeline" className="px-6 py-2 bg-[#8B4513] text-white rounded-full font-bold text-sm shadow-lg hover:bg-[#6C2F00] transition-all no-underline flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">visibility</span>
            预览传记
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Chapter List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">章节目录</h3>
            {isEditingList && (
              <span className="text-[10px] text-primary font-bold animate-pulse">编辑模式</span>
            )}
          </div>
          
          <div className="space-y-3">
            {sortedChapters.map(chapter => (
              <div key={chapter.id} className="relative group">
                <button
                  onClick={() => !isEditingList && setSelectedChapterId(chapter.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedChapterId === chapter.id ? 'bg-white border-[#8B4513] shadow-md' : 'bg-white/50 border-transparent hover:bg-white'} ${isEditingList ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {isEditingList ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={chapter.year}
                          onChange={(e) => handleUpdateChapter(chapter.id, { year: parseInt(e.target.value) || 0 })}
                          className="w-20 bg-stone-100 rounded px-2 py-1 text-[10px] font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <input 
                          type="text" 
                          value={chapter.title}
                          onChange={(e) => handleUpdateChapter(chapter.id, { title: e.target.value })}
                          className="flex-1 bg-stone-100 rounded px-2 py-1 text-sm font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-stone-400">{chapter.year} 年</span>
                        <span className="text-[10px] font-bold text-primary">{chapter.status}</span>
                      </div>
                      <h4 className="font-bold text-on-surface">{chapter.title}</h4>
                    </>
                  )}
                </button>
                
                {isEditingList && (
                  <button 
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleAddChapter}
            className="w-full p-4 rounded-2xl border border-dashed border-stone-300 text-stone-400 flex items-center justify-center gap-2 hover:bg-white transition-all mt-4"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-sm font-bold">新增章节</span>
          </button>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-[#8B4513]/5 p-8 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#8B4513]">history_edu</span>
                <h2 className="text-2xl font-bold text-[#8B4513]">{currentChapter.title}</h2>
                <span className="text-sm text-stone-400 font-medium">{currentChapter.year} 年</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-stone-400 hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined">save</span>
                  <span className="text-xs font-bold">保存</span>
                </button>
                <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>

            <textarea 
              className="flex-1 w-full resize-none bg-transparent text-lg leading-relaxed text-on-surface focus:outline-none placeholder:text-stone-300"
              placeholder="在这里续写您的故事..."
              value={currentChapter.content}
              onChange={(e) => handleUpdateChapter(currentChapter.id, { content: e.target.value })}
            ></textarea>

            <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center">
              <div className="flex gap-6">
                <button className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-primary transition-colors group">
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">photo_library</span>
                  插入照片
                </button>
                <button className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-primary transition-colors group">
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">videocam</span>
                  插入视频
                </button>
                <button className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-primary transition-colors group">
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">audio_file</span>
                  插入语音
                </button>
                <button className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-primary transition-colors group">
                  <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">mic</span>
                  语音转文字
                </button>
              </div>
              <span className="text-[10px] text-stone-400">最近保存：刚刚</span>
            </div>
          </div>

          {/* AI Writing Assistant */}
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary mb-1">AI 灵感助手</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                您可以尝试描述一下当时{currentChapter.title}期间的一些细节，比如当时的社会环境、您的心情变化等，这些细节会让您的回忆更加丰满。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

