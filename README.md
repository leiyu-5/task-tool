# 智能任务排程在线工具

## 项目介绍

智能任务排程在线工具是一个基于React + TypeScript + Tailwind CSS开发的任务管理系统，支持多用户在线协同与数据持久化。该工具实现了"1人力=8H、最小技能优先、日期升序"的多约束排程算法，能够智能匹配任务与团队成员的技能和工作负载。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS 3
- **图标库**: Lucide React
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **测试框架**: Jest

## 项目结构

```
├── src/
│   ├── components/          # 通用组件
│   ├── config/              # 配置文件
│   ├── data/                # Mock数据
│   ├── pages/               # 页面组件
│   ├── services/            # API服务
│   ├── types/               # TypeScript类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 应用入口
│   ├── main.tsx             # 主入口
│   └── index.css            # 全局样式
├── public/                  # 静态资源
├── vite.config.ts           # Vite配置
├── tsconfig.json            # TypeScript配置
├── tailwind.config.js       # Tailwind配置
├── package.json             # 项目依赖
└── README.md                # 项目说明
```

## 核心功能

1. **工作台**: 展示关键数据指标、任务效率趋势和协作动态
2. **任务看板**: 支持看板视图、列表模式、甘特图表和项目日历
3. **团队技能**: 展示团队成员的技能矩阵和工作负载
4. **数据报告**: 提供排务分析报告和AI智能优化建议
5. **智能排程**: 基于技能匹配和工时约束的自动任务分配

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 腾讯云部署指南

### 部署到 Webify

1. 登录腾讯云控制台，进入 Webify 服务
2. 点击"新建应用"，选择"前端应用"
3. 选择代码仓库（支持GitHub、GitLab、Gitee等）
4. 配置构建命令：`npm run build`
5. 配置输出目录：`dist`
6. 点击"部署"，等待部署完成

### 部署到云开发 CloudBase

1. 登录腾讯云控制台，进入云开发服务
2. 创建新的云开发环境
3. 在环境设置中开启静态网站托管
4. 上传构建后的`dist`目录到静态网站托管
5. 配置自定义域名（可选）

### 部署到 CVM

1. 购买并配置腾讯云 CVM 实例
2. 安装 Node.js 和 Nginx
3. 克隆代码到服务器
4. 安装依赖并构建项目
5. 配置 Nginx 反向代理
6. 启动应用服务

## 腾讯云集成配置

1. 编辑 `src/config/cloud.ts` 文件，填入腾讯云配置：

```typescript
export const cloudConfig: CloudConfig = {
  useMock: false, // 生产环境设置为false
  baseUrl: 'https://your-api-gateway.com', // 实际API地址
  secretId: 'your-secret-id', // 腾讯云SecretId
  secretKey: 'your-secret-key', // 腾讯云SecretKey
  envId: 'your-env-id' // 腾讯云环境ID
};
```

2. 配置云函数 SCF：
   - 创建云函数处理任务和成员数据的CRUD操作
   - 配置API网关作为函数的访问入口

3. 配置云数据库 TCB：
   - 创建 Task、Member、ScheduleResult 等集合
   - 配置适当的索引和权限

## API接口说明

### 任务管理

- `GET /tasks` - 获取任务列表
- `GET /tasks/:id` - 获取单个任务
- `POST /tasks` - 创建任务
- `PUT /tasks/:id` - 更新任务
- `DELETE /tasks/:id` - 删除任务

### 成员管理

- `GET /members` - 获取成员列表
- `GET /members/:id` - 获取单个成员
- `POST /members` - 创建成员
- `PUT /members/:id` - 更新成员
- `DELETE /members/:id` - 删除成员

### 排程管理

- `POST /schedule` - 保存排程结果
- `GET /schedule` - 获取排程结果

## 核心算法说明

智能排程算法实现了以下规则：

1. **1人力=8H约束**：每个成员每天工作时间不超过8小时
2. **技能100%匹配**：任务只能分配给拥有所有所需技能的成员
3. **最小技能优先**：多人可选时，优先指派技能总数最少的人员
4. **日期升序**：任务按截止日期升序排列，优先处理紧急任务

## 注意事项

1. **Mock数据**：开发环境默认使用Mock数据，生产环境需要切换到真实API
2. **腾讯云配置**：需要在 `src/config/cloud.ts` 中配置正确的腾讯云参数
3. **响应式设计**：应用支持桌面端、平板和移动设备
4. **性能优化**：对于大型团队和任务，建议使用分页加载和缓存策略

## 许可证

MIT License