# Crystal Predict Vault - 完整设置指南

## ✅ 当前状态

### 合约部分

- ✅ Solidity 编译成功
- ✅ PrivateWeatherGuess 合约已部署到 localhost
- ✅ 部署地址：`0x5FbDB2315678afecb367f032d93F642f64180aa3`
- ✅ Hardhat 节点运行在 `http://localhost:8545`

### UI 部分

- ✅ UI 优化完成（动画、过渡效果）
- ✅ 合约地址已配置在 `ui/src/config/contracts.ts`
- ✅ 所有必要的 hooks 和组件已准备好

## 🚀 快速开始

### 1. 启动 Hardhat 节点（如果未运行）

```bash
npx hardhat node
```

输出应该显示：

```
PrivateWeatherGuess contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 2. 启动 UI 开发服务器

```bash
cd ui
npm run dev
```

或使用 bun（如果已安装）：

```bash
cd ui
bun run dev
```

### 3. 在浏览器中打开

访问 `http://localhost:5173`（或 npm 输出中显示的端口）

## 📋 项目结构

```
crystal-predict-vault/
├── contracts/
│   ├── PrivateWeatherGuess.sol    # 主合约（已修复）
│   └── FHECounter.sol              # 示例合约
├── deploy/
│   └── deploy.ts                   # 部署脚本
├── ui/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx            # 优化后的 Hero 组件
│   │   │   ├── PredictionCard.tsx  # 优化后的卡片组件
│   │   │   ├── Leaderboard.tsx     # 优化后的排行榜
│   │   │   ├── AnimatedBackground.tsx  # 新增动画背景
│   │   │   ├── ParticleEffect.tsx      # 新增粒子效果
│   │   │   └── ScrollReveal.tsx        # 新增滚动显示
│   │   ├── config/
│   │   │   └── contracts.ts        # 合约配置
│   │   └── pages/
│   │       └── Index.tsx           # 主页面
│   └── tailwind.config.ts          # Tailwind 配置（已更新）
├── hardhat.config.ts               # Hardhat 配置
└── package.json                    # 项目依赖
```

## 🔧 主要修复

### Solidity 合约修复

1. **删除重复函数**：移除了重复的 `submitPrediction` 和 `getPrediction` 函数
2. **修复函数可见性**：将 `getPredictionRanking` 从 `external` 改为 `public`
   - 原因：`getPredictionPercentile` 内部调用了它
   - 解决：`public` 函数既可外部调用也可内部调用

### UI 优化

1. **Hero 组件**：添加了浮动 blob 动画、旋转环形边框、滑入动画
2. **PredictionCard**：添加了悬停缩放、发光效果、解密动画
3. **Leaderboard**：添加了级联淡入、悬停效果、排名背景
4. **全局动画**：新增 `blob` 动画、延迟工具类、缩放效果

## 📝 可用的 npm 命令

### 合约相关

```bash
# 编译合约
npx hardhat compile

# 启动本地节点
npx hardhat node

# 部署合约
npx hardhat run deploy/deploy.ts --network localhost

# 运行测试
npx hardhat test

# 查看账户
npx hardhat task accounts
```

### UI 相关

```bash
cd ui

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 运行 ESLint
npm run lint
```

## 🌐 网络配置

### 本地开发（Hardhat）

- **Chain ID**: 31337
- **RPC URL**: http://localhost:8545
- **合约地址**: 0x5FbDB2315678afecb367f032d93F642f64180aa3

### Sepolia 测试网（配置中）

- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/{INFURA_API_KEY}
- **合约地址**: 待部署

## 🔐 环境变量

在项目根目录创建 `.env` 文件（可选）：

```
MNEMONIC=test test test test test test test test test test test junk
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 🎨 UI 动画效果

### 已实现的动画

- `animate-float`: Logo 上下浮动
- `animate-glow-pulse`: 脉冲发光效果
- `animate-unlock`: 解锁图标旋转
- `animate-blob`: 背景球体流动变形
- `animate-in`: 淡入滑入效果
- `hover:scale-105`: 悬停放大
- `hover:shadow-glow-cyan`: 悬停发光

### 新增组件

1. **AnimatedBackground**: 可复用的动画背景
2. **ParticleEffect**: Canvas 粒子效果（可选）
3. **ScrollReveal**: 滚动显示动画

## 🐛 故障排除

### 端口 8545 已被占用

```bash
# 杀死占用端口的进程
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 重新启动
npx hardhat node
```

### 合约编译失败

```bash
# 清除缓存
Remove-Item -Path "cache" -Recurse -Force
Remove-Item -Path "artifacts" -Recurse -Force

# 重新编译
npx hardhat compile
```

### UI 无法连接到合约

1. 确保 Hardhat 节点正在运行
2. 检查 `ui/src/config/contracts.ts` 中的合约地址
3. 确保钱包连接到正确的网络（Chain ID: 31337）

## 📚 相关文档

- [UI 优化总结](./UI_OPTIMIZATION_SUMMARY.md)
- [Solidity 修复总结](./SOLIDITY_FIX_SUMMARY.md)
- [Hardhat 文档](https://hardhat.org/)
- [Zama FHEVM 文档](https://docs.zama.ai/fhevm)

## 🎯 下一步

1. **测试合约功能**
   - 提交预测
   - 解密预测
   - 查看排行榜

2. **完善 UI**
   - 添加更多交互效果
   - 优化移动端体验
   - 添加加载状态

3. **部署到 Sepolia**
   - 获取 Infura API 密钥
   - 配置环境变量
   - 部署合约
   - 更新 UI 配置

## 💡 提示

- 使用 Rainbow Kit 连接钱包
- 所有预测数据都是加密的
- 排行榜在预测被揭示后更新
- 使用 Hardhat 的本地账户进行测试

---

**最后更新**: 2025-12-25 **状态**: ✅ 就绪
