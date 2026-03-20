import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Archive() {
  const [activeTab, setActiveTab] = useState<'overview' | 'footprints' | 'suggestions'>('overview');

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <aside className="bg-[#F5F0E8] flex flex-col h-[calc(100vh-72px)] p-6 gap-4 w-72 border-r border-[#8B4513]/10 sticky top-[72px] shadow-[0_10px_40px_rgba(139,69,19,0.06)] z-30">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#8B4513]">档案管理</h2>
          <p className="text-xs text-stone-500 mt-1">Digital Heirloom</p>
        </div>
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'overview' ? 'bg-[#8B4513]/10 text-[#8B4513] font-bold' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            <span className="material-symbols-outlined">folder_open</span>
            <span>档案总览</span>
          </button>
          <button 
            onClick={() => setActiveTab('footprints')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'footprints' ? 'bg-[#8B4513]/10 text-[#8B4513] font-bold' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span>时光足迹</span>
          </button>
          <button 
            onClick={() => setActiveTab('suggestions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'suggestions' ? 'bg-[#8B4513]/10 text-[#8B4513] font-bold' : 'text-stone-500 hover:bg-stone-100'}`}
          >
            <span className="material-symbols-outlined">bolt</span>
            <span>整理建议</span>
          </button>
        </nav>
        <Link to="/writing" className="w-full bg-gradient-to-br from-primary to-[#8B4513] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all no-underline">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-bold">续写华章</span>
        </Link>
      </aside>

      <main className="flex-1 p-12 bg-[#F5F0E8]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <header className="mb-12">
                <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">我的档案</h1>
                <p className="text-on-surface-variant/70 italic">记录生命中的每一个珍贵瞬间</p>
              </header>

              <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {['语音录入', '照片扫描', '视频档案', '文字撰写'].map((item, idx) => (
                  <div key={idx} className="bg-surface-container-low p-6 rounded-2xl flex flex-col items-center gap-3 border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">{['mic', 'scanner', 'videocam', 'edit_note'][idx]}</span>
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                    <span className="text-[12px] text-stone-400">{['口述回忆', '数字化老照片', '录制影像', '执笔书写'][idx]}</span>
                  </div>
                ))}
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 group border border-[#8B4513]/5 relative">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container">
                    <img 
                      alt="Childhood photo" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHsmwSuUOdov9r3Ke6UuBSnPWvqolijcBpL7OeJpf-qgfZ12F9oXAoh0IiN8lVaK0bDxi3WhD42odkkhDbhkBW3nW2uBMTKiUpzYONVl_e_PfaYUHLzwTfx31LTVYNHV-I3qngg0IKQ_hym-cie9T3cuPVHdT7MSBswqZr1nTrHP2kaBNDy7KxYI016mXfLLFeeXOmMz8GjWjPlifqVBLjywd4RoqnvurXqh37E4hYAJRqMukh8LP9DXx6qwfMLyMk9yTQK4p-2g"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase tracking-widest text-[#8B4513]/60 font-bold">1952 · 童年</span>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <span className="material-symbols-outlined text-[12px]">check_circle</span>
                        已汇总至岁月长歌
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mt-1">老屋的门槛</h3>
                    <p className="text-on-surface-variant/80 mt-2 line-clamp-2">那时候的门槛很高，我总喜欢坐在上面看屋外的雨落到石阶上...</p>
                  </div>
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white">
                    <span className="material-symbols-outlined text-[#8B4513] text-sm">more_vert</span>
                  </button>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 group border border-[#8B4513]/5 relative">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-surface-container">
                    <img 
                      alt="School years" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcTRxe_4w0cKstNys9YEThr-PoFvWI5v51bxVmyR-_-04nzIMdt71YJ59h2kkmN_xfkoKXauZGjKQTWE4hx6h3MuZ2Q2eGHjwy14ZLCQQAmbiotDhkvdIpdHm-Wvj_QkVMuYQS652Ur5HPFQmLCBjkDdLgkgwJmguvUHdQVWt5PDWx7PgRTMP5cl7GTh_bSJCt9gxED5cHViNDpcxINMPi99IVCS_pJNy-qoT7YC9m6SONip-Wvu4fkgBL7401HRNlVlUwl1pTIw"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase tracking-widest text-[#8B4513]/60 font-bold">1965 · 求学</span>
                      <button className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline">
                        <span className="material-symbols-outlined text-[12px]">sync</span>
                        汇总至岁月长歌
                      </button>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mt-1">县中学的午后</h3>
                    <p className="text-on-surface-variant/80 mt-2 line-clamp-2">夏天的蝉鸣声和老师的粉笔声交织在一起，那是我记忆中最安静的午后。</p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 relative border-l-4 border-[#8B4513] border-t border-r border-b border-[#8B4513]/5">
                  <div className="aspect-video w-full rounded-lg flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant/40 border border-dashed border-outline-variant">
                    <span className="material-symbols-outlined text-5xl mb-2">photo_camera</span>
                    <span className="text-xs">添加第一份工作的影像记录</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] uppercase tracking-widest text-[#8B4513] font-black">1970 · 事业起步</span>
                      <span className="text-[10px] text-[#8B4513] font-bold">已完成 45%</span>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface mt-1">第一份工作：县城供销社</h3>
                    <div className="w-full bg-surface-container-high h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-[#8B4513] h-full w-[45%] rounded-full"></div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <span className="px-2 py-1 bg-secondary-container/20 text-[#5C7A4E] text-[10px] rounded">待扫码照片</span>
                      <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-[10px] rounded">访谈片段</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'footprints' && (
            <motion.div
              key="footprints"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <header className="mb-12">
                <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">时光足迹</h1>
                <p className="text-on-surface-variant/70 italic">回顾您的回忆录入历程</p>
              </header>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-[#8B4513]/5">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">timeline</span>
                      录入频率统计
                    </h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold text-stone-500">周</button>
                      <button className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-bold">月</button>
                    </div>
                  </div>
                  <div className="h-64 flex items-end gap-2 px-4">
                    {[40, 70, 45, 90, 65, 80, 50, 60, 85, 40, 55, 75].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-primary/10 rounded-t-lg relative group">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            className="w-full bg-primary rounded-t-lg group-hover:bg-[#6C2F00] transition-colors"
                          ></motion.div>
                        </div>
                        <span className="text-[8px] text-stone-400 rotate-45 mt-2">{i + 1}月</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 grid grid-cols-3 gap-4 border-t border-stone-100 pt-8">
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#8B4513]">128</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">总档案数</p>
                    </div>
                    <div className="text-center border-x border-stone-100">
                      <p className="text-2xl font-black text-[#8B4513]">12.5h</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">录音时长</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-[#8B4513]">452</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">照片数量</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#8B4513]/5">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">history</span>
                    最近足迹
                  </h3>
                  <div className="space-y-6">
                    {[
                      { title: '录制了“童年趣事”语音', time: '10分钟前', icon: 'mic', color: 'bg-blue-50 text-blue-500' },
                      { title: '扫描了“1980年全家福”', time: '昨天', icon: 'photo_camera', color: 'bg-amber-50 text-amber-500' },
                      { title: '完善了“求学时代”文字', time: '3天前', icon: 'edit_note', color: 'bg-emerald-50 text-emerald-500' },
                      { title: '生成了第一版“岁月长歌”', time: '1周前', icon: 'auto_stories', color: 'bg-purple-50 text-purple-500' },
                      { title: '添加了“第一份工作”标签', time: '2周前', icon: 'label', color: 'bg-stone-50 text-stone-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <span className="material-symbols-outlined text-sm">{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-on-surface">{item.title}</p>
                          <p className="text-[10px] text-stone-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 py-3 border border-stone-200 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-50 transition-colors">
                    查看完整历史
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <header className="mb-12">
                <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">整理建议</h1>
                <p className="text-on-surface-variant/70 italic">AI 助您打造更完美的传记</p>
              </header>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 flex gap-6 items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0 relative z-10">
                      <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-primary mb-2">补全“知青岁月”章节</h3>
                      <p className="text-on-surface-variant leading-relaxed mb-6">
                        我们注意到您在1972年至1975年间的记录较为单一。建议您可以尝试回忆一下当时的饮食习惯、或是与当地老乡的互动故事，这些细节能让传记更加生动。
                      </p>
                      <div className="flex gap-3">
                        <button className="px-6 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-[#6C2F00] transition-colors shadow-lg shadow-primary/20">
                          立即开始回忆
                        </button>
                        <button className="px-6 py-2 bg-white border border-primary/20 text-primary rounded-full font-bold text-sm hover:bg-primary/5 transition-colors">
                          稍后提醒
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#8B4513]/5 hover:border-primary/30 transition-all hover:shadow-md cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary-container/10 text-secondary flex items-center justify-center">
                          <span className="material-symbols-outlined">auto_fix_high</span>
                        </div>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">智能润色</span>
                      </div>
                      <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">优化“老屋回忆”段落</h4>
                      <p className="text-sm text-on-surface-variant mb-4">AI 建议增加一些感官描写，让读者仿佛能闻到老屋里的木头香味。</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                        <span>查看修改建议</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-[#8B4513]/5 hover:border-primary/30 transition-all hover:shadow-md cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                          <span className="material-symbols-outlined">photo_library</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">档案关联</span>
                      </div>
                      <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">关联未分类照片</h4>
                      <p className="text-sm text-on-surface-variant mb-4">您有 5 张最近上传的照片尚未关联到具体章节，建议尽快整理。</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                        <span>去分类</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#8B4513]/5">
                  <h3 className="text-xl font-bold mb-6">回忆引导问题</h3>
                  <div className="space-y-4">
                    {[
                      '您小时候最喜欢的玩具是什么？',
                      '第一份工资您是怎么花的？',
                      '您还记得老家门前的那棵树吗？',
                      '最难忘的一次远行是去哪里？'
                    ].map((q, i) => (
                      <div key={i} className="p-4 bg-stone-50 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/10">
                        <p className="text-sm text-on-surface leading-snug">{q}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 bg-stone-100 text-stone-500 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors">
                    换一批问题
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
