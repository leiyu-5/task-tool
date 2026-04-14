// 腾讯云配置
interface CloudConfig {
  useMock: boolean;
  envId: string;
}

// 当前配置 - 使用Mock数据（确保页面正常显示）
export const cloudConfig: CloudConfig = {
  useMock: true,
  envId: 'test111-5gj0t9riba9c312c'
};

// 生产环境配置（数据库配置完成后启用）
export const productionConfig: CloudConfig = {
  useMock: false,
  envId: 'test111-5gj0t9riba9c312c'
};