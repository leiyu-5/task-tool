// 腾讯云配置
interface CloudConfig {
  // 是否使用Mock数据（开发测试时使用）
  useMock: boolean;
  // 腾讯云环境ID（云开发 CloudBase 环境ID）
  envId: string;
}

// 开发环境配置 - 使用Mock数据
export const cloudConfig: CloudConfig = {
  useMock: true,
  envId: ''
};

// 生产环境配置 - 使用腾讯云数据库
export const productionConfig: CloudConfig = {
  useMock: false,
  envId: ''
};

// 配置说明：
// 1. 登录腾讯云控制台：https://console.cloud.tencent.com/
// 2. 创建云开发（CloudBase）环境
// 3. 获取环境ID（envId）
// 4. 在云开发控制台创建数据库集合：tasks, members, schedule
// 5. 设置数据库权限为"所有用户可读，创建者可写"
// 6. 将环境ID填入上述 envId 字段
// 7. 设置 useMock: false 启用真实数据库