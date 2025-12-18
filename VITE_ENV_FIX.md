# Vite 环境变量错误修复

## 问题描述

浏览器控制台出现错误：

```
Uncaught ReferenceError: process is not defined
at wagmi.ts:8:20
```

## 根本原因

在 Vite 中，不能使用 `process.env`，需要使用 `import.meta.env`。

`process` 是 Node.js 全局对象，在浏览器环境中不存在。

## 解决方案

### 修改前

```typescript
const PROJECT_ID = process.env.VITE_WALLETCONNECT_PROJECT_ID || "a797aa35c0fadbfc1a53e7f675162ed5";
```

### 修改后

```typescript
const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "a797aa35c0fadbfc1a53e7f675162ed5";
```

## 修改的文件

- `ui/src/lib/wagmi.ts` - 第 8 行

## Vite 环境变量说明

### 访问环境变量

```typescript
// ✅ 正确 - Vite 方式
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ 错误 - Node.js 方式
const apiKey = process.env.VITE_API_KEY;
```

### 环境变量命名规则

- 必须以 `VITE_` 前缀开头
- 例如: `VITE_WALLETCONNECT_PROJECT_ID`

### 定义环境变量

在 `ui/.env` 文件中：

```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_HARDHAT_RPC_URL=http://localhost:8545
```

## 相关文档

- [Vite 环境变量文档](https://vitejs.dev/guide/env-and-mode.html)
- [WEB3MODAL_FIX.md](./WEB3MODAL_FIX.md) - Web3Modal 配置

## 状态

✅ 修复完成 ✅ UI 已热更新 ✅ 无运行时错误
