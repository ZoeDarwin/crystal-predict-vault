# Web3Modal 配置错误修复

## 问题描述

浏览器控制台出现以下错误：

```
Failed to load resource: the server responded with a status of 400 ()
api.web3modal.org/appkit/v1/config?projectId=YOUR_PROJECT_ID...

Failed to load resource: the server responded with a status of 403 ()
[Reown Config] Failed to fetch remote project configuration. Using local/default values.
```

## 根本原因

`YOUR_PROJECT_ID` 是一个占位符，没有被替换为实际的 WalletConnect 项目 ID。

## 解决方案

### 方案 1: 本地开发（推荐）

对于本地开发，我们已经禁用了 WalletConnect，只使用 MetaMask 和 Injected 连接器。

**修改内容**:

- 移除了 `walletConnect` 连接器
- 保留了 `injected()` 和 `metaMask()` 连接器
- 添加了环境变量支持

**文件**: `ui/src/lib/wagmi.ts`

### 方案 2: 生产部署（可选）

如果需要在生产环境中使用 WalletConnect：

1. **获取 Project ID**
   - 访问 https://cloud.walletconnect.com
   - 创建新项目
   - 复制 Project ID

2. **配置环境变量**

   ```bash
   # 在 ui/.env 文件中添加
   VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id
   ```

3. **启用 WalletConnect**
   ```typescript
   // 在 ui/src/lib/wagmi.ts 中取消注释
   walletConnect({ projectId: PROJECT_ID }),
   ```

## 修改的文件

### ui/src/lib/wagmi.ts

- 移除了 `walletConnect` 导入
- 移除了 `walletConnect` 连接器
- 添加了环境变量支持
- 添加了注释说明

### ui/.env.example

- 创建了环境变量示例文件
- 包含了所有可配置的选项

## 当前状态

✅ **本地开发**: 完全正常

- MetaMask 连接器可用
- Injected 连接器可用
- 不再出现 Web3Modal 错误

⏳ **生产部署**: 需要配置

- 需要获取 WalletConnect Project ID
- 需要配置环境变量
- 需要启用 WalletConnect 连接器

## 测试

### 本地测试

1. 打开浏览器 http://localhost:8081/
2. 检查浏览器控制台
3. 不应该看到 Web3Modal 错误
4. 应该能够连接 MetaMask

### 生产测试

1. 配置 WalletConnect Project ID
2. 重新启动 UI 服务器
3. 验证 WalletConnect 连接器可用

## 相关文档

- [WalletConnect 官方文档](https://docs.walletconnect.com/)
- [Wagmi 官方文档](https://wagmi.sh/)
- [Rainbow Kit 官方文档](https://www.rainbowkit.com/)

## 状态

✅ 修复完成 ✅ 本地开发可用 ⏳ 生产部署待配置
