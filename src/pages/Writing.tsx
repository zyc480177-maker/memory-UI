import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { eventsApi, chaptersApi } from '../api';
import { Event, Chapter } from '../types/domain';
import { useAiStatus } from '../hooks/useAiStatus';

export default function Writing() {
  const { currentProject } = useProject();
  const aiConfigured = useAiStatus();
  const [events, setEvents] = useState<Event[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [editContent, setEditContent] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentProject) { setLoading(false); return; }
    Promise.all([
      eventsApi.list(currentProject.id),
      chaptersApi.list(currentProject.id),
    ]).then(([evts, chps]) => {
      setEvents(evts);
      setChapters(chps);
      if (chps.length > 0 && !selectedChapter) {
        const ch = chps[0];
        setSelectedChapter(ch);
        setEditContent(ch.editedContent ?? ch.draftContent ?? '');
      }
    }).finally(() => setLoading(false));
  }, [currentProject?.id]);

  function selectChapter(ch: Chapter) {
    setSelectedChapter(ch);
    setEditContent(ch.editedContent ?? ch.draftContent ?? '');
    setSaved(false);
    setError('');
  }

  async function handleCreateChapter(e: React.FormEvent) {
    e.preventDefault();
    if (!currentProject || !newChapterTitle.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const chapter = await chaptersApi.create(currentProject.id, {
        title: newChapterTitle,
        eventIds: selectedEventIds,
        generateContent: aiConfigured !== false && selectedEventIds.length > 0,
      });
      const updated = await chaptersApi.list(currentProject.id);
      setChapters(updated);
      selectChapter(chapter);
      setShowNewChapter(false);
      setNewChapterTitle('');
      setSelectedEventIds([]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!currentProject || !selectedChapter) return;
    setSaving(true);
    try {
      const updated = await chaptersApi.update(currentProject.id, selectedChapter.id, {
        editedContent: editContent,
        status: 'owner_editing',
      });
      const list = await chaptersApi.list(currentProject.id);
      setChapters(list);
      setSelectedChapter(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handleRegenerate() {
    if (!currentProject || !selectedChapter) return;
    setGenerating(true);
    setError('');
    try {
      const updated = await chaptersApi.regenerate(currentProject.id, selectedChapter.id);
      setEditContent(updated.draftContent ?? '');
      setSelectedChapter(updated);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
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

  return (
    <div className="min-h-screen bg-[#F5F0E8] pt-16">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left: Chapter list */}
        <div className="w-72 bg-surface border-r border-outline-variant/20 flex flex-col overflow-hidden shrink-0">
          <div className="p-6 border-b border-outline-variant/10">
            <h2 className="font-black text-on-surface text-lg">{currentProject.title}</h2>
            <p className="text-xs text-stone-400 mt-1">{chapters.length} 个章节</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-2xl text-primary animate-spin block">sync</span>
              </div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <span className="material-symbols-outlined text-3xl block mb-2">menu_book</span>
                <p className="text-sm">还没有章节</p>
              </div>
            ) : (
              chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => selectChapter(ch)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${selectedChapter?.id === ch.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-stone-100 border border-transparent'}`}
                >
                  <p className={`font-bold text-sm ${selectedChapter?.id === ch.id ? 'text-primary' : 'text-on-surface'}`}>{ch.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      ch.status === 'finalized' ? 'bg-green-50 text-green-600' :
                      ch.status === 'ai_draft' ? 'bg-amber-50 text-amber-600' :
                      ch.status === 'owner_editing' ? 'bg-blue-50 text-blue-600' :
                      'bg-stone-100 text-stone-400'
                    }`}>
                      {ch.status === 'outline' ? '大纲' : ch.status === 'ai_draft' ? 'AI草稿' : ch.status === 'owner_editing' ? '编辑中' : '已完成'}
                    </span>
                    <span className="text-[10px] text-stone-400">{ch.wordCount} 字</span>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="p-4 border-t border-outline-variant/10">
            <button
              onClick={() => setShowNewChapter(true)}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              新建章节
            </button>
          </div>
        </div>

        {/* Main: Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedChapter ? (
            <>
              {/* Toolbar */}
              <div className="bg-surface border-b border-outline-variant/10 px-8 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-on-surface">{selectedChapter.title}</h3>
                  <p className="text-xs text-stone-400">{editContent.length} 字</p>
                </div>
                <div className="flex items-center gap-3">
                  {error && <span className="text-xs text-red-500">{error}</span>}
                  {saved && <span className="text-xs text-green-600 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span>已保存</span>}
                  <button
                    onClick={handleRegenerate}
                    disabled={generating || aiConfigured === false}
                    title={aiConfigured === false ? '未配置 AI，无法生成。可直接在下方手动撰写内容' : undefined}
                    className="px-4 py-2 border border-primary/30 text-primary rounded-xl text-sm font-bold hover:bg-primary/5 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className={`material-symbols-outlined text-sm ${generating ? 'animate-spin' : ''}`}>auto_fix_high</span>
                    {generating ? 'AI 生成中...' : 'AI 重新生成'}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {saving ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>

              {/* Editor area */}
              <div className="flex-1 overflow-y-auto p-8">
                {generating ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-4">auto_fix_high</span>
                    <p className="text-on-surface-variant">AI 正在根据您的事件生成章节草稿...</p>
                  </div>
                ) : (
                  <textarea
                    className="w-full h-full min-h-[500px] resize-none bg-transparent text-lg leading-[1.9] text-on-surface focus:outline-none font-body"
                    value={editContent}
                    onChange={(e) => { setEditContent(e.target.value); setSaved(false); }}
                    placeholder={selectedChapter.status === 'outline' ? '点击「AI 重新生成」让 AI 基于关联的事件起草这个章节，或直接在此处输入...' : ''}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <span className="material-symbols-outlined text-6xl text-stone-200 block mb-6">edit_note</span>
                <h3 className="text-xl font-bold text-on-surface mb-3">选择或创建章节</h3>
                <p className="text-on-surface-variant/70 mb-6 max-w-sm">
                  从左侧选择已有章节，或创建新章节。创建时可以关联已提炼的事件，让 AI 生成草稿。
                </p>
                <button
                  onClick={() => setShowNewChapter(true)}
                  className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-colors"
                >
                  创建第一个章节
                </button>
              </div>
            </div>
          )}
        </div>

        {/* New chapter modal */}
        <AnimatePresence>
          {showNewChapter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
              onClick={() => setShowNewChapter(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
              >
                <h3 className="text-xl font-bold text-on-surface mb-6">新建章节</h3>
                <form onSubmit={handleCreateChapter} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">章节标题</label>
                    <input
                      type="text"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      placeholder="例如：童年岁月"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
                    />
                  </div>

                  {events.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">
                        关联事件（让 AI 基于这些事件起草内容）
                      </label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {events.map(evt => (
                          <label key={evt.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-stone-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedEventIds.includes(evt.id)}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedEventIds(prev => [...prev, evt.id]);
                                else setSelectedEventIds(prev => prev.filter(id => id !== evt.id));
                              }}
                              className="mt-0.5 accent-primary"
                            />
                            <div>
                              <p className="font-bold text-sm text-on-surface">{evt.title}</p>
                              {evt.summary && <p className="text-xs text-stone-400 mt-0.5">{evt.summary}</p>}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowNewChapter(false)} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-500 font-bold hover:bg-stone-50">取消</button>
                    <button type="submit" disabled={generating} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-60 flex items-center justify-center gap-2">
                      {generating
                        ? <><span className="material-symbols-outlined text-sm animate-spin">sync</span>生成中...</>
                        : (aiConfigured !== false && selectedEventIds.length > 0) ? 'AI 起草章节' : '创建章节'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
