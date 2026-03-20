import React from 'react';
import { Link } from 'react-router-dom';

export default function QuickActions() {
  const actions = [
    { title: '记录语音', desc: '讲述一段往事', icon: 'mic', color: 'bg-primary/10 text-primary', path: '/archive' },
    { title: '扫描相片', desc: '定格旧日时光', icon: 'photo_camera', color: 'bg-secondary/10 text-secondary', path: '/archive' },
    { title: '文字叙事', desc: '书写心中感悟', icon: 'edit_note', color: 'bg-primary/10 text-primary', path: '/refinement' },
    { title: '补全时间轴', desc: '梳理生命脉络', icon: 'history_edu', color: 'bg-secondary/10 text-secondary', path: '/timeline' },
    { title: 'AI 智能润色', desc: '提升文学质感', icon: 'auto_fix_high', color: 'bg-primary/10 text-primary', path: '/refinement' },
    { title: '分享预览', desc: '与家人共享回忆', icon: 'share', color: 'bg-secondary/10 text-secondary', path: '/preview' },
    { title: '导出画册', desc: '打印精美实体书', icon: 'print', color: 'bg-primary/10 text-primary', path: '/preview' },
    { title: '系统设置', desc: '管理账号与模型', icon: 'settings', color: 'bg-secondary/10 text-secondary', path: '/settings' },
  ];

  return (
    <main className="pt-32 pb-20 px-6 md:px-[8.5rem] max-w-7xl mx-auto min-h-screen">
      <div className="parchment-texture"></div>
      
      <header className="mb-12">
        <div className="flex items-center gap-3 text-secondary font-bold mb-4">
          <span className="material-symbols-outlined">bolt</span>
          <span className="tracking-widest uppercase text-sm">快捷操作</span>
        </div>
        <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">快速开始</h1>
        <p className="text-on-surface-variant font-medium">选择一个动作，立即开始您的传记创作</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, i) => (
          <Link 
            key={i} 
            to={action.path}
            className="group p-8 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm hover:bg-white hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{action.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">{action.title}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{action.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>立即前往</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-16 p-10 bg-gradient-to-br from-primary to-[#6C2F00] rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black mb-4">需要灵感？</h2>
            <p className="text-white/80 leading-relaxed">
              不知道从哪里开始？试试我们的“灵感卡片”，AI 会根据您的年龄和经历，为您推荐最值得记录的生命瞬间。
            </p>
          </div>
          <button className="bg-white text-primary px-10 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
            开启灵感之旅
          </button>
        </div>
      </section>
    </main>
  );
}
