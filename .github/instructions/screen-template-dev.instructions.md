---
description: "Use when implementing or modifying Vue/TypeScript code in this screen-template project. Enforces project coding conventions for structure, style, routing, API access, and quality checks."
name: "Screen Template Dev Conventions"
applyTo: "src/**/*.vue, src/**/*.ts, src/**/*.scss, src/**/*.css"
---
# Screen Template 开发规范（AI 执行版）

适用范围：本仓库前端业务代码，默认用于新增与修改代码场景。

## 技术栈与总体原则

- 使用 Vue 3 + TypeScript，优先 `script setup`。
- 仅在现有结构上扩展，避免无关重构。
- 小步修改，优先复用已有组件、工具与样式能力。

## 目录与模块约定

- 页面组件放在 `src/pages`。
- 通用组件放在 `src/components`。
- 组合式逻辑放在 `src/composables`。
- 工具方法放在 `src/utils`，聚合导出在 `src/utils/index.ts`。
- API 相关放在 `src/api`，网络请求优先复用 `src/api/fetch.ts`。

## Vue 组件约定

- 单文件组件块顺序固定：`template` -> `script` -> `style`。
- 新增 Vue 文件默认使用：`<script setup lang=\"ts\">`。
- 默认使用 `ref`/`computed`/`watch` 等组合式 API；避免 Options API。
- 样式优先使用 UnoCSS 工具类；复杂场景再使用 `scss`。

## TypeScript 约定

- 遵循 `tsconfig.json` 的严格模式（`strict: true`）。
- 不使用 `any` 作为默认解法；确需使用时，先尝试泛型或联合类型。
- 通过 `@/*` 别名进行 `src` 内导入。
- 新增导出遵循现有聚合方式，必要时同步更新对应 `index.ts`。

## 路由约定

- 本项目使用文件系统路由（`vue-router/auto`）。
- 新页面优先通过在 `src/pages` 增加文件注册路由，不手写静态路由表。
- `App.vue` 作为路由承载层，默认保持精简。

## API 与数据请求约定

- 统一使用 `src/api/fetch.ts` 的封装能力发起请求。
- 保持返回结构约定：`{res}` 成功，`{err}` 失败。
- 查询参数与请求体处理保持与现有实现一致，避免重复封装新的请求框架。

## 样式与设计约定

- 优先复用 `unocss.config.ts` 中已定义规则与快捷类（如 `center`、`font-number`）。
- 仅在必要时新增全局样式，避免污染 `basic.scss`。
- 数字大屏类 UI 优先保证可读性、信息层级与响应式适配。

## 代码风格与质量门禁

- 遵循 ESLint 规则：单引号、分号、对象花括号无空格等。
- 允许 `console`，但仅用于开发调试；提交前应清理无意义日志。
- 修改完成后，优先执行并通过：
  - `pnpm lint`
  - `pnpm type-check`

## 变更输出要求（面向 AI）

- 提交最小可行改动，避免修改与任务无关的文件。
- 说明中明确：改了什么、为什么改、可能影响点。
- 若需求与既有规范冲突，先遵循用户明确要求，并在说明中标注冲突点。