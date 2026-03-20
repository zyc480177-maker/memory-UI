import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function BiographyBook() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLayout, setSelectedLayout] = useState('classic');

  const layouts = [
    { id: 'classic', name: '经典宣纸', desc: '古朴典雅，适合长篇回忆', icon: 'menu_book' },
    { id: 'modern', name: '现代简约', desc: '清新明快，适合图文并茂', icon: 'auto_stories' },
    { id: 'magazine', name: '画册杂志', desc: '视觉冲击，适合大量照片', icon: 'photo_library' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8] pt-24 pb-20 px-6 md:px-[8.5rem]">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">传记成书</h1>
          <p className="text-on-surface-variant/70 italic">最后一步：将您的岁月长歌编撰成册</p>
        </div>
        <div className="flex gap-4">
          <Link to="/timeline" className="px-6 py-2 border border-[#8B4513]/20 rounded-full text-sm font-bold text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors flex items-center justify-center">
            返回修改
          </Link>
          <Link to="/preview" className="px-8 py-2 bg-[#8B4513] text-white rounded-full font-bold text-sm shadow-lg hover:bg-[#6C2F00] transition-all active:scale-95 no-underline flex items-center justify-center">
            确认出版
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Book Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-2xl p-12 aspect-[3/4] relative overflow-hidden border border-[#8B4513]/5">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>
            
            <div className="h-full flex flex-col items-center justify-center text-center relative z-10">
              <div className="w-1 h-32 bg-[#8B4513]/20 mb-8"></div>
              <h2 className="text-5xl font-serif font-bold text-[#8B4513] mb-4 tracking-[0.2em]">岁月长歌</h2>
              <p className="text-xl text-stone-500 italic mb-12 tracking-widest">— 个人传记珍藏本 —</p>
              <div className="w-24 h-px bg-[#8B4513]/40 mb-8"></div>
              <p className="text-lg font-bold text-[#8B4513]">张建国 著</p>
              <p className="text-sm text-stone-400 mt-2">二零二四年 · 春</p>
            </div>

            {/* Book Spine Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#8B4513] hover:bg-stone-50 transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="flex items-center text-sm font-bold text-stone-500">封面 / 128页</span>
            <button className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-[#8B4513] hover:bg-stone-50 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Right: Configuration */}
        <div className="lg:col-span-5 space-y-8">
          <section>
            <h3 className="text-xl font-bold text-[#8B4513] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">palette</span>
              选择装帧风格
            </h3>
            <div className="space-y-4">
              {layouts.map(layout => (
                <div 
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-6 ${selectedLayout === layout.id ? 'border-[#8B4513] bg-[#8B4513]/5' : 'border-stone-100 bg-white hover:border-stone-200'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedLayout === layout.id ? 'bg-[#8B4513] text-white' : 'bg-stone-100 text-stone-400'}`}>
                    <span className="material-symbols-outlined">{layout.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">{layout.name}</h4>
                    <p className="text-xs text-stone-400 mt-1">{layout.desc}</p>
                  </div>
                  {selectedLayout === layout.id && (
                    <span className="material-symbols-outlined ml-auto text-[#8B4513]">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-[#8B4513] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">settings_suggest</span>
              内容编排建议
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-[#8B4513]/5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <span className="text-sm font-medium">自动生成前言</span>
                <div className="w-10 h-5 bg-[#8B4513] rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <span className="text-sm font-medium">按年代排序章节</span>
                <div className="w-10 h-5 bg-[#8B4513] rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                <span className="text-sm font-medium">插入时光足迹图表</span>
                <div className="w-10 h-5 bg-stone-300 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10">
            <h4 className="font-bold text-primary mb-2">AI 出版助手</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              您的传记内容非常丰富，建议在“求学时代”章节增加 2 张插图，这样排版会更加美观。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
