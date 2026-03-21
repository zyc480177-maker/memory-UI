# 04_API_CONTRACT

- 状态：Draft contract for V0-V1
- 版本：v0.1
- 日期：2026-03-21
- 依赖上游：[01_PRODUCT_CONSTITUTION.md](d:/memory-UI/01_PRODUCT_CONSTITUTION.md), [02_DOMAIN_MODEL.md](d:/memory-UI/02_DOMAIN_MODEL.md)

## 1. 目的

本文件定义前后端联调所需的 HTTP 契约。目标是让前端先按稳定接口建壳，让后端按稳定资源模型实现。

本文件不包含具体 SQL，也不限定 ORM。

## 2. 全局约定

### 2.1 Base URL

- 开发环境：`/api/v1`

### 2.2 认证方式

- `Authorization: Bearer <access_token>`

### 2.3 响应包络

成功：

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

失败：

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project not found",
    "details": {}
  }
}
```

### 2.4 分页约定

游标分页优先：

```json
{
  "meta": {
    "nextCursor": "evt_xxx",
    "hasMore": true
  }
}
```

### 2.5 时间格式

- 全部使用 ISO 8601 UTC 字符串

### 2.6 资源命名

- 统一使用复数资源名
- 子资源使用嵌套路由

## 3. DTO 总览

### 3.1 AuthSession

```json
{
  "user": {
    "id": "usr_xxx",
    "email": "owner@example.com",
    "displayName": "Owner"
  },
  "accessToken": "jwt-or-session-token",
  "expiresAt": "2026-03-21T12:00:00Z"
}
```

### 3.2 ProjectSummary

```json
{
  "id": "prj_xxx",
  "title": "父亲回忆录",
  "status": "active",
  "phase": "writing",
  "primarySubject": {
    "id": "sub_xxx",
    "fullName": "张建国"
  },
  "counts": {
    "assets": 12,
    "events": 8,
    "chapters": 3
  },
  "updatedAt": "2026-03-21T12:00:00Z"
}
```

### 3.3 AssetDTO

```json
{
  "id": "ast_xxx",
  "projectId": "prj_xxx",
  "type": "image",
  "fileName": "old-photo.jpg",
  "mimeType": "image/jpeg",
  "byteSize": 123456,
  "status": "ready",
  "analysisStatus": "completed",
  "summary": "一张老合照",
  "createdAt": "2026-03-21T12:00:00Z"
}
```

### 3.4 EventDTO

```json
{
  "id": "evt_xxx",
  "projectId": "prj_xxx",
  "title": "第一次上大学",
  "summary": "关于求学时代的重要转折",
  "startAt": "1978-09-01T00:00:00Z",
  "timePrecision": "month",
  "locationText": "北京",
  "status": "confirmed",
  "sourceType": "ai_generated",
  "assetIds": ["ast_xxx"]
}
```

### 3.5 ChapterDTO

```json
{
  "id": "chp_xxx",
  "projectId": "prj_xxx",
  "title": "求学时代",
  "sortOrder": 2,
  "status": "owner_editing",
  "draftContent": "AI 生成的章节草稿",
  "editedContent": "人工修改后的内容",
  "eventIds": ["evt_xxx", "evt_yyy"]
}
```

### 3.6 JobDTO

```json
{
  "id": "job_xxx",
  "projectId": "prj_xxx",
  "jobType": "asset_analysis",
  "resourceType": "asset",
  "resourceId": "ast_xxx",
  "status": "running",
  "provider": "gemini",
  "model": "gemini-2.5-flash",
  "createdAt": "2026-03-21T12:00:00Z"
}
```

## 4. 认证接口

### 4.1 请求登录链接

- `POST /auth/email/request-link`

请求体：

```json
{
  "email": "owner@example.com"
}
```

响应：

- `200 OK`
- `data = { "sent": true }`

### 4.2 消费登录链接

- `POST /auth/email/consume-link`

请求体：

```json
{
  "token": "magic-link-token"
}
```

响应：

- `200 OK`
- `data = AuthSession`

### 4.3 获取当前会话

- `GET /auth/me`

响应：

- `200 OK`
- `data = AuthSession.user`

### 4.4 登出

- `POST /auth/logout`

响应：

- `200 OK`
- `data = { "success": true }`

## 5. 项目接口

### 5.1 获取项目列表

- `GET /projects`

查询参数：

- `cursor`
- `limit`

响应：

- `data = ProjectSummary[]`

### 5.2 创建项目

- `POST /projects`

请求体：

```json
{
  "title": "父亲回忆录",
  "subtitle": "一生的故事",
  "description": "从童年到退休",
  "defaultNarrativeVoice": "first_person"
}
```

响应：

- `201 Created`
- `data = ProjectSummary`

### 5.3 获取项目详情

- `GET /projects/{projectId}`

响应：

- `data = ProjectDetail`

### 5.4 更新项目

- `PATCH /projects/{projectId}`

允许字段：

- `title`
- `subtitle`
- `description`
- `coverAssetId`
- `status`
- `phase`
- `defaultNarrativeVoice`

### 5.5 归档项目

- `POST /projects/{projectId}/archive`

响应：

- `data = { "status": "archived" }`

## 6. 主人公接口

### 6.1 获取主人公信息

- `GET /projects/{projectId}/subject`

响应：

- `data = SubjectProfileDTO`

### 6.2 创建或更新主人公信息

- `PUT /projects/{projectId}/subject`

请求体：

```json
{
  "fullName": "张建国",
  "displayName": "父亲",
  "relationshipToOwner": "parent",
  "birthYear": 1952,
  "narrativeVoicePreference": "first_person",
  "lifeSummary": "一个普通中国家庭父亲的一生"
}
```

响应：

- `data = SubjectProfileDTO`

## 7. 素材接口

### 7.1 申请上传

- `POST /projects/{projectId}/assets/upload-requests`

请求体：

```json
{
  "assetType": "image",
  "fileName": "old-photo.jpg",
  "mimeType": "image/jpeg",
  "byteSize": 123456
}
```

响应：

```json
{
  "data": {
    "assetId": "ast_xxx",
    "uploadUrl": "https://oss-signed-url",
    "uploadMethod": "PUT",
    "uploadHeaders": {
      "Content-Type": "image/jpeg"
    },
    "storageKey": "projects/prj_xxx/assets/ast_xxx/original.jpg",
    "expiresAt": "2026-03-21T12:30:00Z"
  }
}
```

### 7.2 完成上传

- `POST /projects/{projectId}/assets/{assetId}/complete`

请求体：

```json
{
  "captureTime": "1988-10-01T00:00:00Z",
  "captureTimePrecision": "day",
  "locationText": "北京",
  "notes": "国庆合影"
}
```

响应：

- `data = AssetDTO`

### 7.3 直接创建文本素材

- `POST /projects/{projectId}/assets/text`

请求体：

```json
{
  "title": "第一次进城",
  "content": "那年我第一次去县城……",
  "captureTime": "1970-01-01T00:00:00Z",
  "captureTimePrecision": "year"
}
```

响应：

- `201 Created`
- `data = AssetDTO`

### 7.4 获取素材列表

- `GET /projects/{projectId}/assets`

查询参数：

- `type`
- `status`
- `analysisStatus`
- `cursor`
- `limit`

### 7.5 获取素材详情

- `GET /projects/{projectId}/assets/{assetId}`

### 7.6 更新素材元数据

- `PATCH /projects/{projectId}/assets/{assetId}`

允许字段：

- `captureTime`
- `captureTimePrecision`
- `locationText`
- `summary`
- `notes`

### 7.7 删除素材

- `DELETE /projects/{projectId}/assets/{assetId}`

语义：

- 默认软删除

## 8. 素材分析接口

### 8.1 创建素材分析任务

- `POST /projects/{projectId}/assets/{assetId}/analysis-jobs`

请求体：

```json
{
  "taskType": "auto",
  "providerHint": "gemini",
  "modelHint": "gemini-2.5-flash"
}
```

响应：

- `202 Accepted`
- `data = JobDTO`

### 8.2 获取素材分析列表

- `GET /projects/{projectId}/assets/{assetId}/analyses`

### 8.3 获取最新成功分析

- `GET /projects/{projectId}/assets/{assetId}/analyses/latest`

## 9. 事件接口

### 9.1 获取事件列表

- `GET /projects/{projectId}/events`

查询参数：

- `status`
- `unassignedOnly`
- `cursor`
- `limit`

### 9.2 手工创建事件

- `POST /projects/{projectId}/events`

请求体：

```json
{
  "title": "第一次上大学",
  "summary": "人生转折",
  "startAt": "1978-09-01T00:00:00Z",
  "timePrecision": "month",
  "locationText": "北京",
  "assetIds": ["ast_xxx"]
}
```

### 9.3 生成事件任务

- `POST /projects/{projectId}/event-generation-jobs`

请求体：

```json
{
  "assetIds": ["ast_xxx", "ast_yyy"],
  "providerHint": "openai"
}
```

响应：

- `202 Accepted`
- `data = JobDTO`

### 9.4 获取事件详情

- `GET /projects/{projectId}/events/{eventId}`

### 9.5 更新事件

- `PATCH /projects/{projectId}/events/{eventId}`

允许字段：

- `title`
- `summary`
- `description`
- `startAt`
- `endAt`
- `timePrecision`
- `locationText`
- `participants`
- `emotionTags`
- `status`
- `assetIds`

### 9.6 合并事件

- `POST /projects/{projectId}/events/merge`

请求体：

```json
{
  "sourceEventIds": ["evt_a", "evt_b"],
  "targetTitle": "大学录取与入学"
}
```

### 9.7 删除事件

- `DELETE /projects/{projectId}/events/{eventId}`

## 10. 章节接口

### 10.1 获取章节列表

- `GET /projects/{projectId}/chapters`

### 10.2 创建空章节

- `POST /projects/{projectId}/chapters`

请求体：

```json
{
  "title": "求学时代",
  "sortOrder": 2
}
```

### 10.3 生成章节草稿任务

- `POST /projects/{projectId}/chapter-generation-jobs`

请求体：

```json
{
  "chapterTitle": "求学时代",
  "eventIds": ["evt_xxx", "evt_yyy"],
  "providerHint": "openai"
}
```

响应：

- `202 Accepted`
- `data = JobDTO`

### 10.4 获取章节详情

- `GET /projects/{projectId}/chapters/{chapterId}`

### 10.5 更新章节

- `PATCH /projects/{projectId}/chapters/{chapterId}`

允许字段：

- `title`
- `subtitle`
- `summary`
- `status`
- `draftContent`
- `editedContent`
- `eventIds`

### 10.6 重排章节

- `PUT /projects/{projectId}/chapters/reorder`

请求体：

```json
{
  "chapterIds": ["chp_1", "chp_2", "chp_3"]
}
```

## 11. 预览与导出接口

### 11.1 获取预览数据

- `GET /projects/{projectId}/preview`

响应：

- `data = PreviewDTO`

### 11.2 创建导出任务

- `POST /projects/{projectId}/exports`

请求体：

```json
{
  "format": "html"
}
```

响应：

- `202 Accepted`
- `data = ExportVersionDTO`

### 11.3 获取导出记录

- `GET /projects/{projectId}/exports`

### 11.4 获取单个导出记录

- `GET /projects/{projectId}/exports/{exportId}`

## 12. Job 接口

### 12.1 获取项目 Job 列表

- `GET /projects/{projectId}/jobs`

查询参数：

- `jobType`
- `status`
- `resourceType`

### 12.2 获取单个 Job

- `GET /projects/{projectId}/jobs/{jobId}`

### 12.3 重试 Job

- `POST /projects/{projectId}/jobs/{jobId}/retry`

## 13. V2 预留接口

这些接口不进入 V1 开发范围，但路径保留：

- `POST /projects/{projectId}/invitations`
- `GET /projects/{projectId}/invitations`
- `POST /projects/{projectId}/invitations/{invitationId}/resend`
- `DELETE /projects/{projectId}/invitations/{invitationId}`

## 14. 非公开内部 AI Gateway 契约

本节不是前端 REST 契约，而是后端内部抽象接口。

### 14.1 文本生成

```ts
generateText({
  taskType,
  prompt,
  modelHint,
  providerHint,
  temperature,
  maxTokens
})
```

### 14.2 图像理解

```ts
understandImage({
  imageUrl,
  taskType,
  schemaName,
  providerHint,
  modelHint
})
```

### 14.3 音频转写

```ts
transcribeAudio({
  audioUrl,
  languageHint,
  providerHint,
  modelHint
})
```

### 14.4 结构化提取

```ts
extractStructured({
  input,
  schemaName,
  providerHint,
  modelHint
})
```

### 14.5 调用日志要求

每次调用至少记录：

- `provider`
- `model`
- `taskType`
- `requestId`
- `durationMs`
- `promptVersion`
- `tokenUsage`
- `estimatedCost`
- `status`

## 15. 错误码建议

- `UNAUTHORIZED`
- `FORBIDDEN`
- `RESOURCE_NOT_FOUND`
- `VALIDATION_ERROR`
- `UPLOAD_URL_EXPIRED`
- `ASSET_NOT_READY`
- `JOB_ALREADY_RUNNING`
- `PROVIDER_UNAVAILABLE`
- `MODEL_TIMEOUT`
- `EXPORT_FAILED`

## 16. V0 必须先实现的最小接口子集

- `POST /auth/email/request-link`
- `POST /auth/email/consume-link`
- `GET /auth/me`
- `GET /projects`
- `POST /projects`
- `GET /projects/{projectId}`
- `PUT /projects/{projectId}/subject`
- `POST /projects/{projectId}/assets/upload-requests`
- `POST /projects/{projectId}/assets/{assetId}/complete`
- `POST /projects/{projectId}/assets/text`
- `GET /projects/{projectId}/assets`
- `GET /projects/{projectId}/events`
- `GET /projects/{projectId}/chapters`
- `GET /projects/{projectId}/jobs`

## 17. 对前后端实现者的要求

1. 前端在后端未完成前，可以先按本文件创建 typed API stub。
2. 后端即使暂时用假实现，也不能擅自改路径和资源形状。
3. 一切新增接口必须先回补本文件。
