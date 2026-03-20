import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: '童年', count: 12, color: '#8B4513' },
  { name: '求学', count: 18, color: '#A0522D' },
  { name: '知青', count: 25, color: '#CD853F' },
  { name: '成家', count: 15, color: '#DEB887' },
  { name: '立业', count: 22, color: '#F4A460' },
  { name: '新世纪', count: 10, color: '#D2B48C' },
];

export default function Analytics() {
  return (
    <main className="pt-32 pb-20 px-6 md:px-[8.5rem] max-w-7xl mx-auto min-h-screen">
      <div className="parchment-texture"></div>
      
      <header className="mb-12">
        <div className="flex items-center gap-3 text-secondary font-bold mb-4">
          <span className="material-symbols-outlined">analytics</span>
          <span className="tracking-widest uppercase text-sm">状态展示</span>
        </div>
        <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">创作数据分析</h1>
        <p className="text-on-surface-variant font-medium">了解您的传记创作进度与内容分布</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
          <span className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">总字数</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-on-surface">24,582</span>
            <span className="text-sm text-on-surface-variant mb-1">字</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>较上周增加 12%</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
          <span className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">收录档案</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-on-surface">156</span>
            <span className="text-sm text-on-surface-variant mb-1">份</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>本月新增 24 份</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
          <span className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">AI 润色次数</span>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-on-surface">42</span>
            <span className="text-sm text-on-surface-variant mb-1">次</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-sm">magic_button</span>
            <span>平均润色率 85%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-8">各章节内容分布</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E3E0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8E9299', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E9299', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(139, 69, 19, 0.05)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-8">最近活动</h3>
          <div className="space-y-6">
            {[
              { time: '10:24 AM', action: '上传了 3 张“知青岁月”照片', icon: 'image' },
              { time: '昨天 08:15 PM', action: '完成了“插队的第一年”章节润色', icon: 'magic_button' },
              { time: '前天 02:30 PM', action: '录制了 5 分钟关于“永定河”的语音', icon: 'mic' },
              { time: '3天前', action: '创建了新章节“新世纪的曙光”', icon: 'add_circle' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-outline group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">{item.action}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{item.time}</p>
                </div>
                <span className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
