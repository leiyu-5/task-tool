import axios from 'axios';
import { cloudConfig } from '../config/cloud';
import { Task, Member, ScheduleResult } from '../types';
import { mockTasks, mockMembers, mockScheduleResults } from '../data/mockData';

// 创建axios实例
const apiClient = axios.create({
  baseURL: `https://${cloudConfig.envId}.service.tcloudbase.com/api`,
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
      return Promise.resolve(mockTasks);
    }
    
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('获取任务失败:', error);
      return mockTasks;
    }
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
    
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取任务失败:', error);
      throw error;
    }
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
    
    try {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await apiClient.post('/tasks', newTask);
      return newTask;
    } catch (error) {
      console.error('创建任务失败:', error);
      throw error;
    }
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
    
    try {
      const updatedTask = {
        ...task,
        updatedAt: new Date().toISOString()
      };
      await apiClient.put(`/tasks/${id}`, updatedTask);
      return { ...(await this.fetchTask(id)), ...updatedTask };
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  }

  // 删除任务
  async deleteTask(id: string): Promise<void> {
    if (cloudConfig.useMock) {
      return Promise.resolve();
    }
    
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('删除任务失败:', error);
      throw error;
    }
  }

  // 获取成员列表
  async fetchMembers(): Promise<Member[]> {
    if (cloudConfig.useMock) {
      return Promise.resolve(mockMembers);
    }
    
    try {
      const response = await apiClient.get('/members');
      return response.data;
    } catch (error) {
      console.error('获取成员失败:', error);
      return mockMembers;
    }
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
    
    try {
      const response = await apiClient.get(`/members/${id}`);
      return response.data;
    } catch (error) {
      console.error('获取成员失败:', error);
      throw error;
    }
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
    
    try {
      const newMember: Member = {
        ...member,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      await apiClient.post('/members', newMember);
      return newMember;
    } catch (error) {
      console.error('创建成员失败:', error);
      throw error;
    }
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
    
    try {
      await apiClient.put(`/members/${id}`, member);
      return { ...(await this.fetchMember(id)), ...member };
    } catch (error) {
      console.error('更新成员失败:', error);
      throw error;
    }
  }

  // 删除成员
  async deleteMember(id: string): Promise<void> {
    if (cloudConfig.useMock) {
      return Promise.resolve();
    }
    
    try {
      await apiClient.delete(`/members/${id}`);
    } catch (error) {
      console.error('删除成员失败:', error);
      throw error;
    }
  }

  // 保存排程结果
  async saveSchedule(schedule: ScheduleResult[]): Promise<ScheduleResult[]> {
    if (cloudConfig.useMock) {
      return Promise.resolve(schedule);
    }
    
    try {
      await apiClient.post('/schedule', schedule);
      return schedule;
    } catch (error) {
      console.error('保存排程失败:', error);
      throw error;
    }
  }

  // 获取排程结果
  async fetchSchedule(): Promise<ScheduleResult[]> {
    if (cloudConfig.useMock) {
      return Promise.resolve(mockScheduleResults);
    }
    
    try {
      const response = await apiClient.get('/schedule');
      return response.data;
    } catch (error) {
      console.error('获取排程失败:', error);
      return mockScheduleResults;
    }
  }
}

// 导出API服务实例
export const apiService = new ApiService();