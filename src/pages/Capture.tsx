import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export default function Capture() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') || 'voice';
  const initialChapterId = searchParams.get('chapterId') || '';
  
  const [mode, setMode] = useState(initialMode);
  const [selectedChapter, setSelectedChapter] = useState(initialChapterId);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraRecording, setIsCameraRecording] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);

  const chapters = [
    { id: '1', title: '呱呱坠地 (1952)' },
    { id: '2', title: '书香岁月 (1970)' },
    { id: '3', title: '事业启航 (1982)' }
  ];

  const modes = [
    { id: 'voice', icon: 'mic', label: '记录语音', desc: '口述回忆' },
    { id: 'photo', icon: 'photo_camera', label: '扫描相片', desc: '数字化老照片' },
    { id: 'video', icon: 'videocam', label: '录制视频', desc: '留下生动影像' },
    { id: 'text', icon: 'edit_note', label: '文字叙事', desc: '执笔书写' }
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveToast(true);
      setTimeout(() => {
        setShowSaveToast(false);
        navigate('/archive');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] pt-24 pb-20 px-6 md:px-[8.5rem]">
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#5C7A4E] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            已保存至档案，并关联至续写华章
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">新增档案</h1>
          <p className="text-on-surface-variant/70 italic">记录此刻，留住永恒</p>
        </div>
        <Link to="/archive" className="px-6 py-2 border border-primary/20 rounded-full text-sm font-bold text-primary hover:bg-primary/5 transition-colors no-underline">
          返回档案
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Modes */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">记录方式</h3>
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${mode === m.id ? 'bg-surface border-primary shadow-md' : 'bg-surface/50 border-transparent hover:bg-surface'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${mode === m.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                <span className="material-symbols-outlined">{m.icon}</span>
              </div>
              <div>
                <h4 className={`font-bold ${mode === m.id ? 'text-primary' : 'text-on-surface'}`}>{m.label}</h4>
                <p className="text-[10px] text-stone-400">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Center: Capture Area */}
        <div className="lg:col-span-6">
          <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/20 p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {mode === 'voice' && (
                <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center w-full">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 cursor-pointer transition-all ${isRecording ? 'bg-red-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-110' : 'bg-primary/10 text-primary hover:bg-primary/20'}`} onClick={() => setIsRecording(!isRecording)}>
                    <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>{isRecording ? 'stop' : 'mic'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface mb-2">{isRecording ? '正在录音...' : '点击开始录音'}</h3>
                  <p className="text-stone-400">{isRecording ? '00:12' : '讲述一段难忘的往事'}</p>
                  
                  {isRecording && (
                    <div className="w-full max-w-xs mt-12 flex items-end justify-center gap-1 h-12">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-red-400 rounded-full"
                          animate={{ height: ['20%', '100%', '20%'] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {mode === 'photo' && (
                <motion.div key="photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center w-full">
                  {showCamera ? (
                    <div className="w-full aspect-video bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
                      <span className="text-white/50">摄像头画面预览</span>
                      <button 
                        onClick={() => {
                          setCapturedMedia('photo');
                          setShowCamera(false);
                        }}
                        className="absolute bottom-6 w-16 h-16 rounded-full bg-white border-4 border-stone-300 hover:scale-105 active:scale-95 transition-all"
                      ></button>
                      <button 
                        onClick={() => setShowCamera(false)}
                        className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : capturedMedia === 'photo' ? (
                    <div className="w-full aspect-video bg-stone-200 rounded-2xl relative overflow-hidden flex items-center justify-center mb-6">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHsmwSuUOdov9r3Ke6UuBSnPWvqolijcBpL7OeJpf-qgfZ12F9oXAoh0IiN8lVaK0bDxi3WhD42odkkhDbhkBW3nW2uBMTKiUpzYONVl_e_PfaYUHLzwTfx31LTVYNHV-I3qngg0IKQ_hym-cie9T3cuPVHdT7MSBswqZr1nTrHP2kaBNDy7KxYI016mXfLLFeeXOmMz8GjWjPlifqVBLjywd4RoqnvurXqh37E4hYAJRqMukh8LP9DXx6qwfMLyMk9yTQK4p-2g" alt="Captured" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => setCapturedMedia(null)}
                        className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-full aspect-video border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer mb-6">
                        <span className="material-symbols-outlined text-4xl text-stone-300 mb-4">add_photo_alternate</span>
                        <span className="font-bold text-stone-500">点击上传或拖拽照片至此</span>
                        <span className="text-xs text-stone-400 mt-2">支持 JPG, PNG 格式</span>
                      </div>
                      <button 
                        onClick={() => setShowCamera(true)}
                        className="px-6 py-3 bg-secondary/10 text-secondary rounded-full font-bold text-sm hover:bg-secondary/20 transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                        调用摄像头拍摄
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {mode === 'video' && (
                <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center w-full">
                  {showCamera ? (
                    <div className="w-full aspect-video bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
                      <span className="text-white/50">摄像头画面预览</span>
                      {isCameraRecording && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-white text-xs font-mono">00:05</span>
                        </div>
                      )}
                      <button 
                        onClick={() => {
                          if (isCameraRecording) {
                            setIsCameraRecording(false);
                            setCapturedMedia('video');
                            setShowCamera(false);
                          } else {
                            setIsCameraRecording(true);
                          }
                        }}
                        className={`absolute bottom-6 w-16 h-16 rounded-full border-4 border-stone-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center ${isCameraRecording ? 'bg-transparent' : 'bg-red-500'}`}
                      >
                        {isCameraRecording && <div className="w-6 h-6 bg-red-500 rounded-sm"></div>}
                      </button>
                      <button 
                        onClick={() => {
                          setShowCamera(false);
                          setIsCameraRecording(false);
                        }}
                        className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : capturedMedia === 'video' ? (
                    <div className="w-full aspect-video bg-stone-900 rounded-2xl relative overflow-hidden flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-white text-6xl opacity-50">play_circle</span>
                      <button 
                        onClick={() => setCapturedMedia(null)}
                        className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/70"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-full aspect-video border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer mb-6">
                        <span className="material-symbols-outlined text-4xl text-stone-300 mb-4">video_call</span>
                        <span className="font-bold text-stone-500">点击上传或拖拽视频至此</span>
                        <span className="text-xs text-stone-400 mt-2">支持 MP4, MOV 格式</span>
                      </div>
                      <button 
                        onClick={() => setShowCamera(true)}
                        className="px-6 py-3 bg-primary/10 text-primary rounded-full font-bold text-sm hover:bg-primary/20 transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">videocam</span>
                        调用摄像头录制
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {mode === 'text' && (
                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col w-full h-full">
                  <input 
                    type="text" 
                    placeholder="输入标题..." 
                    className="text-2xl font-bold text-on-surface bg-transparent border-b border-stone-100 pb-4 mb-4 focus:outline-none focus:border-primary transition-colors"
                  />
                  <textarea 
                    className="flex-1 w-full resize-none bg-transparent text-lg leading-relaxed text-on-surface focus:outline-none placeholder:text-stone-300 min-h-[300px]"
                    placeholder="在这里写下您的故事..."
                  ></textarea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Metadata & Save */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/20 p-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">link</span>
                关联至续写华章
              </h4>
              <select 
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none"
              >
                <option value="">不关联，仅保存至档案</option>
                {chapters.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <p className="text-[10px] text-on-surface-variant mt-2 leading-relaxed">
                关联后，此内容将作为素材出现在对应章节的“续写华章”写作界面中。
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                发生日期
              </h4>
              <input type="date" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">label</span>
                添加标签
              </h4>
              <input type="text" placeholder="例如：童年, 老屋, 朋友" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                保存中...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                保存至档案
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
