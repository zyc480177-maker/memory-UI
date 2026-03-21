# Backend Structure

本目录预留给 MEMOIRS 的 TypeScript 后端。

目录结构遵循 `vibe-coding-cn` 推荐的全栈/后端模板思路，并按本项目实际技术栈做了 TypeScript 适配。

## 目标结构

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

## 分层原则

- `api/`
  - HTTP 入口、路由、中间件、请求校验
- `core/`
  - 领域模型、业务服务、核心业务工具
- `data/`
  - repository 与数据持久化相关代码
- `external/`
  - OSS、邮件、AI provider、第三方客户端与集成

## 禁止事项

- 不要把业务直接写进路由
- 不要把模型 SDK 直接写进业务控制器
- 不要再建立 `server/src/modules/...` 作为主骨架
