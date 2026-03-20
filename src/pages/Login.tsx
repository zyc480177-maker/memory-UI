import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12">
      <main className="relative w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 md:gap-20 mt-16">
        <div className="hidden md:flex flex-col flex-1 text-on-surface">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight">
            将岁月的<br />
            <span className="text-primary italic">浮光掠影</span><br />
            凝结成册。
          </h2>
          <p className="text-lg opacity-80 max-w-md leading-relaxed">
            在这里，每一张泛黄的照片、每一段琐碎的日常，都将通过智能编排转化为永恒的家族遗产。
          </p>
          <div className="mt-12 flex gap-4">
            <div className="w-32 h-40 bg-surface-variant rounded-xl rotate-[-3deg] shadow-lg overflow-hidden border-4 border-white">
              <img 
                alt="Vintage family photo" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJlQNbgzRF-whfmMqteN_LF9xi2GNL4FAV7Vu7JTksZz3nTtXhOWoNtYavBr5wsG96dFceQwjWGAD199bEhS2-DJrm8BAKRnkDpdbMJOWHr4LctxfoESJwWR3RC7IrV7S1oCXogfqnNQMt2ydg0rnEGA92sQtGzZ9tE32aL4AdSicUxKFWDp_F5LS3ETzedzOi4t243JfRTPK82EZ1hkdSJtCBrwTbtZGmFL6YjdX6Wth01Oij5JdMNNld2nlZL44arkmRgqo_-A"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-32 h-40 bg-surface-variant rounded-xl rotate-[5deg] shadow-lg overflow-hidden border-4 border-white mt-8">
              <img 
                alt="Writing memory" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV_DEk1RghXlDo0Uejz8VDO9zkxgoM3lWeV0zpc7QJwYc5ZZhln_AWXkf1cEGNcnAd9Z4YQo3HXoQTvVYaSe8z3HOiN5yOZLnMglM7yUD-Mprr1_HEiSRgxy0SOSnEysllenbxmM2nhbdDVgvA6wRqbgpfCc2dL4muVdJKhsVQ0kg68twBnBE1MHHcU9XlDvU8zYwt_zOthoPpKsItxhO0U_FFmD1qggQFsTE-LSjVSFg0t9p7SOPk_fSgXsQOGzD6J4hUMPy7Sw"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-surface-container-lowest rounded-[12px] p-8 md:p-10 shadow-[0_8px_32px_rgba(29,28,23,0.08)] border border-outline-variant/20">
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-full mb-6">
              <span className="material-symbols-outlined text-on-primary text-3xl">auto_stories</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">欢迎回家，开启您的传记之旅</h1>
            <p className="text-on-surface-variant text-sm mt-2 font-label">输入手机号快速进入数字化档案库</p>
          </header>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-outline uppercase tracking-wider font-label px-1">手机号码</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-0 bottom-2 text-outline-variant group-focus-within:text-primary transition-colors">smartphone</span>
                <input className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 pt-2 pb-2 pl-8 text-on-surface placeholder:text-outline-variant/60 transition-all font-body text-lg outline-none" placeholder="请输入您的手机号" type="tel" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-outline uppercase tracking-wider font-label px-1">验证码</label>
              <div className="flex items-end gap-4">
                <div className="relative group flex-1">
                  <span className="material-symbols-outlined absolute left-0 bottom-2 text-outline-variant group-focus-within:text-primary transition-colors">verified_user</span>
                  <input className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 pt-2 pb-2 pl-8 text-on-surface placeholder:text-outline-variant/60 transition-all font-body text-lg outline-none" placeholder="6位验证码" type="text" />
                </div>
                <button className="text-primary font-bold text-sm mb-2 hover:opacity-80 transition-opacity whitespace-nowrap px-4 py-2 bg-primary-container/10 rounded-full" type="button">
                  获取验证码
                </button>
              </div>
            </div>
            <div className="pt-6">
              <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all" type="submit">
                <span className="material-symbols-outlined">login</span>
                立即登录
              </button>
            </div>
          </form>
          <footer className="mt-10 pt-8 border-t border-outline-variant/20">
            <div className="flex flex-col gap-4 text-center">
              <button className="text-secondary font-bold hover:underline underline-offset-4 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">share</span>
                社交账号登录
              </button>
              <button className="text-secondary font-bold hover:underline underline-offset-4 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">person_add</span>
                注册新账号
              </button>
            </div>
            <div className="mt-8 flex justify-center gap-6">
              <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>alternate_email</span>
              </button>
            </div>
          </footer>
        </div>
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="text-outline-variant text-4xl font-headline font-black tracking-[0.5em] opacity-20 select-none" style={{ writingMode: 'vertical-rl' }}>
            记录 · 传承 · 启迪
          </div>
        </div>
      </main>
    </div>
  );
}
