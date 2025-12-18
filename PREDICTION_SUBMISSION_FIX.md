# 预测提交错误修复

## 问题描述

用户点击"创建加密预测"按钮提交预测时，出现以下错误：

```
CreatePredictionDialog.tsx:150 Prediction submission failed: TypeError: submitPrediction is not a function
```

## 根本原因

在 `CreatePredictionDialog.tsx` 中，代码错误地直接调用了 `submitPrediction()` 作为函数：

```typescript
await submitPrediction({...})  // ❌ 错误
```

但 `useSubmitPrediction()` hook 返回的是一个 **React Query mutation 对象**，不是函数。正确的调用方式应该是：

```typescript
await submitPrediction.mutateAsync({...})  // ✅ 正确
```

## 修复方案

修改 `ui/src/components/CreatePredictionDialog.tsx` 第 127 行：

**修改前**:

```typescript
await submitPrediction({
  location: formData.location.trim(),
  targetDate: targetTimestamp,
  temperature: temperature,
  confidence: formData.confidence,
});
```

**修改后**:

```typescript
await submitPrediction.mutateAsync({
  location: formData.location.trim(),
  targetDate: targetTimestamp,
  temperature: temperature,
  confidence: formData.confidence,
});
```

## 修改的文件

- `ui/src/components/CreatePredictionDialog.tsx` - 第 127 行

## 结果

- ✅ 预测提交现在可以正常工作
- ✅ 用户可以成功提交加密预测
- ✅ 表单在提交后正确重置并关闭

## 相关知识

React Query 的 `useMutation` hook 返回一个对象，包含以下方法：

- `mutate()` - 同步调用（不返回 Promise）
- `mutateAsync()` - 异步调用（返回 Promise，可以用 await）
- `isPending` - 提交中状态
- `isError` - 错误状态
- `data` - 返回数据
