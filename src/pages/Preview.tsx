import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { chaptersApi, projectsApi } from '../api';
import { Chapter } from '../types/domain';

export default function Preview() {
  const { currentProject } = useProject();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!currentProject) { setLoading(false); return; }
    chaptersApi.list(currentProject.id).then(chps => {
      const finalized = chps.filter(c => c.status !== 'outline' && (c.editedContent || c.draftContent));
      setChapters(finalized);
    }).finally(() => setLoading(false));
  }, [currentProject?.id]);

  async function handleExport() {
    if (!currentProject) return;
    setIsExporting(true);
    try {
      const response = await projectsApi.exportHtml(currentProject.id);
      if (!response.ok) throw new Error('导出失败');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.title}-传记.html`;
      a.click();
      URL.revokeObjectURL(url);
      setToastMessage('导出成功！HTML 文件已保存至您的设备。');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      setToastMessage('导出失败，请重试。');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsExporting(false);
    }
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-surface pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">请先创建或选择一个项目</p>
          <Link to="/" className="text-primary font-bold no-underline">返回首页</Link>
        </div>
      </div>
    );
  }

  const chapter = chapters[currentIdx];
  const content = chapter?.editedContent ?? chapter?.draftContent ?? '';

  return (
    <main className="pt-24 pb-20 px-6 md:px-[8.5rem] max-w-7xl mx-auto min-h-screen relative bg-[#F5F0E8]">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#5C7A4E] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col xl:flex-row gap-16 items-start">
        <div className="flex-1 w-full">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">传记预览</h1>
              <p className="text-on-surface-variant font-medium">
                《{currentProject.title}》· {loading ? '加载中...' : `${chapters.length} 个章节`}
              </p>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-32">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
            </div>
          ) : chapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-7xl text-stone-200 mb-6">auto_stories</span>
              <h3 className="text-xl font-bold text-on-surface mb-3">还没有可预览的章节</h3>
              <p className="text-on-surface-variant/70 mb-8 max-w-sm">
                前往写作页面创建章节，完成草稿后即可在这里预览。
              </p>
              <Link to="/writing" className="px-8 py-3 bg-primary text-white rounded-2xl font-bold no-underline hover:bg-primary/90 transition-colors">
                前往写作
              </Link>
            </div>
          ) : (
            <>
              <div className="relative group">
                <div className="bg-white rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex overflow-hidden relative border border-outline-variant/20 min-h-[500px]">
                  {/* Left Page: Text */}
                  <div className="flex-1 p-10 md:p-14 border-r border-outline-variant/10 relative">
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-black/5"></div>
                    <span className="text-[10px] text-stone-400 tracking-widest uppercase absolute top-8 left-10">
                      第 {currentIdx + 1} 章 · {chapter.title}
                    </span>
                    <div className="mt-12">
                      <h2 className="text-2xl font-bold text-on-surface mb-8">{chapter.title}</h2>
                      <div className="space-y-5 text-base leading-[2] text-on-surface-variant font-body">
                        {content.split('\n').filter(Boolean).slice(0, 8).map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                        {content.split('\n').filter(Boolean).length > 8 && (
                          <p className="text-stone-300 italic">……</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-stone-400 absolute bottom-8 left-1/2 -translate-x-1/2">{currentIdx * 2 + 1}</span>
                  </div>

                  {/* Right Page: Summary */}
                  <div className="flex-1 p-10 md:p-14 relative bg-[#fdfaf5]">
                    <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-black/5"></div>
                    <div className="h-full flex flex-col justify-center items-center text-center">
                      <span className="material-symbols-outlined text-7xl text-stone-200 mb-6">auto_stories</span>
                      {chapter.summary ? (
                        <p className="text-sm italic text-stone-400 leading-relaxed max-w-xs">{chapter.summary}</p>
                      ) : (
                        <p className="text-sm italic text-stone-300">第 {currentIdx + 1} 章</p>
                      )}
                      <p className="text-xs text-stone-300 mt-4">{chapter.wordCount} 字</p>
                    </div>
                    <span className="text-xs text-stone-400 absolute bottom-8 left-1/2 -translate-x-1/2">{currentIdx * 2 + 2}</span>
                  </div>
                </div>

                {/* Navigation Arrows */}
                {currentIdx > 0 && (
                  <button
                    onClick={() => setCurrentIdx(i => i - 1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                )}
                {currentIdx < chapters.length - 1 && (
                  <button
                    onClick={() => setCurrentIdx(i => i + 1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                )}
              </div>

              {/* Chapter navigation dots */}
              <div className="mt-8 flex items-center justify-center gap-3">
                {chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    onClick={() => setCurrentIdx(i)}
                    title={ch.title}
                    className={`rounded-full transition-all ${i === currentIdx ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'}`}
                  />
                ))}
              </div>

              {/* Chapter list */}
              <div className="mt-12 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">章节目录</h3>
                <div className="space-y-2">
                  {chapters.map((ch, i) => (
                    <button
                      key={ch.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${i === currentIdx ? 'bg-primary/10 text-primary' : 'hover:bg-stone-100 text-on-surface'}`}
                    >
                      <span className="text-xs w-6 text-center font-bold opacity-50">{i + 1}</span>
                      <span className="flex-1 font-bold text-sm">{ch.title}</span>
                      <span className="text-xs text-stone-400">{ch.wordCount} 字</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="w-full xl:w-80 flex flex-col gap-8 xl:sticky xl:top-24">
          <div className="bg-surface rounded-2xl p-8 border border-outline-variant/10 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-2">{currentProject.title}</h3>
            {currentProject.subtitle && (
              <p className="text-sm text-stone-400 mb-4">{currentProject.subtitle}</p>
            )}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-400">章节数</span>
                <span className="font-bold text-on-surface">{chapters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">总字数</span>
                <span className="font-bold text-on-surface">{chapters.reduce((s, c) => s + c.wordCount, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting || chapters.length === 0}
            className="w-full bg-gradient-to-r from-primary to-[#6C2F00] text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:hover:scale-100"
          >
            {isExporting ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                正在导出...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">download</span>
                导出 HTML 传记
              </>
            )}
          </button>

          <Link
            to="/writing"
            className="w-full py-4 border-2 border-primary text-primary rounded-2xl font-bold text-center no-underline hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">edit_note</span>
            继续编写章节
          </Link>
        </aside>
      </div>
    </main>
  );
}
