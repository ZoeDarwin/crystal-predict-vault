# Solidity 编译错误修复总结

## 问题描述

编译时出现错误：

```
DeclarationError: Undeclared identifier. "getPredictionRanking" is not (or not yet) visible at this point.
--> contracts/PrivateWeatherGuess.sol:411:27
```

## 根本原因

1. **重复函数定义**：合约中有两个重复的 `submitPrediction` 和 `getPrediction` 函数定义
2. **函数可见性问题**：`getPredictionRanking` 被定义为 `external`，但在 `getPredictionPercentile` 函数内部被调用
   - 在 Solidity 中，`external` 函数不能从合约内部直接调用
   - 需要使用 `this.` 前缀或将函数改为 `public`

## 解决方案

### 1. 删除重复的函数定义

删除了第二个 `submitPrediction` 和 `getPrediction` 函数的重复定义（第 195-293 行）

### 2. 修改函数可见性

将 `getPredictionRanking` 从 `external` 改为 `public`：

```solidity
// 修改前
function getPredictionRanking(uint256 predictionId) external view returns (uint256) {

// 修改后
function getPredictionRanking(uint256 predictionId) public view returns (uint256) {
```

这样做的好处：

- `public` 函数既可以从外部调用，也可以从合约内部调用
- 保持了 API 的向后兼容性（外部仍然可以调用）
- 允许 `getPredictionPercentile` 内部调用

## 编译结果

✅ 编译成功！

```
Generating typings for: 12 artifacts in dir: types for target: ethers-v6
Successfully generated 40 typings!
Compiled 8 Solidity files successfully (evm target: cancun).
```

## 警告信息

编译时出现两个警告（非错误）：

1. `_calculateAccuracy` 函数中的 `actualTemperature` 参数未使用
2. `_calculateAccuracy` 函数中的 `encryptedData` 变量未使用

这些是可选的优化，不影响功能。

## 后续建议

1. 可选：移除 `_calculateAccuracy` 中未使用的参数和变量
2. 可选：在实现完整的 FHE 解密逻辑时，使用这些参数
3. 建议：添加单元测试来验证 `getPredictionRanking` 和 `getPredictionPercentile` 的功能

## 文件修改

- **contracts/PrivateWeatherGuess.sol**
  - 删除了重复的函数定义
  - 修改了 `getPredictionRanking` 的可见性从 `external` 到 `public`
