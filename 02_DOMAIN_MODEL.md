# 02_DOMAIN_MODEL

- 状态：Draft locked from constitution v0.1
- 版本：v0.1
- 日期：2026-03-21
- 依赖上游：[01_PRODUCT_CONSTITUTION.md](d:/memory-UI/01_PRODUCT_CONSTITUTION.md)

## 1. 目的

本文件定义 MEMOIRS 的统一领域语言、核心对象、关系、状态机与不可破坏约束。

后续前端类型、后端 DTO、数据库表、任务队列、AI 提示模板，必须统一以本文件的术语为准。

## 2. 建模原则

1. 原始素材和 AI 派生结果必须分层保存。
2. `Event` 是叙事原子，不允许跳过 `Event` 直接从素材写成最终章节。
3. `Chapter` 是作品层对象，`Asset` 是证据层对象，两者不能混用。
4. `AccountUser` 与 `SubjectProfile` 必须区分。
5. 所有 AI 输出都是可编辑草稿，不是最终真相。
6. 所有异步生成行为都必须可追踪到 `Job`。

## 3. 统一术语表

- `AccountUser`
  - 登录系统的人
- `Project`
  - 一份回忆录工程
- `SubjectProfile`
  - 回忆录主人公
- `Asset`
  - 原始素材
- `AssetAnalysis`
  - 对原始素材的 AI 结构化解析结果
- `Event`
  - 从一个或多个素材中提炼出的叙事事件
- `Chapter`
  - 由一个或多个事件组成的章节
- `PreviewSnapshot`
  - 用于预览的派生版本
- `ExportVersion`
  - 可下载导出的派生版本
- `Job`
  - 异步处理任务
- `Invitation`
  - 家庭阶段邀请关系，V2 实现

## 4. 顶层关系图

```text
AccountUser
  └─ owns many Projects

Project
  ├─ has one SubjectProfile
  ├─ has many Assets
  ├─ has many Events
  ├─ has many Chapters
  ├─ has many Jobs
  ├─ has many PreviewSnapshots
  ├─ has many ExportVersions
  └─ has many Invitations (V2)

Asset
  └─ has many AssetAnalysis versions

Asset <-> Event
  └─ many-to-many

Event <-> Chapter
  └─ many-to-many, but one Chapter has an explicit order
```

## 5. 统一字段规范

### 5.1 所有对象通用字段

- `id`
- `createdAt`
- `updatedAt`

### 5.2 可选通用字段

- `createdBy`
- `updatedBy`
- `deletedAt`

### 5.3 ID 命名建议

- `usr_`
- `prj_`
- `sub_`
- `ast_`
- `ana_`
- `evt_`
- `chp_`
- `job_`
- `prv_`
- `exp_`
- `inv_`

说明：

- ID 规则是建议，不要求前端强耦合前缀判断。
- 后端内部与 API 返回应保持同一规则。

## 6. 对象定义

### 6.1 AccountUser

### 业务职责

- 表示登录身份
- 拥有或参与多个项目
- 管理认证会话

### 核心字段

- `id`
- `email`
- `displayName`
- `avatarUrl`
- `status`
  - `pending`
  - `active`
  - `disabled`
- `lastLoginAt`

### V1 约束

- V1 至少支持 owner 自用
- V1 不要求完整团队权限系统

## 6.2 Project

### 业务职责

- 回忆录工程顶层容器
- 汇总素材、事件、章节、导出

### 核心字段

- `id`
- `ownerUserId`
- `title`
- `subtitle`
- `description`
- `coverAssetId`
- `primarySubjectId`
- `status`
  - `draft`
  - `active`
  - `archived`
- `phase`
  - `collecting`
  - `organizing`
  - `writing`
  - `exporting`
- `defaultNarrativeVoice`
  - `first_person`
  - `third_person`
- `targetAudience`
  - `self`
  - `family`
  - `public_reserved`

### V1 约束

- 一个 `Project` 只对应一个主 `SubjectProfile`
- `Project` 不等于导出成品

## 6.3 SubjectProfile

### 业务职责

- 定义这份回忆录是谁的人生故事

### 核心字段

- `id`
- `projectId`
- `fullName`
- `displayName`
- `relationshipToOwner`
  - `self`
  - `parent`
  - `grandparent`
  - `spouse`
  - `child`
  - `other`
- `gender`
  - `unknown`
  - `male`
  - `female`
  - `other`
- `birthYear`
- `birthDatePrecision`
  - `year`
  - `month`
  - `day`
  - `unknown`
- `lifeSummary`
- `narrativeVoicePreference`
  - `first_person`
  - `third_person`

### V1 约束

- V1 先支持一个主主人公
- 多主人公叙事不是 V1 范围

## 6.4 Asset

### 业务职责

- 保存原始素材
- 作为事件推断证据

### 核心字段

- `id`
- `projectId`
- `type`
  - `image`
  - `audio`
  - `text`
  - `video_reserved`
- `source`
  - `upload`
  - `recording`
  - `manual_text`
- `fileName`
- `mimeType`
- `byteSize`
- `storageKey`
- `status`
  - `pending_upload`
  - `uploaded`
  - `processing`
  - `ready`
  - `failed`
  - `deleted`
- `captureTime`
- `captureTimePrecision`
  - `year`
  - `month`
  - `day`
  - `minute`
  - `unknown`
- `locationText`
- `summary`
- `notes`
- `analysisStatus`
  - `not_started`
  - `queued`
  - `running`
  - `completed`
  - `failed`

### V1 约束

- `video_reserved` 只作保留，不进入真实流程
- `manual_text` 仍然视为 `Asset`

## 6.5 AssetAnalysis

### 业务职责

- 存储 AI 对素材的结构化理解结果
- 保留版本，支持重跑

### 核心字段

- `id`
- `assetId`
- `projectId`
- `version`
- `provider`
- `model`
- `taskType`
  - `image_understanding`
  - `audio_transcription`
  - `structured_extraction`
- `status`
  - `queued`
  - `running`
  - `completed`
  - `failed`
- `rawText`
- `structuredData`
- `confidenceScore`
- `errorCode`
- `errorMessage`

### `structuredData` 最小建议字段

- `people`
- `timeHints`
- `locationHints`
- `summary`
- `mood`
- `keywords`
- `suggestedEvents`

### V1 约束

- 同一素材允许多条分析记录
- 业务默认读取最新成功版本

## 6.6 Event

### 业务职责

- 表示叙事中的一个可讲述事件
- 是章节生成的直接输入

### 核心字段

- `id`
- `projectId`
- `title`
- `summary`
- `description`
- `startAt`
- `endAt`
- `timePrecision`
  - `year`
  - `month`
  - `day`
  - `range`
  - `unknown`
- `locationText`
- `participants`
- `emotionTags`
- `sourceType`
  - `ai_generated`
  - `manual`
  - `merged`
- `status`
  - `draft`
  - `confirmed`
  - `archived`
- `confidenceScore`

### 辅助字段

- `primaryAssetIds`
- `chapterCount`
- `timelineOrderHint`

### V1 约束

- 任何 `Event` 都必须可被人工修改
- 任何 `Event` 都必须可追溯到至少 0 个或多个 `Asset`
- AI 失败时允许手工创建空事件

## 6.7 EventAssetLink

### 业务职责

- 建立 `Event` 与 `Asset` 的多对多关系

### 核心字段

- `eventId`
- `assetId`
- `relevanceScore`
- `linkType`
  - `evidence`
  - `primary_source`
  - `supporting_material`

## 6.8 Chapter

### 业务职责

- 表示作品中的一个章节
- 聚合多个事件，形成可编辑叙事文本

### 核心字段

- `id`
- `projectId`
- `title`
- `subtitle`
- `summary`
- `sortOrder`
- `status`
  - `outline`
  - `ai_draft`
  - `owner_editing`
  - `finalized`
- `draftContent`
- `editedContent`
- `narrativeVoice`
  - `first_person`
  - `third_person`
- `wordCount`

### V1 约束

- `draftContent` 与 `editedContent` 必须分开
- 当前展示给用户的正文优先级：
  - 有 `editedContent` 用 `editedContent`
  - 否则用 `draftContent`

## 6.9 ChapterEventLink

### 业务职责

- 建立 `Chapter` 与 `Event` 的多对多关系

### 核心字段

- `chapterId`
- `eventId`
- `sortOrder`
- `role`
  - `primary`
  - `supporting`

## 6.10 PreviewSnapshot

### 业务职责

- 为预览界面生成稳定快照

### 核心字段

- `id`
- `projectId`
- `versionLabel`
- `status`
  - `ready`
  - `stale`
- `renderData`

### V1 约束

- 可先不单独持久化为复杂对象
- 但概念上必须与 `ExportVersion` 区分

## 6.11 ExportVersion

### 业务职责

- 表示一次导出任务的结果

### 核心字段

- `id`
- `projectId`
- `format`
  - `html`
  - `pdf_reserved`
- `status`
  - `queued`
  - `running`
  - `ready`
  - `failed`
  - `expired`
- `downloadUrl`
- `storageKey`
- `expiresAt`

## 6.12 Job

### 业务职责

- 统一记录异步工作

### 核心字段

- `id`
- `projectId`
- `resourceType`
  - `asset`
  - `event`
  - `chapter`
  - `export`
- `resourceId`
- `jobType`
  - `asset_analysis`
  - `event_generation`
  - `chapter_generation`
  - `export_generation`
- `status`
  - `queued`
  - `running`
  - `succeeded`
  - `failed`
  - `cancelled`
- `provider`
- `model`
- `attemptCount`
- `startedAt`
- `finishedAt`
- `errorCode`
- `errorMessage`
- `resultSummary`

## 6.13 Invitation

### 业务职责

- 家庭阶段邀请关系

### 核心字段

- `id`
- `projectId`
- `email`
- `role`
  - `contributor`
  - `viewer`
- `status`
  - `pending`
  - `accepted`
  - `revoked`
  - `expired`

### V1 约束

- 概念保留
- 不在 V1 真正落地

## 7. 读取视图与写入对象的区别

### 7.1 写入对象

- Project
- SubjectProfile
- Asset
- Event
- Chapter
- Job

### 7.2 读取视图

- ArchiveView
- TimelineView
- WritingView
- PreviewView
- DashboardView

说明：

- 读取视图可以是聚合对象
- 但不得反向污染核心领域对象定义

## 8. 状态流转

### 8.1 Asset 状态流

```text
pending_upload -> uploaded -> processing -> ready
                               └-> failed
ready -> deleted
failed -> processing
```

### 8.2 Event 状态流

```text
draft -> confirmed -> archived
draft -> archived
```

### 8.3 Chapter 状态流

```text
outline -> ai_draft -> owner_editing -> finalized
owner_editing -> finalized
finalized -> owner_editing
```

### 8.4 Job 状态流

```text
queued -> running -> succeeded
                 └-> failed
queued -> cancelled
running -> cancelled
```

## 9. 关键不变量

1. 没有 `Project`，不能存在下级对象。
2. `Asset` 删除时，不应直接物理删除关联关系，至少要保留软删除痕迹。
3. `Event` 删除前必须确认其是否被 `Chapter` 使用。
4. `Chapter` 可以没有事件，但 AI 生成章节必须基于事件集合。
5. 所有 AI 任务都必须留下 provider、model、jobType、状态记录。
6. `AccountUser` 可操作项目，不等于主人公身份。

## 10. V1 最小字段子集

如果 V1 需要进一步压缩，实现最小必需字段如下：

- `Project`
  - `id`, `ownerUserId`, `title`, `status`, `primarySubjectId`
- `SubjectProfile`
  - `id`, `projectId`, `fullName`, `relationshipToOwner`, `birthYear`
- `Asset`
  - `id`, `projectId`, `type`, `fileName`, `mimeType`, `storageKey`, `status`, `analysisStatus`
- `AssetAnalysis`
  - `id`, `assetId`, `provider`, `model`, `status`, `structuredData`
- `Event`
  - `id`, `projectId`, `title`, `summary`, `startAt`, `timePrecision`, `status`
- `Chapter`
  - `id`, `projectId`, `title`, `sortOrder`, `status`, `draftContent`, `editedContent`
- `Job`
  - `id`, `projectId`, `jobType`, `status`, `provider`, `model`

## 11. 保留但暂不实现的扩展点

- 多主人公项目
- 家庭评论
- 公开分享页
- 多语言导出
- 复杂权限继承
- 章节版本历史

## 12. 对下游实现者的要求

1. 前端类型命名必须与本文件一致。
2. 后端 DTO 与实体命名必须尽量贴近本文件。
3. 如需新增对象，先补充本文件再编码。
4. 不得把 UI 临时字段误升级为领域核心字段。
