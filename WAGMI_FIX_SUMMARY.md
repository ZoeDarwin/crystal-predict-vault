# Wagmi 导入错误修复总结

## 问题描述

编译时出现错误：

```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/wagmi.js?v=2dc62d9c'
does not provide an export named 'useContractEvent'
```

## 根本原因

在新版本的 wagmi 中，`useContractEvent` 已被移除或重命名为 `useWatchContractEvent`。

## 解决方案

### 1. 更新导入语句

**修改前**:

```typescript
import { useContractRead, useAccount, useChainId, useWalletClient, useContractEvent } from "wagmi";
```

**修改后**:

```typescript
import { useContractRead, useAccount, useChainId, useWalletClient, useWatchContractEvent } from "wagmi";
```

### 2. 更新 Hook 调用

**修改前**:

```typescript
useContractEvent({
  address: contractAddress as `0x${string}`,
  abi: CONTRACT_ABI,
  eventName: CONTRACT_EVENTS.PREDICTION_SUBMITTED,
  listener: (logs) => {
    // 处理事件
  },
});
```

**修改后**:

```typescript
useWatchContractEvent({
  address: contractAddress as `0x${string}`,
  abi: CONTRACT_ABI,
  eventName: CONTRACT_EVENTS.PREDICTION_SUBMITTED,
  onLogs: (logs) => {
    // 处理事件
  },
});
```

### 关键变化

1. **Hook 名称**: `useContractEvent` → `useWatchContractEvent`
2. **回调参数**: `listener` → `onLogs`

## 修改的文件

- `ui/src/hooks/useWeatherPrediction.ts`

## 修改的函数

1. `useRealtimePredictions()` - 2 个 useContractEvent 调用
2. `useRealtimeLeaderboard()` - 1 个 useContractEvent 调用

## 验证

✅ 所有 `useContractEvent` 已替换为 `useWatchContractEvent` ✅ 所有 `listener` 参数已替换为 `onLogs` ✅
UI 已热更新，无编译错误

## 相关文档

- [Wagmi 官方文档](https://wagmi.sh/)
- [useWatchContractEvent API](https://wagmi.sh/react/api/hooks/useWatchContractEvent)

## 状态

✅ 修复完成 ✅ UI 正常运行 ✅ 无编译错误
