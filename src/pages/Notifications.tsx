import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const notifications = [
  {
    id: 1,
    type: 'suggestion',
    title: '整理建议：补全1975年的回忆',
    description: '系统检测到您在1975年（下乡时期）的档案较为稀疏，建议添加一些当时的劳动场景描述。',
    time: '2小时前',
    icon: 'bolt',
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    id: 2,
    type: 'system',
    title: '传记生成进度更新',
    description: '您的数字传记“岁月长歌”已自动同步了最近添加的3份档案，目前完成度已达68%。',
    time: '5小时前',
    icon: 'sync',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    id: 3,
    type: 'milestone',
    title: '达成里程碑：万字长文',
    description: '恭喜！您的传记文字量已突破10,000字，这是一段了不起的记录历程。',
    time: '昨天',
    icon: 'workspace_premium',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    id: 4,
    type: 'archive',
    title: '档案待分类',
    description: '您上周上传的“老屋合影”尚未关联至具体章节，点击前往分类。',
    time: '2天前',
    icon: 'folder_zip',
    color: 'text-[#8B4513]',
    bg: 'bg-[#8B4513]/5'
  }
];

export default function Notifications() {
  return (
    <div className="pt-24 pb-20 px-6 md:px-[8.5rem] min-h-screen bg-[#F5F0E8]">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">通知中心</h1>
        <p className="text-on-surface-variant/70 italic">关注您的传记动态与整理建议</p>
      </header>

      <div className="max-w-3xl space-y-4">
        {notifications.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-[#8B4513]/5 flex gap-6 items-start hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                <span className="text-xs text-stone-400">{item.time}</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">{item.description}</p>
              <div className="mt-4 flex gap-4">
                <button className="text-sm font-bold text-primary hover:underline">立即处理</button>
                <button className="text-sm font-medium text-stone-400 hover:text-stone-600">忽略</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-surface-container-low rounded-3xl border border-dashed border-[#8B4513]/20 text-center">
        <p className="text-stone-500 mb-4">没有更多通知了</p>
        <Link to="/" className="text-primary font-bold hover:underline">返回首页</Link>
      </div>
    </div>
  );
}
