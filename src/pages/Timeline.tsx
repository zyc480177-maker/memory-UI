import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { eventsApi } from '../api';
import { Event } from '../types/domain';

const EMOTION_COLORS: Record<string, string> = {
  喜悦: 'bg-amber-50 text-amber-700',
  悲伤: 'bg-blue-50 text-blue-700',
  感动: 'bg-rose-50 text-rose-700',
  奋斗: 'bg-green-50 text-green-700',
  思念: 'bg-purple-50 text-purple-700',
};

const ICONS_FOR_TAGS: Record<string, string> = {
  喜悦: 'celebration',
  悲伤: 'sentiment_sad',
  感动: 'favorite',
  奋斗: 'emoji_events',
  思念: 'favorite_border',
};

function getEventIcon(event: Event): string {
  const tag = event.emotionTags?.[0] ?? '';
  return ICONS_FOR_TAGS[tag] ?? 'star';
}

export default function Timeline() {
  const { currentProject } = useProject();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Event | null>(null);

  useEffect(() => {
    if (!currentProject) { setLoading(false); return; }
    eventsApi.list(currentProject.id).then(evts => {
      const sorted = [...evts].sort((a, b) => {
        if (!a.startAt && !b.startAt) return (a.timelineOrderHint ?? 0) - (b.timelineOrderHint ?? 0);
        if (!a.startAt) return 1;
        if (!b.startAt) return -1;
        return a.startAt.localeCompare(b.startAt);
      });
      setEvents(sorted);
    }).finally(() => setLoading(false));
  }, [currentProject?.id]);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">请先创建或选择一个项目</p>
          <Link to="/" className="text-primary font-bold no-underline">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F0E8] min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-4 tracking-widest">岁月长歌</h1>
          <p className="text-stone-500 text-lg italic">{currentProject.title} · {events.length} 个事件</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/archive" className="px-6 py-2 bg-white border border-[#8B4513]/20 rounded-full text-sm font-bold text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors flex items-center gap-2 no-underline">
              <span className="material-symbols-outlined text-sm">folder_open</span>
              管理我的档案
            </Link>
            <Link to="/capture" className="px-6 py-2 bg-[#8B4513] text-white rounded-full text-sm font-bold hover:bg-[#6c2f00] transition-colors flex items-center gap-2 no-underline">
              <span className="material-symbols-outlined text-sm">add</span>
              添加素材
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-7xl text-stone-200 mb-6">history_edu</span>
            <h3 className="text-xl font-bold text-on-surface mb-3">还没有任何事件</h3>
            <p className="text-on-surface-variant/70 mb-8 max-w-sm">
              上传照片、录音或写下文字，AI 会自动分析提取人生事件，它们将在这里呈现为时间轴。
            </p>
            <Link to="/capture" className="px-8 py-3 bg-primary text-white rounded-2xl font-bold no-underline hover:bg-primary/90 transition-colors">
              上传第一份素材
            </Link>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-[#8B4513]/20"></div>

            <div className="space-y-24">
              {events.map((event, idx) => {
                const isLeft = idx % 2 === 0;
                const icon = getEventIcon(event);
                const year = event.startAt ? new Date(event.startAt).getFullYear() : null;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative flex flex-col md:flex-row items-center justify-between group"
                  >
                    {/* Left side */}
                    <div className={`w-full md:w-[42%] ${isLeft ? 'text-center md:text-right order-2 md:order-1' : 'order-3 md:order-1 flex justify-center md:justify-end'} mt-6 md:mt-0`}>
                      {isLeft ? (
                        <div>
                          {event.emotionTags?.[0] && (
                            <span className="text-sm font-medium text-[#5C7A4E] mb-2 block tracking-widest uppercase">
                              {event.emotionTags[0]}
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                            {year ? `${year} · ` : ''}{event.title}
                          </h3>
                          {event.summary && (
                            <p className="text-on-surface-variant leading-relaxed mb-4 text-sm">{event.summary}</p>
                          )}
                          {event.locationText && (
                            <span className="text-xs text-stone-400 flex items-center gap-1 justify-end">
                              <span className="material-symbols-outlined text-xs">location_on</span>
                              {event.locationText}
                            </span>
                          )}
                          <div className="mt-3 flex flex-wrap justify-end gap-1">
                            {event.emotionTags?.slice(1).map(tag => (
                              <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${EMOTION_COLORS[tag] ?? 'bg-stone-100 text-stone-500'}`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-lg flex items-center justify-center bg-stone-100 border-4 border-white shadow-md rotate-2 group-hover:rotate-0 transition-transform duration-500">
                          <span className="material-symbols-outlined text-5xl text-stone-300">{icon}</span>
                        </div>
                      )}
                    </div>

                    {/* Center node */}
                    <div
                      className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#8B4513] text-white border-4 border-[#F5F0E8] order-1 md:order-2 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => setSelected(event)}
                    >
                      <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>

                    {/* Right side */}
                    <div className={`w-full md:w-[42%] ${isLeft ? 'order-3 flex justify-center md:justify-start' : 'text-center md:text-left order-2 md:order-3'} mt-6 md:mt-0`}>
                      {!isLeft ? (
                        <div>
                          {event.emotionTags?.[0] && (
                            <span className="text-sm font-medium text-[#5C7A4E] mb-2 block tracking-widest uppercase">
                              {event.emotionTags[0]}
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-[#8B4513] mb-2">
                            {year ? `${year} · ` : ''}{event.title}
                          </h3>
                          {event.summary && (
                            <p className="text-on-surface-variant leading-relaxed mb-4 text-sm">{event.summary}</p>
                          )}
                          {event.locationText && (
                            <span className="text-xs text-stone-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">location_on</span>
                              {event.locationText}
                            </span>
                          )}
                          <div className="mt-3 flex flex-wrap justify-start gap-1">
                            {event.emotionTags?.slice(1).map(tag => (
                              <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${EMOTION_COLORS[tag] ?? 'bg-stone-100 text-stone-500'}`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-lg flex items-center justify-center bg-stone-100 border-4 border-white shadow-md -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                          <span className="material-symbols-outlined text-5xl text-stone-300">{icon}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-32 text-center">
            <div className="inline-block p-12 bg-surface-container-low rounded-xl border border-[#8B4513]/5 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-on-surface-variant mb-8 text-lg">准备好了？将这些事件汇集成传记章节。</p>
                <Link
                  to="/writing"
                  className="h-14 px-10 bg-[#8B4513] hover:bg-[#6c2f00] text-white rounded-full inline-flex items-center justify-center gap-3 mx-auto transition-all shadow-lg active:scale-95 group no-underline"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                  <span className="text-lg font-bold tracking-widest">开始写作</span>
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[12rem]">history_edu</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Event detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#F5F0E8] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-[#8B4513]/10 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-[#8B4513]">{selected.title}</h2>
                  {selected.startAt && (
                    <p className="text-sm text-stone-400 mt-1">{new Date(selected.startAt).toLocaleDateString('zh-CN')}</p>
                  )}
                </div>
                <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 mt-1">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8 space-y-5 overflow-y-auto max-h-[60vh]">
                {selected.summary && (
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">摘要</p>
                    <p className="text-sm text-on-surface leading-relaxed">{selected.summary}</p>
                  </div>
                )}
                {selected.description && (
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">详情</p>
                    <p className="text-sm text-on-surface leading-relaxed">{selected.description}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {selected.locationText && (
                    <span className="text-xs text-stone-500 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      {selected.locationText}
                    </span>
                  )}
                  {selected.participants?.map(p => (
                    <span key={p} className="text-xs text-stone-500 bg-white px-3 py-1 rounded-full">{p}</span>
                  ))}
                  {selected.emotionTags?.map(tag => (
                    <span key={tag} className={`text-xs px-3 py-1 rounded-full font-bold ${EMOTION_COLORS[tag] ?? 'bg-stone-100 text-stone-500'}`}>{tag}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <Link
                    to="/writing"
                    onClick={() => setSelected(null)}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-center no-underline hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    在章节中使用此事件
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 py-12 border-t border-[#8B4513]/10 text-center">
        <p className="text-stone-400 text-sm tracking-widest">人生传记 · 数字遗产服务 · 2024</p>
      </footer>
    </div>
  );
}
