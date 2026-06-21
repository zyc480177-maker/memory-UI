import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { projectsApi } from '../api';
import { Project, SubjectProfile } from '../types/domain';

export default function Home() {
  const { user } = useAuth();
  const { projects, currentProject, refreshProjects, setCurrentProject, loading } = useProject();
  const navigate = useNavigate();
  const [showNewProject, setShowNewProject] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => { refreshProjects(); }, []);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    setCreating(true);
    try {
      const { project } = await projectsApi.create({
        title: newProjectTitle,
        subject: subjectName ? { fullName: subjectName } : undefined,
      });
      await refreshProjects();
      setCurrentProject(project);
      setShowNewProject(false);
      setNewProjectTitle('');
      setSubjectName('');
      navigate('/capture');
    } finally {
      setCreating(false);
    }
  }

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
      </div>
    );
  }

  // Empty state — no projects yet
  if (!loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-surface pt-24 pb-20 px-6 md:px-[8.5rem] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-5xl text-primary">auto_stories</span>
          </div>
          <h1 className="text-3xl font-black text-on-surface mb-4">开始您的传记</h1>
          <p className="text-on-surface-variant/70 mb-10 leading-relaxed">
            每个人都有值得记录的故事。<br />创建您的第一个回忆录项目，让 AI 帮您把记忆变成文字。
          </p>

          {showNewProject ? (
            <form onSubmit={handleCreateProject} className="bg-white rounded-2xl p-6 shadow-lg text-left space-y-4">
              <h3 className="font-bold text-on-surface">新建传记项目</h3>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">传记标题</label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="例如：父亲的故事"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-1">主人公姓名</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="这份传记写的是谁？"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-on-surface"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewProject(false)} className="flex-1 py-3 border border-stone-200 rounded-xl text-stone-500 font-bold hover:bg-stone-50 transition-colors">取消</button>
                <button type="submit" disabled={creating} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {creating ? '创建中...' : '开始创作'}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowNewProject(true)}
              className="px-10 py-4 bg-gradient-to-br from-primary to-[#6C2F00] text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
            >
              创建第一个项目
            </button>
          )}
        </div>
      </div>
    );
  }

  const project = currentProject ?? projects[0];

  return (
    <div className="pt-24 pb-20 px-6 md:px-[8.5rem] relative min-h-screen">
      <div className="parchment-texture"></div>

      <header className="mt-12 mb-16 relative">
        <div className="max-w-4xl">
          <span className="text-secondary font-medium tracking-[0.3em] text-sm mb-4 block">良辰美景 · 岁月安好</span>
          <h1 className="text-5xl md:text-6xl font-black text-on-surface leading-tight mb-6">
            欢迎回来，<span className="text-primary">{user?.displayName || '传记者'}</span>
          </h1>
          {project && (
            <p className="text-lg text-on-surface-variant/80 max-w-2xl leading-[1.8]">
              当前项目：<strong className="text-primary">{project.title}</strong>
              {project.phase === 'collecting' && ' — 素材收集阶段，上传更多回忆吧。'}
              {project.phase === 'organizing' && ' — 整理阶段，确认您的事件时间线。'}
              {project.phase === 'writing' && ' — 写作阶段，继续完善您的章节。'}
              {project.phase === 'exporting' && ' — 准备导出您的回忆录。'}
            </p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Project Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="bg-surface-container-low rounded-3xl p-8 shadow-[0_10px_40px_rgba(139,69,19,0.06)] relative overflow-hidden group border border-outline-variant/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">auto_stories</span>
              {project?.title ?? '传记项目'}
            </h3>

            {/* Project phase indicator */}
            {project && (
              <div className="grid grid-cols-4 gap-1 mb-6">
                {(['collecting', 'organizing', 'writing', 'exporting'] as const).map((phase, i) => {
                  const phases = ['collecting', 'organizing', 'writing', 'exporting'];
                  const currentIdx = phases.indexOf(project.phase);
                  const isActive = phases.indexOf(phase) <= currentIdx;
                  const labels = ['采集', '整理', '写作', '导出'];
                  return (
                    <div key={phase} className="text-center">
                      <div className={`h-1.5 rounded-full mb-1 ${isActive ? 'bg-primary' : 'bg-stone-200'}`}></div>
                      <span className={`text-[9px] font-bold tracking-widest ${isActive ? 'text-primary' : 'text-stone-300'}`}>{labels[i]}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="text-sm text-on-surface-variant italic mb-6">
              "每一份素材都是宝贵的记忆，让我们一起把它们整理成故事。"
            </p>
            <Link to="/capture" className="block w-full py-4 bg-gradient-to-br from-primary to-[#6C2F00] text-white rounded-xl font-bold tracking-wide text-center active:scale-95 transition-transform shadow-lg shadow-primary/20 no-underline">
              添加新素材
            </Link>
          </section>

          {/* Project switcher */}
          {projects.length > 1 && (
            <section className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
              <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-secondary">folder_open</span>
                切换项目
              </h3>
              <div className="space-y-2">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentProject(p)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-bold ${p.id === project?.id ? 'bg-primary/10 text-primary' : 'hover:bg-stone-100 text-on-surface'}`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowNewProject(true)}
                className="mt-3 w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-stone-400 hover:bg-stone-100 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                新建项目
              </button>
              {showNewProject && (
                <form onSubmit={handleCreateProject} className="mt-4 space-y-3 pt-4 border-t border-stone-100">
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="传记标题"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowNewProject(false)} className="flex-1 py-2 border border-stone-200 rounded-lg text-xs text-stone-500">取消</button>
                    <button type="submit" disabled={creating} className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold disabled:opacity-60">{creating ? '创建中...' : '创建'}</button>
                  </div>
                </form>
              )}
            </section>
          )}

          <section className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">bolt</span>
              快捷操作
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/timeline" className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group no-underline text-on-surface">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">history_edu</span>
                <span className="text-xs font-bold">时间轴</span>
              </Link>
              <Link to="/writing" className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group no-underline text-on-surface">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">edit_note</span>
                <span className="text-xs font-bold">写章节</span>
              </Link>
              <Link to="/archive" className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group no-underline text-on-surface">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">photo_library</span>
                <span className="text-xs font-bold">我的档案</span>
              </Link>
              <Link to="/preview" className="flex flex-col items-center gap-2 p-4 bg-surface-container rounded-2xl hover:bg-primary/5 hover:text-primary transition-all group no-underline text-on-surface">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">preview</span>
                <span className="text-xs font-bold">预览导出</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Right: Capture entry + intro */}
        <div className="lg:col-span-8 flex flex-col gap-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/capture?mode=voice" className="group flex flex-col items-center justify-center p-8 bg-surface-container rounded-2xl transition-all hover:bg-surface-container-high hover:translate-y-[-4px] active:scale-[0.98] border border-outline-variant/5 no-underline">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              </div>
              <span className="text-lg font-bold text-on-surface">记录语音</span>
              <span className="text-sm text-on-surface-variant mt-1">讲述一段往事</span>
            </Link>
            <Link to="/capture?mode=photo" className="group flex flex-col items-center justify-center p-8 bg-secondary/5 rounded-2xl transition-all hover:bg-secondary/10 hover:translate-y-[-4px] active:scale-[0.98] border border-secondary/5 no-underline">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <span className="material-symbols-outlined text-3xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
              </div>
              <span className="text-lg font-bold text-on-surface">扫描相片</span>
              <span className="text-sm text-on-surface-variant mt-1">定格旧日时光</span>
            </Link>
            <Link to="/capture?mode=text" className="group flex flex-col items-center justify-center p-8 bg-surface-container rounded-2xl transition-all hover:bg-surface-container-high hover:translate-y-[-4px] active:scale-[0.98] border border-outline-variant/5 no-underline">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
              </div>
              <span className="text-lg font-bold text-on-surface">文字叙事</span>
              <span className="text-sm text-on-surface-variant mt-1">书写心中感悟</span>
            </Link>
          </div>

          {/* What happens next */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-on-surface">素材如何变成回忆录？</h2>
              <div className="h-1 w-12 bg-primary mt-2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: 'upload', label: '上传素材', desc: '照片、语音、文字均可', color: 'text-primary bg-primary/10' },
                { icon: 'psychology', label: 'AI 分析', desc: '自动提取人物、时间、情感', color: 'text-secondary bg-secondary/10' },
                { icon: 'event_note', label: '生成事件', desc: '整理成可编辑的人生事件', color: 'text-primary bg-primary/10' },
                { icon: 'menu_book', label: '写成章节', desc: 'AI 起草，您来修改完善', color: 'text-secondary bg-secondary/10' },
              ].map((step, i) => (
                <div key={i} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${step.color}`}>
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-1">{step.label}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
