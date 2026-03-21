# 03_INFORMATION_ARCHITECTURE

- 状态：Draft locked from constitution v0.1
- 版本：v0.1
- 日期：2026-03-21
- 依赖上游：[01_PRODUCT_CONSTITUTION.md](d:/memory-UI/01_PRODUCT_CONSTITUTION.md), [02_DOMAIN_MODEL.md](d:/memory-UI/02_DOMAIN_MODEL.md)

## 1. 目的

本文件定义 V0-V1 阶段的页面层级、导航结构、页面职责、关键用户路径与现有 UI 页面去留。

目标不是重新设计产品，而是把现有 UI 固定成真实产品的信息结构。

## 2. IA 原则

1. 以项目为容器组织内容。
2. 以事件为叙事核心组织写作。
3. 以任务闭环组织入口，不以“功能炫技”组织入口。
4. 不在 V1 暴露过多低频页面。
5. 导航只保留主链路必要页面。

## 3. 顶层信息层级

```text
App
  ├─ Auth
  │   ├─ Login
  │   └─ Onboarding
  └─ Project Workspace
      ├─ Home
      ├─ Archive
      ├─ Capture
      ├─ Timeline
      ├─ Writing
      ├─ Preview
      └─ Settings
```

## 4. 当前路由裁决

| 当前路由 | 当前页面 | V1 处理方式 | 说明 |
|---|---|---|---|
| `/login` | Login | 保留 | 真实登录入口 |
| `/onboarding` | Onboarding | 保留并重定义 | 改为账号首次引导 + 项目初始化，不再配置前端 API Key |
| `/` | Home | 保留 | 工作台首页 |
| `/archive` | Archive | 保留 | 素材库与整理中心 |
| `/capture` | Capture | 保留 | 素材采集入口 |
| `/timeline` | Timeline | 保留 | 事件与时间线视图 |
| `/writing` | Writing | 保留 | 章节编辑主界面 |
| `/preview` | Preview | 保留 | 预览与基础导出 |
| `/settings` | Settings | 保留并重定义 | 账户与项目设置，不再以本地模型密钥配置为核心 |
| `/refinement` | Refinement | 合并进 Writing | 独立路由可保留但不作为主导航 |
| `/biography-book` | BiographyBook | 合并进 Preview | 独立精装书配置延后 |
| `/analytics` | Analytics | V1 隐藏 | 页面文件保留，导航与主流程隐藏 |
| `/notifications` | Notifications | V1 隐藏 | 页面文件保留，导航隐藏 |
| `/quick-actions` | QuickActions | V1 隐藏 | 页面文件保留，导航隐藏 |

## 5. 顶部导航与主入口

### 5.1 V1 顶部导航

- Home
- Archive
- Timeline
- Writing
- Preview
- Settings

### 5.2 V1 首页主入口

首页只保留 4 类高频入口：

- 继续当前项目
- 上传新素材
- 查看待确认事件
- 继续编辑章节

说明：

- “分享预览”
- “精装成书”
- “分析统计”
- “通知”

这些入口在 V1 不应作为首页主动作。

## 6. 核心内容层级

```text
Workspace
  └─ Project
      ├─ SubjectProfile
      ├─ Assets
      │   └─ AssetAnalysis
      ├─ Events
      ├─ Chapters
      ├─ PreviewSnapshots
      └─ ExportVersions
```

## 7. 页面职责

### 7.1 Login

### 页面目标

- 完成邮箱登录或 magic link 进入

### 核心数据

- `AccountUser`
- `AuthSession`

### 核心动作

- 输入邮箱
- 请求登录链接
- 校验登录态

### V1 不做

- 社交登录
- 手机验证码
- 多供应商身份接入

## 7.2 Onboarding

### 页面目标

- 首次完成基础设置
- 创建第一个项目
- 填写主人公基础信息

### 核心数据

- `AccountUser`
- `Project`
- `SubjectProfile`

### 核心动作

- 设置显示名
- 创建项目
- 填写主人公姓名、关系、出生年份、叙事口吻

### 明确去除

- 本地 Gemini API Key 配置
- “选哪个前端模型”流程

## 7.3 Home

### 页面目标

- 作为工作台首页
- 告诉用户下一步该做什么

### 核心模块

- 当前项目卡片
- 上传入口
- 待处理任务摘要
- 待确认事件摘要
- 近期章节进度

### 页面依赖

- `ProjectSummary`
- `JobSummary`
- `EventSummary`
- `ChapterSummary`

## 7.4 Archive

### 页面目标

- 浏览和整理素材
- 触发素材分析
- 从素材进入事件整理

### 核心模块

- 素材列表
- 素材筛选
- 分析状态
- 事件建议入口

### 页面依赖

- `AssetList`
- `AssetAnalysisStatus`

## 7.5 Capture

### 页面目标

- 新增图片、音频、文字素材

### 核心模块

- 模式切换
- 文件上传或录制
- 基础元数据填写
- 上传状态

### 页面依赖

- `UploadRequest`
- `AssetCreateFlow`

### V1 范围

- image
- audio
- text

### V1 延后

- video

## 7.6 Timeline

### 页面目标

- 以时间顺序组织事件
- 发现叙事空缺

### 核心模块

- 时间线主轴
- 事件节点
- 时间未知分组
- 从事件跳转到章节或素材

### 页面依赖

- `EventTimelineView`

### 说明

- Timeline 组织的是 `Event`
- 不是直接组织 `Asset`

## 7.7 Writing

### 页面目标

- 编辑章节
- 管理章节顺序
- 从事件生成草稿
- 使用 AI 助手补写或改写

### 核心模块

- 章节目录
- 章节编辑器
- 关联事件列表
- 右侧 AI 助手面板

### 页面依赖

- `ChapterDetail`
- `ChapterEventLink`
- `WritingAssistantState`

### 页面裁决

- 原独立 `Refinement` 页面并入这里

## 7.8 Preview

### 页面目标

- 预览当前作品
- 触发导出

### 核心模块

- 预览排版
- 基础导出选项
- 导出历史

### 页面依赖

- `PreviewSnapshot`
- `ExportVersionList`

### 页面裁决

- 原 `BiographyBook` 配置先并入这里

## 7.9 Settings

### 页面目标

- 管理账户信息
- 管理当前项目设置
- 管理隐私和数据偏好

### 核心模块

- 账户设置
- 当前项目设置
- 数据与隐私
- V2 预留邀请管理

### 明确去除

- 把前端模型密钥配置作为核心功能

## 8. 核心用户路径

### 8.1 首次使用路径

1. Login
2. Onboarding
3. 创建项目
4. 填写主人公信息
5. 跳转 Home
6. 从 Home 进入 Capture

### 8.2 素材到事件路径

1. Home 或 Archive 进入 Capture
2. 上传素材
3. 返回 Archive
4. 查看素材分析状态
5. 生成或确认事件

### 8.3 事件到章节路径

1. Archive 或 Timeline 查看事件
2. 确认事件
3. 跳转 Writing
4. 触发章节草稿生成
5. 编辑章节

### 8.4 导出路径

1. Writing 保存
2. 进入 Preview
3. 触发导出
4. 获取导出结果

## 9. 页面访问规则

### 9.1 公共页面

- `/login`

### 9.2 受保护页面

- `/`
- `/onboarding`
- `/archive`
- `/capture`
- `/timeline`
- `/writing`
- `/preview`
- `/settings`

### 9.3 V1 隐藏页面

- `/analytics`
- `/notifications`
- `/quick-actions`

说明：

- 页面文件可保留
- 但不应出现在主导航
- 也不应作为主流程依赖页面

## 10. 现有 UI 改造要求

### 10.1 必须保留

- 整体视觉调性
- 页面骨架
- 中文视觉语言
- 基本路由结构

### 10.2 必须改变

- mock 数据驱动
- 前端直接调用模型
- Onboarding 的 API Key 逻辑
- Settings 的本地密钥中心逻辑
- 主导航中过多低频页面

## 11. 空状态与错误状态要求

每个 V1 页面必须至少有：

- loading 状态
- empty 状态
- error 状态

重点页面还必须有：

- Capture：上传中断恢复提示
- Archive：分析失败重试
- Writing：章节草稿为空时的引导
- Preview：导出失败重试

## 12. 对前端实现者的约束

1. 不得随意新增新的主页面来回避现有页面职责。
2. 不得把页面职责写乱，比如在 `Home` 中塞完整编辑器。
3. 不得继续让隐藏页面占据主导航。
4. 任何路由变化都必须先回看本文件。
