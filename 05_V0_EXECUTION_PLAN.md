# 05_V0_EXECUTION_PLAN

- 状态：Execution baseline
- 版本：v0.1
- 日期：2026-03-21
- 依赖上游：
  - [01_PRODUCT_CONSTITUTION.md](d:/memory-UI/01_PRODUCT_CONSTITUTION.md)
  - [02_DOMAIN_MODEL.md](d:/memory-UI/02_DOMAIN_MODEL.md)
  - [03_INFORMATION_ARCHITECTURE.md](d:/memory-UI/03_INFORMATION_ARCHITECTURE.md)
  - [04_API_CONTRACT.md](d:/memory-UI/04_API_CONTRACT.md)

## 1. V0 目标

V0 不是做完产品，而是把当前 UI 从 demo 结构升级成“可接真实后端、可被多人 agent 协作推进”的产品壳。

## 2. V0 完成定义

V0 结束时必须满足：

1. 前端不再依赖本地 Gemini API Key 运行主链路。
2. 前端存在统一类型层和 API 层。
3. 路由有真实登录态保护。
4. V1 不做的页面已从主导航移除或隐藏。
5. 核心页面已按真实资源模型占位。
6. 后端有可运行的单体骨架和核心路由骨架。

## 3. V0 非目标

- 不做视频
- 不做家庭协作
- 不做公众分享
- 不做精装导出
- 不做复杂统计页
- 不做完整 AI 生成能力

## 4. 当前代码现实

当前仓库已经有：

- React + Vite 前端骨架
- 一组高质量中文 UI 页面
- 若干直接在前端使用 Gemini 的逻辑
- 大量 mock 数据

当前仓库没有：

- 可用的后端服务
- 稳定的领域模型落地
- 统一 API 层
- 统一鉴权与会话模型

## 5. V0 工作流

### 阶段 0：文档冻结

输出：

- 产品宪章
- 领域模型
- 信息架构
- API 契约
- 本执行计划

责任：

- Owner

### 阶段 1：前端产品壳重构

输出：

- `src/types/`
- `src/api/`
- `src/services/` 或 `src/lib/`
- 路由守卫
- 统一会话上下文

责任：

- Frontend agent

### 阶段 2：页面去留与职责调整

输出：

- 主导航裁剪
- `Refinement` 并入 `Writing`
- `BiographyBook` 并入 `Preview`
- 隐藏 `Analytics`、`Notifications`、`QuickActions`

责任：

- Frontend agent

### 阶段 3：后端骨架建立

输出：

- `backend/` 单体服务骨架
- 按 `src/api -> src/core -> src/data -> src/external` 分层
- auth/project/subject/asset/job 基础路由
- 统一响应包络
- 健康检查和环境配置

责任：

- Backend agent

### 阶段 4：最小联调

输出：

- 登录态联调
- 创建项目联调
- 上传素材联调
- 素材列表联调

责任：

- Frontend agent + Backend agent

## 6. 任务拆分

### 6.1 Owner 任务

- 确认上游文档冻结
- 决定阶段边界，不接受 V1 范围膨胀
- 提供第一批真实测试素材
- 决定后端环境变量与云资源开通顺序

### 6.2 Frontend agent 任务

- 移除页面中的 mock 业务依赖
- 移除页面中的前端直连模型逻辑
- 建立类型层、API 层、鉴权层
- 调整导航与路由守卫
- 将页面改造成真实资源驱动的空态/加载态/错误态

### 6.3 Backend agent 任务

- 在 `backend/` 下建立 Express + TypeScript 单体骨架
- 采用 `vibe-coding-cn` 推荐的全栈后端目录思路，优先使用分层结构而不是 `modules/` 顶层横切
- 建立统一配置、日志、错误中间件
- 实现 auth/project/subject/asset/job 最小路由
- 预留 AI Gateway 接口，不直接把业务写死到某个模型 SDK

## 7. 文件级建议

### 7.1 前端建议新增

- `src/types/domain.ts`
- `src/types/api.ts`
- `src/api/client.ts`
- `src/api/auth.ts`
- `src/api/projects.ts`
- `src/api/assets.ts`
- `src/api/events.ts`
- `src/api/chapters.ts`
- `src/api/jobs.ts`
- `src/lib/auth-session.tsx`
- `src/lib/route-guard.tsx`

### 7.2 前端建议改动

- `src/App.tsx`
- `src/components/Navigation.tsx`
- `src/pages/Login.tsx`
- `src/pages/Onboarding.tsx`
- `src/pages/Home.tsx`
- `src/pages/Archive.tsx`
- `src/pages/Capture.tsx`
- `src/pages/Timeline.tsx`
- `src/pages/Writing.tsx`
- `src/pages/Preview.tsx`
- `src/pages/Settings.tsx`

### 7.3 后端建议新增

- `backend/README.md`
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env.example`
- `backend/Dockerfile`
- `backend/docs/api.md`
- `backend/docs/development.md`
- `backend/docs/architecture.md`
- `backend/scripts/`
- `backend/tests/unit/`
- `backend/tests/integration/`
- `backend/src/main.ts`
- `backend/src/app.ts`
- `backend/src/config/`
- `backend/src/api/v1/`
- `backend/src/api/middleware/`
- `backend/src/api/dependencies/`
- `backend/src/core/models/`
- `backend/src/core/services/`
- `backend/src/core/utils/`
- `backend/src/data/repositories/`
- `backend/src/data/migrations/`
- `backend/src/external/clients/`
- `backend/src/external/integrations/`

## 8. V0 页面裁决清单

### 8.1 V1 主流程页面

- Login
- Onboarding
- Home
- Archive
- Capture
- Timeline
- Writing
- Preview
- Settings

### 8.2 保留文件但退出主流程

- Refinement
- BiographyBook
- Analytics
- Notifications
- QuickActions

### 8.3 页面重定义

- `Onboarding`
  - 从“前端模型配置页”改为“账户/项目初始化页”
- `Settings`
  - 从“本地 API Key 管理页”改为“账户/项目/隐私设置页”

## 9. 验收标准

### 9.1 前端验收

- `src/pages` 中不再存在主链路依赖前端模型 SDK 的逻辑
- 主导航只保留 V1 主流程页面
- 所有核心数据访问统一走 `src/api/`
- 未登录访问受保护页面会跳转登录
- 页面有 loading/empty/error 占位

### 9.2 后端验收

- `backend/` 可以本地启动
- 存在 `/api/v1/health`
- 存在统一响应包络
- 存在最小 auth/project/subject/asset/job 路由
- 存在 AI Gateway 抽象层目录

### 9.3 联调验收

- 能完成登录
- 能创建项目
- 能写入主人公信息
- 能申请上传并完成素材入库
- 前端可以看到真实素材列表

## 10. 严格禁止事项

1. 不要重写 UI。
2. 不要在 V0 引入 Redux 或 Next.js。
3. 不要让前端继续保存生产模型密钥。
4. 不要把延后页面重新拉进主导航。
5. 不要在没有统一 API 契约前并行乱写接口。
6. 不要先做视频和家庭协作。

## 11. 推荐执行顺序

1. 前端先搭 `types/api/auth` 与路由守卫。
2. 后端同时搭最小服务骨架。
3. 前端重构 `Login`、`Onboarding`、`Navigation`。
4. 后端完成 auth/project/subject 基础接口。
5. 前端接项目初始化流程。
6. 后端完成素材上传与列表接口。
7. 前端接 `Capture` 与 `Archive`。
8. 最后再处理 `Timeline`、`Writing`、`Preview` 的真实数据占位。

## 12. 风险提示

- 最大风险不是技术，而是范围滑动。
- 第二大风险是 agent 直接修改页面实现，却不先建立类型与 API 层。
- 第三大风险是后端直接把模型 SDK 写进业务模块，导致多模型抽象失效。
- 第四大风险是后端目录仍按 `modules/` 横切组织，导致 API、服务、数据访问和外部集成混在一起。
