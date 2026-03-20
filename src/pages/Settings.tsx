import React, { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <main className="pt-32 pb-20 px-6 md:px-[8.5rem] max-w-7xl mx-auto min-h-screen">
      <div className="parchment-texture"></div>
      
      <header className="mb-12">
        <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">系统设置</h1>
        <p className="text-on-surface-variant font-medium">管理您的账号、AI 模型偏好及 API 接口</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'account' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">person</span>
            账号信息
          </button>
          <button 
            onClick={() => setActiveTab('model')}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'model' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">psychology</span>
            大模型配置
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'api' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">api</span>
            API 密钥
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'privacy' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">security</span>
            隐私与安全
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/10 shadow-sm">
          {activeTab === 'account' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-6 pb-8 border-b border-outline-variant/10">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl text-primary font-black border-4 border-white shadow-md">
                  张
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-on-surface">张建国</h3>
                  <p className="text-on-surface-variant">高级会员 · 档案守护者</p>
                  <button className="mt-2 text-sm text-primary font-bold hover:underline">更换头像</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest">电子邮箱</label>
                  <input type="email" className="w-full bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none transition-all" defaultValue="zhang.jg@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest">手机号码</label>
                  <input type="tel" className="w-full bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none transition-all" defaultValue="+86 138 **** 5678" />
                </div>
              </div>

              <div className="pt-6">
                <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  保存更改
                </button>
              </div>
            </section>
          )}

          {activeTab === 'model' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-on-surface">AI 写作助手配置</h3>
                <p className="text-on-surface-variant">选择最适合您叙事风格的大语言模型</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 bg-primary/5 border-2 border-primary rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-3xl text-primary">auto_awesome</span>
                    <div>
                      <h4 className="font-bold text-on-surface">Gemini 1.5 Pro (推荐)</h4>
                      <p className="text-sm text-on-surface-variant">最强推理能力，适合深度文学润色与逻辑整理</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                </div>
                <div className="p-6 bg-surface-container rounded-2xl flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-3xl text-outline">bolt</span>
                    <div>
                      <h4 className="font-bold text-on-surface">Gemini 1.5 Flash</h4>
                      <p className="text-sm text-on-surface-variant">响应极快，适合快速记录与简单纠错</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-xs font-bold text-outline uppercase tracking-widest">叙事风格偏好</label>
                <div className="flex flex-wrap gap-3">
                  {['纪实文学', '散文诗化', '平铺直叙', '怀旧复古', '幽默风趣'].map(style => (
                    <button key={style} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${style === '怀旧复古' ? 'bg-secondary text-white border-secondary' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'api' && (
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-on-surface">API 密钥管理</h3>
                <p className="text-on-surface-variant">配置您的专属 API 密钥以启用高级 AI 功能</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest flex justify-between">
                    Google AI Studio API Key
                    <span className="text-primary hover:underline cursor-pointer">如何获取？</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="password" 
                      className="w-full bg-surface-container px-4 py-4 rounded-xl border border-outline-variant/20 font-mono text-sm focus:border-primary outline-none" 
                      defaultValue="AIzaSyA-xxxxxxxxxxxxxxxxxxxx"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20 flex gap-4">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <p className="text-sm text-secondary-container leading-relaxed">
                    您的 API 密钥将仅保存在本地浏览器中，用于直接与模型服务通信，确保您的隐私数据绝不外泄。
                  </p>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  更新密钥
                </button>
                <button className="px-8 py-3 rounded-full font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all">
                  测试连接
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
