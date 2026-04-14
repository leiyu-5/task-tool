// 腾讯云配置
interface CloudConfig {
  // 是否使用Mock数据
  useMock: boolean;
  // API基础URL
  baseUrl: string;
  // 腾讯云SecretId
  secretId: string;
  // 腾讯云SecretKey
  secretKey: string;
  // 腾讯云环境ID（云开发）
  envId: string;
}

// 默认配置
export const cloudConfig: CloudConfig = {
  useMock: true, // 开发环境使用Mock数据
  baseUrl: '', // 实际API地址
  secretId: '', // 填入腾讯云SecretId
  secretKey: '', // 填入腾讯云SecretKey
  envId: '' // 填入腾讯云环境ID
};

// 生产环境配置
export const productionConfig: CloudConfig = {
  useMock: false,
  baseUrl: '', // 生产环境API地址
  secretId: '',
  secretKey: '',
  envId: ''
};