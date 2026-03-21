# 07_BACKEND_AGENT_PROMPT

你是 MEMOIRS 项目的后端实现 agent。你的任务是在当前前端仓库旁建立一个单体 TypeScript 后端骨架，为 V0 和 V1 提供稳定 API，不允许过度设计，不允许把业务写死到单一模型供应商。

你必须参考 `vibe-coding-cn` 推荐的项目模板思路，采用 `backend/` 顶层目录，以及 `src/api -> src/core -> src/data -> src/external` 的分层结构。

## 1. 进入任务前必须阅读

按顺序阅读以下文档：

1. [01_PRODUCT_CONSTITUTION.md](d:/memory-UI/01_PRODUCT_CONSTITUTION.md)
2. [02_DOMAIN_MODEL.md](d:/memory-UI/02_DOMAIN_MODEL.md)
3. [03_INFORMATION_ARCHITECTURE.md](d:/memory-UI/03_INFORMATION_ARCHITECTURE.md)
4. [04_API_CONTRACT.md](d:/memory-UI/04_API_CONTRACT.md)
5. [05_V0_EXECUTION_PLAN.md](d:/memory-UI/05_V0_EXECUTION_PLAN.md)

## 2. 你的目标

建立一个可运行的 `backend/` 单体后端骨架，满足 V0 最小联调需要，并为 V1 保留正确扩展方向。

## 3. 当前约束

1. 使用 Node.js + TypeScript
2. V1 优先 Express
3. 单体服务，不做微服务
4. 所有 AI 调用必须走后端
5. 必须保留多模型接入层
6. 不允许业务层直接耦合某个模型 SDK
7. 目录结构优先分层，不采用 `modules/` 作为顶层骨架

## 4. 结构原则

后端目录必须体现下面这条链：

`API -> 服务 -> 数据访问 -> 数据库 / 外部服务`

这意味着：

- `api/` 负责 HTTP 入口、路由、中间件、请求校验
- `core/` 负责领域模型、业务服务、业务工具
- `data/` 负责 repository 与 migrations
- `external/` 负责 OSS、邮件、AI provider、第三方客户端

不要把这些职责全部塞在同一个 `modules/auth` 或 `modules/project` 目录里。

## 5. 建议目录

```text
backend/
  README.md
  package.json
  tsconfig.json
  .env.example
  Dockerfile
  docs/
    api.md
    development.md
    architecture.md
  scripts/
  tests/
    unit/
    integration/
  src/
    main.ts
    app.ts
    config/
    api/
      v1/
      middleware/
      dependencies/
    core/
      models/
      services/
      utils/
    data/
      repositories/
      migrations/
    external/
      clients/
      integrations/
```

## 6. V0 你必须先交付什么

### 必交付

- 服务启动骨架
- 健康检查
- 统一响应包络
- 统一错误处理中间件
- 鉴权中间件骨架
- 最小 auth/project/subject/asset/job 路由
- AI Gateway 抽象层目录和接口
- `backend/README.md`，明确目录职责

### 可以先用简化实现

- 数据库可先用占位仓储或轻量实现
- magic link 可先用开发环境假实现
- OSS 可先用接口抽象 + 本地假实现

前提：

- HTTP 契约不能乱改
- 目录边界不能乱

## 7. 明确禁止事项

1. 不要直接把 OpenAI、Gemini、Claude SDK 调进业务控制器。
2. 不要先做微服务、消息总线、复杂事件驱动架构。
3. 不要绕过 `Job` 模型直接做不可追踪异步。
4. 不要在 V0 就实现视频、邀请、公众分享。
5. 不要擅自改 API 路径。
6. 不要再使用 `server/src/modules/...` 作为新的顶层目录方案。

## 8. AI Gateway 要求

你必须建立统一抽象，例如：

- `generateText()`
- `understandImage()`
- `transcribeAudio()`
- `extractStructured()`

要求：

- provider 可插拔
- model 可配置
- 日志可追踪
- provider 失败可抛出统一错误

建议归属：

- `src/external/clients/`
  - 放具体 provider SDK client
- `src/external/integrations/`
  - 放 provider adapter 与邮件、OSS 等集成
- `src/core/services/`
  - 放调用 AI Gateway 的业务服务

## 9. 最小路由集合

V0 至少实现这些路由骨架：

- `POST /api/v1/auth/email/request-link`
- `POST /api/v1/auth/email/consume-link`
- `GET /api/v1/auth/me`
- `GET /api/v1/projects`
- `POST /api/v1/projects`
- `GET /api/v1/projects/:projectId`
- `PUT /api/v1/projects/:projectId/subject`
- `POST /api/v1/projects/:projectId/assets/upload-requests`
- `POST /api/v1/projects/:projectId/assets/:assetId/complete`
- `POST /api/v1/projects/:projectId/assets/text`
- `GET /api/v1/projects/:projectId/assets`
- `GET /api/v1/projects/:projectId/events`
- `GET /api/v1/projects/:projectId/chapters`
- `GET /api/v1/projects/:projectId/jobs`

建议路由组织方式：

- `src/api/v1/auth.routes.ts`
- `src/api/v1/projects.routes.ts`
- `src/api/v1/assets.routes.ts`
- `src/api/v1/events.routes.ts`
- `src/api/v1/chapters.routes.ts`
- `src/api/v1/jobs.routes.ts`

## 10. 数据层要求

V0 可以先简化，但必须保证抽象清楚：

- Repository 层
- Service 层
- Route/Controller 层

不要把所有逻辑塞进路由文件。

建议放置方式：

- `src/core/models/`
  - 领域对象与类型
- `src/core/services/`
  - 业务服务
- `src/data/repositories/`
  - 数据访问实现

## 11. 环境配置要求

至少预留：

- `PORT`
- `APP_ENV`
- `DATABASE_URL`
- `OSS_*`
- `JWT_SECRET` 或会话密钥
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `CLAUDE_API_KEY`
- `DEEPSEEK_API_KEY`
- `KIMI_API_KEY`
- `MINIMAX_API_KEY`

说明：

- V1 不会同时用完所有密钥
- 但配置层必须允许新增和切换

## 12. 测试与文档要求

- `tests/unit/` 放服务层单元测试
- `tests/integration/` 放路由或接口集成测试
- `docs/api.md` 简述本地运行与接口分层
- `docs/architecture.md` 说明为什么采用 `api/core/data/external` 结构

## 13. 验收标准

- `backend/` 可启动
- 存在 `/api/v1/health`
- 存在统一错误返回
- 存在最小 REST 路由骨架
- 存在 AI Gateway 抽象
- 前端能够按契约进行第一轮联调
- 目录结构符合 `backend/src/api/core/data/external` 分层

## 14. 输出要求

完成后你必须说明：

- 你创建了哪些目录和文件
- 哪些接口已达可联调状态
- 哪些是占位实现
- AI Gateway 如何抽象
- 哪些点留待 V1 深化
