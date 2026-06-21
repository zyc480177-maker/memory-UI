import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentProject } = useProject();

  const isActive = (path: string) => location.pathname === path;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initial = user?.displayName?.[0] ?? user?.email?.[0] ?? '?';

  return (
    <nav className="bg-[#F5F0E8] backdrop-blur-md flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50 border-b border-[#8B4513]/10">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl font-bold text-[#8B4513] tracking-tighter">人生传记</span>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 px-2 py-0.5 border border-[#8B4513]/20 rounded">Heirloom</span>
        </Link>
        {currentProject && (
          <span className="hidden md:inline-block text-[11px] text-stone-400 pl-3 border-l border-stone-200">
            {currentProject.title}
          </span>
        )}
      </div>

      <div className="hidden md:flex gap-8">
        {[
          { to: '/', label: '首页' },
          { to: '/archive', label: '我的档案' },
          { to: '/timeline', label: '岁月长歌' },
          { to: '/writing', label: '写作' },
          { to: '/preview', label: '预览' },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`${isActive(to) ? 'text-[#8B4513] font-bold border-b-2 border-[#8B4513]' : 'text-stone-600 hover:text-[#8B4513]'} pb-1 text-base tracking-wide transition-colors no-underline`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#8B4513]/5 transition-colors no-underline"
              title={user.displayName || user.email}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {initial.toUpperCase()}
              </div>
              <span className="hidden md:inline text-sm text-stone-600 font-medium">{user.displayName || user.email}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="退出登录"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export const MobileNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F5F0E8]/90 backdrop-blur-md border-t border-primary/5 px-2 py-3 flex justify-around items-center z-50">
      {[
        { to: '/', icon: 'home', label: '首页' },
        { to: '/archive', icon: 'book', label: '档案' },
        { to: '/timeline', icon: 'history_edu', label: '岁月' },
        { to: '/writing', icon: 'edit_note', label: '写作' },
        { to: '/settings', icon: 'settings', label: '设置' },
      ].map(({ to, icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center gap-1 no-underline ${isActive(to) ? 'text-primary' : 'text-stone-400'}`}
        >
          <span className="material-symbols-outlined" style={isActive(to) ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            {icon}
          </span>
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
};
