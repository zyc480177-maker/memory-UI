import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { assetsApi } from '../api';

export default function Capture() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentProject } = useProject();

  const initialMode = searchParams.get('mode') || 'photo';
  const [mode, setMode] = useState(initialMode);
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Text mode state
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');

  // File mode state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [captureTime, setCaptureTime] = useState('');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modes = [
    { id: 'photo', icon: 'photo_camera', label: '扫描相片', desc: '数字化老照片' },
    { id: 'voice', icon: 'mic', label: '记录语音', desc: '口述回忆（上传音频）' },
    { id: 'text', icon: 'edit_note', label: '文字叙事', desc: '执笔书写' },
  ];

  async function handleSave() {
    if (!currentProject) {
      setError('请先创建或选择一个项目');
      return;
    }
    setError('');
    setUploading(true);

    try {
      if (mode === 'text') {
        if (!textTitle.trim() || !textContent.trim()) {
          setError('请填写标题和内容');
          setUploading(false);
          return;
        }
        await assetsApi.createText(currentProject.id, {
          title: textTitle,
          content: textContent,
          notes,
        });
      } else {
        if (!selectedFile) {
          setError('请选择要上传的文件');
          setUploading(false);
          return;
        }
        await assetsApi.uploadFile(currentProject.id, selectedFile, {
          notes,
          captureTime: captureTime || undefined,
        });
      }

      setShowSaveToast(true);
      setTimeout(() => {
        setShowSaveToast(false);
        navigate('/archive');
      }, 1800);
    } catch (err) {
      setError((err as Error).message || '保存失败，请重试');
    } finally {
      setUploading(false);
    }
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] pt-24 pb-20 px-6 md:px-[8.5rem] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-stone-300 mb-4 block">folder_open</span>
          <p className="text-on-surface-variant mb-6">请先创建或选择一个项目</p>
          <Link to="/" className="px-6 py-3 bg-primary text-white rounded-full font-bold no-underline">返回首页</Link>
        </div>
      </div>
    );
  }

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
            已保存！AI 正在后台分析...
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">新增素材</h1>
          <p className="text-on-surface-variant/70 italic">项目：{currentProject.title}</p>
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
              onClick={() => { setMode(m.id); setSelectedFile(null); setError(''); }}
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
          <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/20 p-8 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              {mode === 'text' && (
                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1">
                  <input
                    type="text"
                    placeholder="输入标题..."
                    value={textTitle}
                    onChange={(e) => setTextTitle(e.target.value)}
                    className="text-2xl font-bold text-on-surface bg-transparent border-b border-stone-100 pb-4 mb-4 focus:outline-none focus:border-primary transition-colors"
                  />
                  <textarea
                    className="flex-1 w-full resize-none bg-transparent text-lg leading-relaxed text-on-surface focus:outline-none placeholder:text-stone-300 min-h-[300px]"
                    placeholder="在这里写下您的故事..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                  />
                </motion.div>
              )}

              {(mode === 'photo' || mode === 'voice') && (
                <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={mode === 'photo' ? 'image/*' : 'audio/*'}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setSelectedFile(f);
                      setError('');
                    }}
                  />

                  {selectedFile ? (
                    <div className="w-full">
                      {mode === 'photo' && selectedFile.type.startsWith('image/') && (
                        <div className="relative rounded-2xl overflow-hidden mb-4">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="预览"
                            className="w-full max-h-64 object-cover"
                          />
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      )}
                      {mode === 'voice' && (
                        <div className="flex items-center gap-4 bg-stone-50 rounded-2xl p-4 mb-4">
                          <span className="material-symbols-outlined text-3xl text-primary">audio_file</span>
                          <div>
                            <p className="font-bold text-on-surface text-sm">{selectedFile.name}</p>
                            <p className="text-xs text-stone-400">{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</p>
                          </div>
                          <button onClick={() => setSelectedFile(null)} className="ml-auto text-stone-400 hover:text-red-400">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex-1 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors cursor-pointer min-h-64 py-16"
                    >
                      <span className="material-symbols-outlined text-5xl text-stone-300 mb-4">
                        {mode === 'photo' ? 'add_photo_alternate' : 'audio_file'}
                      </span>
                      <span className="font-bold text-stone-500">点击选择{mode === 'photo' ? '照片' : '音频'}文件</span>
                      <span className="text-xs text-stone-400 mt-2">
                        {mode === 'photo' ? '支持 JPG, PNG, WEBP' : '支持 MP3, WAV, M4A'}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Metadata & Save */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/20 p-6 space-y-5">
            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                发生日期
              </h4>
              <input
                type="date"
                value={captureTime}
                onChange={(e) => setCaptureTime(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">sticky_note_2</span>
                备注
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="关于这份素材的说明..."
                rows={3}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={uploading}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {uploading ? (
              <><span className="material-symbols-outlined animate-spin">sync</span>上传中...</>
            ) : (
              <><span className="material-symbols-outlined">cloud_upload</span>保存并分析</>
            )}
          </button>

          <p className="text-xs text-center text-stone-400">
            上传后 AI 将自动分析素材，提取人生事件
          </p>
        </div>
      </div>
    </div>
  );
}
