import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <main className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[32px] p-10 md:p-16 shadow-[0_20px_80px_rgba(139,69,19,0.1)] border border-white/50">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl mb-8 rotate-3">
            <span className="material-symbols-outlined text-primary text-4xl">celebration</span>
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">欢迎加入 Heirloom</h1>
          <p className="text-on-surface-variant mt-3 font-medium">让我们花一点时间，为您定制专属的传记创作环境</p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-primary' : 'w-2 bg-outline-variant/30'}`}></div>
            ))}
          </div>
        </header>

        <div className="min-h-[300px]">
          {step === 1 && (
            <section className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-bold text-on-surface mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">1</span>
                完善您的联系方式
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest px-1">电子邮箱</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
                    <input className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-white transition-all outline-none" placeholder="example@mail.com" type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest px-1">手机号码</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">smartphone</span>
                    <input className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-white transition-all outline-none" placeholder="+86 138 **** 5678" type="tel" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-bold text-on-surface mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">2</span>
                选择您的 AI 创作伙伴
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <button className="p-6 bg-primary/5 border-2 border-primary rounded-2xl flex items-center justify-between text-left group hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Gemini 1.5 Pro</h4>
                      <p className="text-xs text-on-surface-variant">深度文学润色，适合长篇叙事</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                </button>
                <button className="p-6 bg-surface-container/50 border border-outline-variant/20 rounded-2xl flex items-center justify-between text-left group hover:border-primary/50 hover:bg-white transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline">bolt</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Gemini 1.5 Flash</h4>
                      <p className="text-xs text-on-surface-variant">极速响应，适合碎片化记录</p>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-xl font-bold text-on-surface mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">3</span>
                配置 API 密钥
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-secondary/5 border border-secondary/10 rounded-2xl flex gap-4">
                  <span className="material-symbols-outlined text-secondary">info</span>
                  <p className="text-sm text-secondary-container leading-relaxed">
                    为了启用 AI 润色功能，我们需要您提供 Google AI Studio 的 API 密钥。该密钥将仅加密存储在您的本地设备中。
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-outline uppercase tracking-widest px-1">API Key</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">key</span>
                    <input className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-white transition-all outline-none font-mono text-sm" placeholder="AIzaSyA-xxxxxxxxxxxx" type="password" />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <footer className="mt-12 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            className={`text-on-surface-variant font-bold hover:text-primary transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            上一步
          </button>
          <button 
            onClick={nextStep}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {step === 3 ? '完成设置' : '下一步'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
