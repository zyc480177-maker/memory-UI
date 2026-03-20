import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Timeline() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  return (
    <div className="bg-[#F5F0E8] min-h-screen">
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#8B4513] mb-4 tracking-widest">岁月长歌</h1>
          <p className="text-stone-500 text-lg italic">每一段回忆，都是一颗璀璨的星辰</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/archive" className="px-6 py-2 bg-white border border-[#8B4513]/20 rounded-full text-sm font-bold text-[#8B4513] hover:bg-[#8B4513]/5 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">folder_open</span>
              管理我的档案
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full timeline-line opacity-20"></div>
          
          <div className="space-y-32">
            {/* Node 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="w-full md:w-[42%] text-center md:text-right order-2 md:order-1 mt-6 md:mt-0">
                <span className="text-sm font-medium text-[#5C7A4E] mb-2 block tracking-widest uppercase">出生</span>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-3">1952 · 呱呱坠地</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">在那个充满希望的春天，世界迎来了新的生命。这是您不凡旅程的起点。</p>
                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  <span className="px-3 py-1 bg-white border border-[#8B4513]/10 rounded-full text-[10px] text-stone-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">link</span>
                    关联档案: 老屋的门槛
                  </span>
                </div>
              </div>
              <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#8B4513] text-white border-4 border-[#F5F0E8] order-1 md:order-2 shadow-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => setSelectedNode(1)}>
                <span className="material-symbols-outlined text-2xl">child_care</span>
              </div>
              <div className="w-full md:w-[42%] order-3 flex justify-center md:justify-start mt-6 md:mt-0">
                <div className="w-56 h-56 p-2 rounded-sm rotate-2 group-hover:rotate-0 transition-transform duration-500 flex flex-col items-center justify-center border-8 border-white bg-stone-100 shadow-xl overflow-hidden">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHsmwSuUOdov9r3Ke6UuBSnPWvqolijcBpL7OeJpf-qgfZ12F9oXAoh0IiN8lVaK0bDxi3WhD42odkkhDbhkBW3nW2uBMTKiUpzYONVl_e_PfaYUHLzwTfx31LTVYNHV-I3qngg0IKQ_hym-cie9T3cuPVHdT7MSBswqZr1nTrHP2kaBNDy7KxYI016mXfLLFeeXOmMz8GjWjPlifqVBLjywd4RoqnvurXqh37E4hYAJRqMukh8LP9DXx6qwfMLyMk9yTQK4p-2g"
                    className="w-full h-full object-cover grayscale-[0.2]"
                    alt="Baby photo"
                  />
                </div>
              </div>
            </div>

            {/* Node 2 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="w-full md:w-[42%] order-3 md:order-1 flex justify-center md:justify-end mt-6 md:mt-0">
                <div className="w-56 h-56 p-2 rounded-sm -rotate-2 group-hover:rotate-0 transition-transform duration-500 flex flex-col items-center justify-center border-8 border-white bg-stone-100 shadow-xl overflow-hidden">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcTRxe_4w0cKstNys9YEThr-PoFvWI5v51bxVmyR-_-04nzIMdt71YJ59h2kkmN_xfkoKXauZGjKQTWE4hx6h3MuZ2Q2eGHjwy14ZLCQQAmbiotDhkvdIpdHm-Wvj_QkVMuYQS652Ur5HPFQmLCBjkDdLgkgwJmguvUHdQVWt5PDWx7PgRTMP5cl7GTh_bSJCt9gxED5cHViNDpcxINMPi99IVCS_pJNy-qoT7YC9m6SONip-Wvu4fkgBL7401HRNlVlUwl1pTIw"
                    className="w-full h-full object-cover grayscale-[0.2]"
                    alt="School photo"
                  />
                </div>
              </div>
              <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#8B4513] text-white border-4 border-[#F5F0E8] order-1 md:order-2 shadow-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => setSelectedNode(2)}>
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div className="w-full md:w-[42%] text-center md:text-left order-2 md:order-3 mt-6 md:mt-0">
                <span className="text-sm font-medium text-[#5C7A4E] mb-2 block tracking-widest uppercase">求学</span>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-3">1970 · 书香岁月</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">青葱校园，笔墨留香。那是知识启蒙的年代，也是梦想扎根的土壤。</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-white border border-[#8B4513]/10 rounded-full text-[10px] text-stone-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">link</span>
                    关联档案: 县中学的午后
                  </span>
                </div>
              </div>
            </div>

            {/* Node 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="w-full md:w-[42%] text-center md:text-right order-2 md:order-1 mt-6 md:mt-0">
                <span className="text-sm font-medium text-[#5C7A4E] mb-2 block tracking-widest uppercase">事业</span>
                <h3 className="text-2xl font-bold text-[#8B4513] mb-3">1982 · 事业启航</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">步入社会，满怀憧憬。在改革发展的浪潮中，您用汗水书写着奋斗的故事。</p>
                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  <button className="px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-[10px] text-primary font-bold flex items-center gap-1 hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-[12px]">add</span>
                    从档案中添加内容
                  </button>
                </div>
              </div>
              <div className="z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#8B4513] text-white border-4 border-[#F5F0E8] order-1 md:order-2 shadow-lg cursor-pointer hover:scale-110 transition-transform" onClick={() => setSelectedNode(3)}>
                <span className="material-symbols-outlined text-2xl">work</span>
              </div>
              <div className="w-full md:w-[42%] order-3 flex justify-center md:justify-start mt-6 md:mt-0">
                <div className="w-56 h-56 p-4 rounded-sm rotate-3 group-hover:rotate-0 transition-transform duration-500 flex flex-col items-center justify-center border-4 border-white bg-stone-200 shadow-sm">
                  <span className="material-symbols-outlined text-4xl text-stone-400 mb-2">photo_camera</span>
                  <span className="text-xs text-stone-400">职业生涯记录</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 text-center">
          <div className="inline-block p-12 bg-surface-container-low rounded-xl border border-[#8B4513]/5 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-on-surface-variant mb-8 text-lg">点击下方按钮，我们将为您珍藏的一生回忆，汇集成一卷流传千古的数字传记。</p>
              <Link to="/biography-book" className="h-14 px-10 bg-[#8B4513] hover:bg-[#6c2f00] text-white rounded-full flex items-center justify-center gap-3 mx-auto transition-all shadow-lg active:scale-95 group no-underline">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                <span className="text-lg font-bold tracking-widest">编撰成册</span>
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[12rem]">history_edu</span>
            </div>
          </div>
        </div>
      </main>

      {/* Chapter Detail Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#F5F0E8] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-[#8B4513]/10 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#8B4513]">章节详情：{selectedNode === 1 ? '呱呱坠地' : selectedNode === 2 ? '书香岁月' : '事业启航'}</h2>
                <button onClick={() => setSelectedNode(null)} className="text-stone-400 hover:text-stone-600">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                <div>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">已关联的档案</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-xl border border-[#8B4513]/5 flex items-center gap-3 group hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHsmwSuUOdov9r3Ke6UuBSnPWvqolijcBpL7OeJpf-qgfZ12F9oXAoh0IiN8lVaK0bDxi3WhD42odkkhDbhkBW3nW2uBMTKiUpzYONVl_e_PfaYUHLzwTfx31LTVYNHV-I3qngg0IKQ_hym-cie9T3cuPVHdT7MSBswqZr1nTrHP2kaBNDy7KxYI016mXfLLFeeXOmMz8GjWjPlifqVBLjywd4RoqnvurXqh37E4hYAJRqMukh8LP9DXx6qwfMLyMk9yTQK4p-2g" className="w-full h-full object-cover" alt="Archive" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold block">老照片：满月留念</span>
                        <span className="text-[10px] text-stone-400">1952年4月</span>
                      </div>
                      <span className="material-symbols-outlined text-stone-300 group-hover:text-primary">arrow_forward</span>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#8B4513]/5 flex items-center gap-3 group hover:border-primary/30 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">mic</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold block">语音：母亲的回忆</span>
                        <span className="text-[10px] text-stone-400">2:45 · 录制于2024</span>
                      </div>
                      <span className="material-symbols-outlined text-stone-300 group-hover:text-primary">arrow_forward</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[#8B4513]/5 rounded-2xl border border-dashed border-[#8B4513]/20">
                    <h4 className="text-sm font-bold text-[#8B4513] mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">link</span>
                      从“我的档案”中导入
                    </h4>
                    <p className="text-xs text-stone-500 mb-4">系统发现您还有 2 份与此章节相关的档案尚未关联。</p>
                    <Link to="/archive" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                      前往档案中心整理 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-[#8B4513]/10 shadow-sm">
                    <h4 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-secondary">add_circle</span>
                      新增档案内容
                    </h4>
                    <p className="text-xs text-stone-500 mb-4">直接为此章节添加新的回忆点，内容将同步保存至档案库。</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button className="py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold transition-colors flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-sm">mic</span>
                        口述
                      </button>
                      <button className="py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold transition-colors flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                        拍照
                      </button>
                      <button className="py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold transition-colors flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-sm">videocam</span>
                        视频
                      </button>
                      <button className="py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-[10px] font-bold transition-colors flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-sm">edit_note</span>
                        文字
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 py-12 border-t border-[#8B4513]/10 text-center">
        <p className="text-stone-400 text-sm font-label tracking-widest">人生传记 · 数字遗产服务 · 2024</p>
      </footer>
    </div>
  );
}
