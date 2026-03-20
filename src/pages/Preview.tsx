import React from 'react';

export default function Preview() {
  return (
    <main className="pt-32 pb-20 px-6 md:px-[8.5rem] max-w-7xl mx-auto min-h-screen">
      <div className="parchment-texture"></div>
      
      <div className="flex flex-col xl:flex-row gap-16 items-start">
        <div className="flex-1 w-full">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">传记预览</h1>
              <p className="text-on-surface-variant font-medium">《岁月长歌：张建国的个人传记》· 样书预览</p>
            </div>
            <div className="flex gap-4">
              <button className="p-3 bg-surface-container rounded-full text-primary hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">print</span>
              </button>
              <button className="p-3 bg-surface-container rounded-full text-primary hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </header>

          <div className="relative group perspective-1000">
            <div className="bg-white aspect-[1.4/1] rounded-lg book-shadow flex overflow-hidden relative border border-outline-variant/20">
              {/* Left Page */}
              <div className="flex-1 p-12 md:p-16 border-r border-outline-variant/10 relative">
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-black/5"></div>
                <span className="text-[10px] text-stone-400 font-label tracking-widest absolute top-8 left-12">第一章 · 峥嵘岁月</span>
                <div className="mt-12">
                  <h2 className="text-3xl font-bold text-on-surface mb-8">插队的第一年</h2>
                  <div className="space-y-6 text-lg leading-[2] text-on-surface-variant font-body">
                    <p>一九七二年初秋，我背着简单的行囊，踏上了前往永定河畔的列车。车窗外的景色飞速倒退，我的心情也随之起伏不定。</p>
                    <p>那是一个充满理想也充满艰辛的年代。我们这些知识青年，怀揣着对土地的热爱和对未来的迷茫，来到了这片陌生的土地。</p>
                    <p>初到农村，一切都是新鲜而又陌生的。土屋、油灯、粗茶淡饭，成了我们生活的全部...</p>
                  </div>
                </div>
                <span className="text-xs text-stone-400 absolute bottom-8 left-1/2 -translate-x-1/2">12</span>
              </div>
              
              {/* Right Page */}
              <div className="flex-1 p-12 md:p-16 relative bg-[#fdfaf5]">
                <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-black/5"></div>
                <div className="h-full flex flex-col justify-center items-center">
                  <div className="retro-border bg-white p-2 shadow-sm rotate-1 mb-8">
                    <img 
                      alt="Old photo" 
                      className="w-full aspect-square object-cover grayscale" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFOAQcQCEE1oDtThyBOFMswJfN6cLtPHkKOHmBXNGv84K3_0KKg40VmIBEEgn0jv_f5mEX5xD1QdtR42m14UoafmFbZ13dhV0zfmF7PK-qk4lG0JKikrRshGJU07h5lgikVFiX451GYC3Uar3XhDlhHKnkYpFl2qJsTsWJVXT7iZB8OEZebu4K7xjRDH3ZxsA42G-EiWmm3RXMjXKGL_He7BMhqVL85MvbwQBP8OQdEgetMcXBZU_PBINFe5FK0LbrxRNJ34RstA"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-sm italic text-stone-500 font-headline">一九七二年秋 · 生产队合影留念</p>
                </div>
                <span className="text-xs text-stone-400 absolute bottom-8 left-1/2 -translate-x-1/2">13</span>
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 bg-surface-container-low p-6 rounded-xl">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold text-primary mb-2">
                <span>阅读进度</span>
                <span>45 / 128 页</span>
              </div>
              <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[35%]"></div>
              </div>
            </div>
            <button className="px-6 py-2 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all">
              跳转章节
            </button>
          </div>
        </div>

        <aside className="w-full xl:w-80 flex flex-col gap-8">
          <div className="bg-surface-container-high rounded-2xl p-8 border border-outline-variant/10">
            <h3 className="text-xl font-bold text-on-surface mb-6">装帧设置</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-outline uppercase tracking-widest">纸张材质</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="aspect-square rounded-lg bg-[#F5F0E8] border-2 border-primary shadow-sm"></button>
                  <button className="aspect-square rounded-lg bg-[#ffffff] border border-outline-variant"></button>
                  <button className="aspect-square rounded-lg bg-[#e8e4d8] border border-outline-variant"></button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-outline uppercase tracking-widest">字体大小</label>
                <input type="range" className="w-full accent-primary" min="14" max="24" defaultValue="18" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-outline uppercase tracking-widest">排版样式</label>
                <select className="w-full bg-transparent border-b-2 border-outline-variant py-2 focus:border-primary outline-none">
                  <option>经典文学</option>
                  <option>现代简约</option>
                  <option>复古报章</option>
                </select>
              </div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-primary to-[#6C2F00] text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined">auto_stories</span>
            导出精装画册
          </button>
        </aside>
      </div>
    </main>
  );
}
