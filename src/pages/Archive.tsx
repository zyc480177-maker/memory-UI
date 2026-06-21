import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProject } from '../context/ProjectContext';
import { assetsApi } from '../api';
import { Asset } from '../types/domain';

const STATUS_LABELS: Record<Asset['analysisStatus'], { label: string; color: string }> = {
  not_started: { label: '未分析', color: 'text-stone-400 bg-stone-100' },
  queued: { label: '排队中', color: 'text-blue-500 bg-blue-50' },
  running: { label: 'AI 分析中...', color: 'text-amber-500 bg-amber-50' },
  completed: { label: '已分析', color: 'text-green-600 bg-green-50' },
  failed: { label: '分析失败', color: 'text-red-500 bg-red-50' },
};

const TYPE_ICONS: Record<string, string> = {
  image: 'image',
  audio: 'audio_file',
  text: 'description',
  video_reserved: 'videocam',
};

export default function Archive() {
  const { currentProject } = useProject();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadAssets() {
    if (!currentProject) { setLoading(false); return; }
    try {
      const list = await assetsApi.list(currentProject.id);
      setAssets(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadAssets();
  }, [currentProject?.id]);

  // Poll for status updates when items are running
  useEffect(() => {
    const hasRunning = assets.some(a => a.analysisStatus === 'running' || a.analysisStatus === 'queued');
    if (!hasRunning) return;

    const timer = setInterval(async () => {
      if (!currentProject) return;
      const list = await assetsApi.list(currentProject.id);
      setAssets(list);
    }, 3000);

    return () => clearInterval(timer);
  }, [assets, currentProject]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  }

  async function handleReanalyze(asset: Asset) {
    if (!currentProject) return;
    await assetsApi.analyze(currentProject.id, asset.id);
    await loadAssets();
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-surface pt-24 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-stone-300 block mb-4">folder_open</span>
          <p className="text-on-surface-variant mb-4">请先创建或选择一个项目</p>
          <Link to="/" className="text-primary font-bold no-underline">返回首页</Link>
        </div>
      </div>
    );
  }

  const images = assets.filter(a => a.type === 'image');
  const texts = assets.filter(a => a.type === 'text');
  const audios = assets.filter(a => a.type === 'audio');

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20 px-6 md:px-[8.5rem]">
      <header className="mt-8 mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">我的档案</h1>
          <p className="text-on-surface-variant/70 italic">{currentProject.title} · {assets.length} 份素材</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 border border-stone-200 rounded-full text-sm text-stone-500 hover:bg-stone-50 transition-colors flex items-center gap-2"
          >
            <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
            刷新
          </button>
          <Link to="/capture" className="px-6 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors no-underline flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            添加素材
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
        </div>
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="material-symbols-outlined text-6xl text-stone-200 mb-6">photo_library</span>
          <h3 className="text-xl font-bold text-on-surface mb-3">还没有任何素材</h3>
          <p className="text-on-surface-variant/70 mb-8">上传照片、录音或写下文字，AI 会自动分析并提取人生事件</p>
          <Link to="/capture" className="px-8 py-3 bg-primary text-white rounded-2xl font-bold no-underline hover:bg-primary/90 transition-colors">
            添加第一份素材
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Images */}
          {images.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">image</span>
                照片 ({images.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => setSelected(asset)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    {asset.url ? (
                      <img
                        src={`http://localhost:4000${asset.url}`}
                        alt={asset.fileName}
                        className="w-full aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-stone-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-stone-300">image</span>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-bold text-on-surface truncate">{asset.fileName}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_LABELS[asset.analysisStatus].color}`}>
                        {STATUS_LABELS[asset.analysisStatus].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Text assets */}
          {texts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">description</span>
                文字叙事 ({texts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {texts.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => setSelected(asset)}
                    className="cursor-pointer p-6 rounded-2xl border border-outline-variant/20 bg-surface-container hover:shadow-md transition-all hover:border-primary/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">description</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-on-surface mb-1 truncate">{asset.fileName?.replace('.txt', '') ?? '文字素材'}</p>
                        {asset.summary && (
                          <p className="text-sm text-on-surface-variant/70 line-clamp-2">{asset.summary}</p>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${STATUS_LABELS[asset.analysisStatus].color}`}>
                          {STATUS_LABELS[asset.analysisStatus].label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Audio assets */}
          {audios.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">audio_file</span>
                录音 ({audios.length})
              </h2>
              <div className="space-y-3">
                {audios.map(asset => (
                  <div key={asset.id} className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant/20 bg-surface-container">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary">audio_file</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-on-surface text-sm truncate">{asset.fileName}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_LABELS[asset.analysisStatus].color}`}>
                        {STATUS_LABELS[asset.analysisStatus].label}
                      </span>
                    </div>
                    {asset.analysisStatus === 'failed' && (
                      <button onClick={() => handleReanalyze(asset)} className="text-xs text-primary font-bold hover:underline">重新分析</button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Asset detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-on-surface text-lg">{selected.fileName}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_LABELS[selected.analysisStatus].color}`}>
                    {STATUS_LABELS[selected.analysisStatus].label}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {selected.type === 'image' && selected.url && (
                <img
                  src={`http://localhost:4000${selected.url}`}
                  alt={selected.fileName}
                  className="w-full rounded-2xl mb-6 max-h-64 object-cover"
                />
              )}

              {selected.summary && (
                <div className="bg-stone-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">AI 摘要</p>
                  <p className="text-sm text-on-surface leading-relaxed">{selected.summary}</p>
                </div>
              )}

              {selected.analysisStatus === 'failed' && (
                <button
                  onClick={() => { handleReanalyze(selected); setSelected(null); }}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  重新触发 AI 分析
                </button>
              )}

              <div className="mt-4 text-xs text-stone-300 flex gap-4">
                {selected.byteSize && <span>{(selected.byteSize / 1024).toFixed(0)} KB</span>}
                <span>{new Date(selected.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
