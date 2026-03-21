# 06_FRONTEND_AGENT_PROMPT

你是 MEMOIRS 项目的前端实现 agent。你的任务不是重新设计产品，而是在现有 UI 基础上完成 V0 重构，让前端变成一个可接真实后端、可持续演进到 V1 的产品壳。

## 1. 进入任务前必须阅读

按顺序阅读以下文档：

1. [01_PRODUCT_CONSTITUTION.md](d:/memory-UI/01_PRODUCT_CONSTITUTION.md)
2. [02_DOMAIN_MODEL.md](d:/memory-UI/02_DOMAIN_MODEL.md)
3. [03_INFORMATION_ARCHITECTURE.md](d:/memory-UI/03_INFORMATION_ARCHITECTURE.md)
4. [04_API_CONTRACT.md](d:/memory-UI/04_API_CONTRACT.md)
5. [05_V0_EXECUTION_PLAN.md](d:/memory-UI/05_V0_EXECUTION_PLAN.md)

如果你的实现和这些文档冲突，以文档为准。

## 2. 你的目标

完成 V0 前端重构，重点是：

- 建立统一类型层
- 建立统一 API 层
- 建立统一登录态与路由保护
- 移除前端直连模型逻辑
- 调整页面去留与导航
- 让核心页面进入真实产品状态机

## 3. 当前仓库事实

- 现有仓库已经有 React + Vite + Tailwind 页面
- UI 质量高，不允许推倒重来
- 当前大量页面使用 mock 数据
- 当前部分页面直接使用 Gemini SDK 或本地 API Key 逻辑

## 4. 你的硬边界

1. 不要重写 UI 视觉语言。
2. 不要引入 Next.js。
3. 不要引入 Redux。
4. 不要继续在前端保存生产模型密钥。
5. 不要直接在页面组件里写裸 `fetch`。
6. 不要把 `Analytics`、`Notifications`、`QuickActions` 留在主导航。
7. 不要把 `Refinement` 继续当独立主流程页实现。
8. 不要把 `BiographyBook` 继续当 V1 核心页实现。

## 5. 你应优先交付的文件

建议新增：

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

建议修改：

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

## 6. 页面层面的明确要求

### Login

- 改成邮箱登录或 magic link 流
- 不要保留手机号验证码为核心路径

### Onboarding

- 改成首次创建项目与主人公信息
- 删除前端 API Key 配置逻辑

### Settings

- 改成账户、项目、隐私设置
- 不再以本地模型密钥管理为核心

### Writing

- 将 `Refinement` 能力并入右侧助手面板或工具栏
- 不再依赖前端 Gemini SDK

### Preview

- 将 `BiographyBook` 的核心配置合并到这里

### Navigation

- 只保留 V1 主流程导航

## 7. 技术要求

1. 所有服务端调用统一经过 `src/api/`
2. 页面只消费 typed function，不直接拼 HTTP
3. 所有核心页面都必须有 loading、empty、error 状态
4. 未登录访问受保护页面时必须跳转 `/login`
5. `App.tsx` 路由结构要体现 V1 页面去留

## 8. 建议执行顺序

1. 搭类型层
2. 搭 API client 与模块化 API
3. 搭认证上下文与路由守卫
4. 调整 `App.tsx` 和导航
5. 重构 `Login`、`Onboarding`、`Settings`
6. 重构 `Archive`、`Capture`、`Writing`、`Preview`
7. 最后处理 `Home`、`Timeline`

## 9. 验收标准

- 前端主链路不再依赖前端模型 SDK
- 路由结构与 IA 文档一致
- 页面主要数据都走 typed API
- 隐藏页面退出主导航
- 可以在后端未完成时，通过 API stub 跑通前端壳

## 10. 输出要求

完成后你必须说明：

- 改了哪些文件
- 哪些页面职责被重新定义
- 哪些 mock 已移除
- 哪些接口已按契约封装
- 哪些地方还依赖后端完成
