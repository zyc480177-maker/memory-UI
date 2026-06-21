import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentProject } = useProject();

  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setDisplayName(user.displayName || '');
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('memoirs_token');
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/v1/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ displayName }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initial = user?.displayName?.[0] ?? user?.email?.[0] ?? '?';

  return (
    <main className="pt-24 pb-20 px-6 md:px-[8.5rem] max-w-4xl mx-auto min-h-screen bg-[#F5F0E8]">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">系统设置</h1>
        <p className="text-on-surface-variant/70">管理您的账号信息</p>
      </header>

      <div className="space-y-6">
        {/* Account card */}
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 p-8">
          <div className="flex items-center gap-6 pb-8 mb-8 border-b border-stone-100">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-black text-primary border-4 border-white shadow-md">
              {initial.toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface">{user?.displayName || user?.email}</h3>
              <p className="text-sm text-stone-400 mt-0.5">{user?.email}</p>
              <span className="mt-2 inline-block text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold">
                Owner · Private Alpha
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5 max-w-md">
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">显示名称</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface transition-all"
                placeholder="请输入显示名称"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">电子邮箱</label>
              <input
                type="email"
                value={user?.email ?? ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed"
              />
              <p className="text-xs text-stone-300 mt-1">邮箱由管理员配置，无法修改</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? '保存中...' : '保存更改'}
              </button>
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  已保存
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Current project info */}
        {currentProject && (
          <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 p-8">
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_open</span>
              当前项目
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-stone-50">
                <span className="text-stone-400">项目名称</span>
                <span className="font-bold text-on-surface">{currentProject.title}</span>
              </div>
              {currentProject.subtitle && (
                <div className="flex justify-between items-center py-2 border-b border-stone-50">
                  <span className="text-stone-400">副标题</span>
                  <span className="text-on-surface">{currentProject.subtitle}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-stone-50">
                <span className="text-stone-400">叙述视角</span>
                <span className="text-on-surface">{currentProject.defaultNarrativeVoice === 'first_person' ? '第一人称' : '第三人称'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-stone-400">创建时间</span>
                <span className="text-on-surface">{new Date(currentProject.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-8">
          <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            账号操作
          </h3>
          <p className="text-sm text-stone-400 mb-5">退出后需重新输入账号密码才能登录。</p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            退出登录
          </button>
        </div>
      </div>
    </main>
  );
}
