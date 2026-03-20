import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8.5rem] relative min-h-screen">
      <div className="parchment-texture"></div>
      
      <header className="mt-12 mb-16 relative">
        <div className="max-w-4xl">
          <span className="text-secondary font-medium tracking-[0.3em] text-sm mb-4 block">良辰美景 · 岁月安好</span>
          <h1 className="text-5xl md:text-6xl font-black text-on-surface leading-tight mb-6">欢迎回来，<span className="text-primary">尊敬的传记者</span></h1>
          <p className="text-lg text-on-surface-variant/80 max-w-2xl leading-[1.8]">
            今天的天气很适合回忆。您的传记已经记录到“知青岁月”章节，想继续分享您的故事吗？
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Story Progress Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="bg-surface-container-low rounded-3xl p-8 shadow-[0_10px_40px_rgba(139,69,19,0.06)] relative overflow-hidden group border border-outline-variant/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">auto_stories</span>
              传记完成进度
            </h3>
            <div className="relative pt-1">
              <div className="flex mb-4 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-container/10">
                    已完成
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">65%</span>
                </div>
              </div>
              <div className="overflow-hidden h-2.5 mb-6 text-xs flex rounded-full bg-surface-variant">
                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-[#6C2F00]" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-surface-container rounded-xl">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">已写字数</span>
                <span className="text-xl font-black text-on-surface">2.4万</span>
              </div>
              <div className="p-4 bg-surface-container rounded-xl">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">收录档案</span>
                <span className="text-xl font-black text-on-surface">156份</span>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant italic mb-6">“笔耕不辍，岁月留香。距离完成整本传记还剩四个章节。”</p>
            <Link to="/writing" className="block w-full py-4 bg-gradient-to-br from-primary to-[#6C2F00] text-white rounded-xl font-bold tracking-wide text-center active:scale-95 transition-transform shadow-lg shadow-primary/20 no-underline">
              继续编写
            </Link>
          </section>

          <section className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">bolt</span>
              快捷操作
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">history_edu</span>
                <span className="text-xs font-bold">补全时间轴</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">auto_fix_high</span>
                <span className="text-xs font-bold">AI 智能润色</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">share</span>
                <span className="text-xs font-bold">分享预览</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">print</span>
                <span className="text-xs font-bold">导出画册</span>
              </button>
            </div>
          </section>
        </div>

        {/* Main Interaction & Entries */}
        <div className="lg:col-span-8 flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group flex flex-col items-center justify-center p-8 bg-surface-container rounded-2xl transition-all hover:bg-surface-container-high hover:translate-y-[-4px] active:scale-[0.98] border border-outline-variant/5">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              </div>
              <span className="text-xl font-bold text-on-surface">记录语音</span>
              <span className="text-sm text-on-surface-variant mt-2">讲述一段往事</span>
            </button>
            <button className="group flex flex-col items-center justify-center p-8 bg-secondary/5 rounded-2xl transition-all hover:bg-secondary/10 hover:translate-y-[-4px] active:scale-[0.98] border border-secondary/5">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              </div>
              <span className="text-xl font-bold text-on-surface">扫描相片</span>
              <span className="text-sm text-on-surface-variant mt-2">定格旧日时光</span>
            </button>
            <button className="group flex flex-col items-center justify-center p-8 bg-surface-container rounded-2xl transition-all hover:bg-surface-container-high hover:translate-y-[-4px] active:scale-[0.98] border border-outline-variant/5">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
              </div>
              <span className="text-xl font-bold text-on-surface">文字叙事</span>
              <span className="text-sm text-on-surface-variant mt-2">书写心中感悟</span>
            </button>
          </div>

          <section>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-on-surface">近期回忆</h2>
                <div className="h-1 w-12 bg-primary mt-2"></div>
              </div>
              <Link className="text-primary font-medium hover:underline underline-offset-8" to="/archive">查看全部回顾</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col">
                <div className="retro-border bg-white mb-6 group overflow-hidden">
                  <img 
                    alt="Old book on table" 
                    className="w-full aspect-[4/3] object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFOAQcQCEE1oDtThyBOFMswJfN6cLtPHkKOHmBXNGv84K3_0KKg40VmIBEEgn0jv_f5mEX5xD1QdtR42m14UoafmFbZ13dhV0zfmF7PK-qk4lG0JKikrRshGJU07h5lgikVFiX451GYC3Uar3XhDlhHKnkYpFl2qJsTsWJVXT7iZB8OEZebu4K7xjRDH3ZxsA42G-EiWmm3RXMjXKGL_He7BMhqVL85MvbwQBP8OQdEgetMcXBZU_PBINFe5FK0LbrxRNJ34RstA"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-4 bg-white text-center">
                    <span className="font-headline text-stone-500 italic text-sm">一九七二年初秋 · 永定河畔</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-2">插队的第一年</h4>
                <p className="text-on-surface-variant/80 leading-relaxed line-clamp-2">那时候天总是很蓝，我们几个知青挤在破旧的土屋里，虽然辛苦，但心里总有一团火...</p>
              </div>
              <div className="flex flex-col md:translate-y-8">
                <div className="retro-border bg-white mb-6 group overflow-hidden" style={{ transform: 'rotate(2deg)' }}>
                  <img 
                    alt="Stack of old books" 
                    className="w-full aspect-[4/3] object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeS-79yOWdnrr0to0L64Kj-MAUPUvp2DXd0cpMDnahuq_VByR1yArafHIMq8KEE4tfuC_uX6H9UMG1L5sR-w-sw_lXR0P8XtkevBYdQDOEtXgIQrn6rl4UhD1yC7KRRPcExXhMBJdjIAdYq3P1SiyplAFwCbQyZyrztVKF5Y1zs1Oxjj_yWkAOwd86GBjZh6mnLp_43IiOCmQkQ0K5xA6NTZZai7b1iKSY9I1DA6cdPbeGPWgP9WgCrjgsAEgHzhQUoAVWlLd4rQ"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-4 bg-white text-center">
                    <span className="font-headline text-stone-500 italic text-sm">一九八五年冬 · 婚礼合影</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-2">相守的承诺</h4>
                <p className="text-on-surface-variant/80 leading-relaxed line-clamp-2">红色的喜字，白色的确良衬衫，那是我们最隆重的时刻。这一牵手，就是一辈子...</p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-2xl font-bold mb-8 text-on-surface">待完成章节</h3>
            <div className="space-y-4">
              <div className="bg-surface-container-low p-6 rounded-lg flex items-center justify-between border-l-4 border-primary/20 hover:border-primary transition-colors cursor-pointer group">
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-black text-primary/10 group-hover:text-primary/30 transition-colors">04</span>
                  <div>
                    <h5 className="font-bold text-lg">成家立业</h5>
                    <p className="text-sm text-on-surface-variant">关于八十年代初期的工作变动与生活改善</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
              </div>
              <div className="bg-surface-container-low p-6 rounded-lg flex items-center justify-between border-l-4 border-primary/20 hover:border-primary transition-colors cursor-pointer group opacity-60">
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-black text-primary/10">05</span>
                  <div>
                    <h5 className="font-bold text-lg">新世纪的曙光</h5>
                    <p className="text-sm text-on-surface-variant">搬入新居，迎接新千年的到来</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline">lock</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
