import React, { useState } from 'react';

export default function Refinement() {
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = () => {
    setIsRefining(true);
    setTimeout(() => setIsRefining(false), 3000);
  };

  return (
    <main className="pt-32 pb-20 px-6 md:px-[10rem] max-w-7xl mx-auto min-h-screen">
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
              className="w-full h-80 bg-transparent resize-none text-xl leading-[2] text-on-surface placeholder:text-outline-variant/40 focus:outline-none font-body"
              placeholder="在这里开始您的讲述... 例如：'记得那年夏天，我第一次来到永定河边...'"
            ></textarea>
            
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-outline-variant/10">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">mic</span>
                  语音录入
                </button>
                <button className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">image</span>
                  添加配图
                </button>
              </div>
              <button 
                onClick={handleRefine}
                disabled={isRefining}
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
                “那年盛夏，永定河的水清亮得像面镜子。我们几个年轻人，带着满腔的热血和对未来的憧憬...”
              </div>
              <p className="text-sm text-on-surface-variant/60">AI 建议：可以增加一些关于当时环境气味的描述，比如“泥土的芬芳”或“庄稼的清香”，会让读者更有代入感。</p>
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
