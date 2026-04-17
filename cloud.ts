// 腾讯云配置
interface CloudConfig {
  useMock: boolean;
  envId: string;
}

// 当前配置 - 启用腾讯云数据库
export const cloudConfig: CloudConfig = {
  useMock: false,
  envId: 'test111-5g0t0llna9c312c'
};