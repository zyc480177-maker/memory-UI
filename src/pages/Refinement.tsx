import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

export default function Refinement() {
  const [isRefining, setIsRefining] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const handleRefine = async () => {
    if (!text.trim()) return;
    setIsRefining(true);
    try {
      const apiKey = localStorage.getItem('gemini_api_key') || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        alert('未找到 API 密钥，请在设置中配置');
        setIsRefining(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `请帮我润色以下文字，使其更具文学色彩，适合作为个人传记的一部分。保持原意，但提升文笔。直接返回润色后的文本，不要包含任何其他解释：\n\n${text}`
      });
      
      if (response.text) {
        setText(response.text);
        
        // Generate a suggestion
        const suggestionResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `基于以下传记片段，给出一个简短的写作建议（例如：可以增加哪些细节描写）。直接返回建议文本，控制在50字以内：\n\n${response.text}`
        });
        if (suggestionResponse.text) {
          setAiSuggestion(suggestionResponse.text);
        }
      }
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('AI 润色失败:', error);
      alert('润色失败，请稍后重试');
    } finally {
      setIsRefining(false);
    }
  };

  const handleVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setText((prev) => prev + (prev ? '\n' : '') + '记得那年夏天，我第一次来到永定河边...');
    }, 2000);
  };

  return (
    <main className="pt-32 pb-20 px-6 md:px-[10rem] max-w-7xl mx-auto min-h-screen relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#5C7A4E] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            AI 润色完成！
          </motion.div>
        )}
      </AnimatePresence>

      <div className="parchment-texture"></div>
      
      <div className="flex flex-col lg:flex-row gap-16 relative z-10">
        <div className="flex-1">
          <header className="mb-10">
            <div className="flex items-center gap-3 text-secondary font-bold mb-4">
              <span className="material-symbols-outlined">auto_fix_high</span>
              <span className="tracking-widest uppercase text-sm">AI 智能精修</span>
            </div>
            <h1 className="text-4xl font-black text-on-surface mb-4 tracking-tight">讲述您的故事</h1>
            <p className="text-on-surface-variant leading-relaxed">您可以直接输入文字，或上传语音。AI 将协助您将口语化的叙述转化为优美的文学篇章。</p>
          </header>

          <div className="bg-surface-container-low rounded-2xl p-8 shadow-inner border border-outline-variant/10 writing-well">
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-80 bg-transparent resize-none text-xl leading-[2] text-on-surface placeholder:text-outline-variant/40 focus:outline-none font-body"
              placeholder="在这里开始您的讲述... 例如：'记得那年夏天，我第一次来到永定河边...'"
            ></textarea>
            
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-outline-variant/10">
              <div className="flex gap-4">
                <button 
                  onClick={handleVoice}
                  className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${isRecording ? 'bg-red-50 text-red-500' : 'text-primary hover:bg-primary/5'}`}
                >
                  <span className="material-symbols-outlined">{isRecording ? 'stop_circle' : 'mic'}</span>
                  {isRecording ? '正在录音...' : '语音录入'}
                </button>
                <button className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">image</span>
                  添加配图
                </button>
              </div>
              <button 
                onClick={handleRefine}
                disabled={isRefining || !text.trim()}
                className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
              >
                {isRefining ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    正在润色...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">magic_button</span>
                    AI 润色
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-96 flex flex-col gap-8">
          <div className="bg-surface-container-high rounded-2xl p-8 border border-outline-variant/10">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">history_edu</span>
              精修预览
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/50 rounded-lg border-l-4 border-secondary italic text-on-surface-variant leading-relaxed">
                {text ? `“${text.substring(0, 50)}${text.length > 50 ? '...' : ''}”` : '暂无内容'}
              </div>
              {aiSuggestion && (
                <p className="text-sm text-on-surface-variant/60">AI 建议：{aiSuggestion}</p>
              )}
              {!aiSuggestion && text && (
                <p className="text-sm text-on-surface-variant/60">点击“AI 润色”获取写作建议。</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary to-[#3d5234] rounded-2xl p-8 text-white shadow-xl">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">tips_and_updates</span>
              灵感启发
            </h4>
            <ul className="space-y-4 text-sm opacity-90">
              <li className="flex gap-3">
                <span className="text-secondary-container">•</span>
                <span>当时的天气是怎么样的？</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-container">•</span>
                <span>身边还有哪些人？他们的表情如何？</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-container">•</span>
                <span>那次经历对您后来的生活有什么影响？</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
