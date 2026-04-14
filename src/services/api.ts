import axios from 'axios';
import { cloudConfig } from '../config/cloud';
import { Task, Member, ScheduleResult } from '../types';
import { mockTasks, mockMembers, mockScheduleResults } from '../data/mockData';

// 创建axios实例
const apiClient = axios.create({
  baseURL: cloudConfig.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API服务类
class ApiService {
  // 获取任务列表
  async fetchTasks(): Promise<Task[]> {
    if (cloudConfig.useMock) {
      // 使用Mock数据
      return Promise.resolve(mockTasks);
    }
    // 真实API调用
    const response = await apiClient.get('/tasks');
    return response.data;
  }

  // 获取单个任务
  async fetchTask(id: string): Promise<Task> {
    if (cloudConfig.useMock) {
      const task = mockTasks.find(t => t.id === id);
      if (!task) {
        throw new Error('任务不存在');
      }
      return Promise.resolve(task);
    }
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  }

  // 创建任务
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    if (cloudConfig.useMock) {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return Promise.resolve(newTask);
    }
    const response = await apiClient.post('/tasks', task);
    return response.data;
  }

  // 更新任务
  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    if (cloudConfig.useMock) {
      const existingTask = mockTasks.find(t => t.id === id);
      if (!existingTask) {
        throw new Error('任务不存在');
      }
      const updatedTask = {
        ...existingTask,
        ...task,
        updatedAt: new Date().toISOString()
      };
      return Promise.resolve(updatedTask);
    }
    const response = await apiClient.put(`/tasks/${id}`, task);
    return response.data;
  }

  // 删除任务
  async deleteTask(id: string): Promise<void> {
    if (cloudConfig.useMock) {
      return Promise.resolve();
    }
    await apiClient.delete(`/tasks/${id}`);
  }

  // 获取成员列表
  async fetchMembers(): Promise<Member[]> {
    if (cloudConfig.useMock) {
      return Promise.resolve(mockMembers);
    }
    const response = await apiClient.get('/members');
    return response.data;
  }

  // 获取单个成员
  async fetchMember(id: string): Promise<Member> {
    if (cloudConfig.useMock) {
      const member = mockMembers.find(m => m.id === id);
      if (!member) {
        throw new Error('成员不存在');
      }
      return Promise.resolve(member);
    }
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  }

  // 创建成员
  async createMember(member: Omit<Member, 'id' | 'createdAt'>): Promise<Member> {
    if (cloudConfig.useMock) {
      const newMember: Member = {
        ...member,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      return Promise.resolve(newMember);
    }
    const response = await apiClient.post('/members', member);
    return response.data;
  }

  // 更新成员
  async updateMember(id: string, member: Partial<Member>): Promise<Member> {
    if (cloudConfig.useMock) {
      const existingMember = mockMembers.find(m => m.id === id);
      if (!existingMember) {
        throw new Error('成员不存在');
      }
      const updatedMember = {
        ...existingMember,
        ...member
      };
      return Promise.resolve(updatedMember);
    }
    const response = await apiClient.put(`/members/${id}`, member);
    return response.data;
  }

  // 删除成员
  async deleteMember(id: string): Promise<void> {
    if (cloudConfig.useMock) {
      return Promise.resolve();
    }
    await apiClient.delete(`/members/${id}`);
  }

  // 保存排程结果
  async saveSchedule(schedule: ScheduleResult[]): Promise<ScheduleResult[]> {
    if (cloudConfig.useMock) {
      return Promise.resolve(schedule);
    }
    const response = await apiClient.post('/schedule', schedule);
    return response.data;
  }

  // 获取排程结果
  async fetchSchedule(): Promise<ScheduleResult[]> {
    if (cloudConfig.useMock) {
      return Promise.resolve(mockScheduleResults);
    }
    const response = await apiClient.get('/schedule');
    return response.data;
  }
}

// 导出API服务实例
export const apiService = new ApiService();