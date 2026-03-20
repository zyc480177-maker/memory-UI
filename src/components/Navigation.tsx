import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#F5F0E8] backdrop-blur-md flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50 border-b border-[#8B4513]/10">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-[#8B4513] tracking-tighter">人生传记</span>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 px-2 py-0.5 border border-[#8B4513]/20 rounded">Heirloom</span>
      </div>
      <div className="hidden md:flex gap-10">
        <Link 
          to="/" 
          className={`${isActive('/') ? 'text-[#8B4513] font-bold border-b-2 border-[#8B4513]' : 'text-stone-600 hover:text-[#8B4513]'} pb-1 font-headline text-lg tracking-wide transition-colors`}
        >
          首页
        </Link>
        <Link 
          to="/archive" 
          className={`${isActive('/archive') ? 'text-[#8B4513] font-bold border-b-2 border-[#8B4513]' : 'text-stone-600 hover:text-[#8B4513]'} pb-1 font-headline text-lg tracking-wide transition-colors`}
        >
          我的档案
        </Link>
        <Link 
          to="/timeline" 
          className={`${isActive('/timeline') ? 'text-[#8B4513] font-bold border-b-2 border-[#8B4513]' : 'text-stone-600 hover:text-[#8B4513]'} pb-1 font-headline text-lg tracking-wide transition-colors`}
        >
          岁月长歌
        </Link>
        <Link 
          to="/settings" 
          className={`${isActive('/settings') ? 'text-[#8B4513] font-bold border-b-2 border-[#8B4513]' : 'text-stone-600 hover:text-[#8B4513]'} pb-1 font-headline text-lg tracking-wide transition-colors`}
        >
          设置
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Link to="/notifications" className="text-[#8B4513] hover:bg-[#8B4513]/5 p-2 rounded-full transition-all text-xl block" title="通知">
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F5F0E8]"></span>
          </Link>
          
          {/* Notification Popover */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#8B4513]/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] p-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
              <span className="font-bold text-sm text-[#8B4513]">最新通知</span>
              <Link to="/notifications" className="text-[10px] text-primary font-bold hover:underline">查看全部</Link>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 items-start p-2 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface">整理建议：补全1975年的回忆</p>
                  <p className="text-[9px] text-stone-400 mt-0.5">2小时前</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-2 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">sync</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface">传记生成进度更新</p>
                  <p className="text-[9px] text-stone-400 mt-0.5">5小时前</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link to="/login" className="text-[#8B4513] hover:bg-[#8B4513]/5 p-2 rounded-full transition-all text-xl" title="个人中心">👤</Link>
      </div>
    </nav>
  );
};

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="hidden fixed left-0 top-1/2 -translate-y-1/2 z-[60] md:flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsExpanded(false);
      }}
    >
      {/* Trigger Area / Collapsed Strip */}
      <div className="w-6 h-64 cursor-pointer flex items-center justify-center group relative">
        <AnimatePresence>
          {isHovered && !isExpanded && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="bg-[#8B4513] text-white w-8 h-16 rounded-r-2xl flex items-center justify-center shadow-2xl hover:bg-[#6C2F00] transition-all absolute left-0 z-50"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Actual Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isExpanded ? 72 : 0,
          opacity: isExpanded ? 1 : 0,
          x: isExpanded ? 0 : -20,
          marginLeft: isExpanded ? 8 : 0
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="overflow-hidden flex flex-col bg-[#F5F0E8] h-auto border border-[#8B4513]/10 rounded-full shadow-[0_10px_40px_rgba(139,69,19,0.1)] py-8 items-center gap-8"
      >
        <div className="flex flex-col items-center gap-8 px-4">
          <button className="bg-[#8B4513]/10 text-[#8B4513] p-3 rounded-full hover:bg-[#8B4513]/20 transition-all whitespace-nowrap" title="项目选择">
            <span className="material-symbols-outlined">folder_open</span>
          </button>
          <Link to="/analytics" className="text-stone-500 hover:text-[#8B4513] p-3 rounded-full hover:bg-[#8B4513]/5 transition-all whitespace-nowrap" title="状态展示">
            <span className="material-symbols-outlined">analytics</span>
          </Link>
          <Link to="/quick-actions" className="text-stone-500 hover:text-[#8B4513] p-3 rounded-full hover:bg-[#8B4513]/5 transition-all whitespace-nowrap" title="快捷操作">
            <span className="material-symbols-outlined">bolt</span>
          </Link>
          <Link to="/settings" className="text-stone-500 hover:text-[#8B4513] p-3 rounded-full hover:bg-[#8B4513]/5 transition-all whitespace-nowrap" title="系统设置">
            <span className="material-symbols-outlined">settings</span>
          </Link>
        </div>
      </motion.aside>
    </div>
  );
};

export const MobileNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F5F0E8]/90 backdrop-blur-md border-t border-primary/5 px-6 py-3 flex justify-around items-center z-50">
      <Link to="/" className="flex flex-col items-center gap-1 text-primary">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        <span className="text-[10px] font-bold">首页</span>
      </Link>
      <Link to="/archive" className="flex flex-col items-center gap-1 text-stone-400">
        <span className="material-symbols-outlined">book</span>
        <span className="text-[10px]">档案</span>
      </Link>
      <Link to="/timeline" className="flex flex-col items-center gap-1 text-stone-400">
        <span className="material-symbols-outlined">history_edu</span>
        <span className="text-[10px]">岁月</span>
      </Link>
      <Link to="/settings" className="flex flex-col items-center gap-1 text-stone-400">
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px]">设置</span>
      </Link>
    </nav>
  );
};
