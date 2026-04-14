import cloudbase from '@cloudbase/js-sdk';
import { cloudConfig } from '../config/cloud';

// CloudBase 实例
let db: any = null;

// 初始化 CloudBase
export const initCloudBase = async () => {
  if (db) return db;

  try {
    const app = cloudbase.init({
      env: cloudConfig.envId
    });

    // 获取数据库实例
    db = app.database();
    return db;
  } catch (error) {
    console.error('CloudBase 初始化失败:', error);
    throw error;
  }
};

// 获取数据库集合
export const getCollection = async (collectionName: string) => {
  const database = await initCloudBase();
  return database.collection(collectionName);
};