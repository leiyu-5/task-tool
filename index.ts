// 任务优先级
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

// 任务状态
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

// 成员状态
export type MemberStatus = 'online' | 'busy' | 'away';

// 任务接口
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  assignee?: string; // 负责人ID
  dueDate: string; // ISO日期字符串
  estimatedHours: number; // 预估工时
  actualHours?: number; // 实际工时
  skills: string[]; // 所需技能
  tags: string[]; // 标签
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

// 成员接口
export interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: MemberStatus;
  skills: string[]; // 拥有技能
  skillLevels: Record<string, number>; // 技能等级 0-100
  weeklyCapacity: number; // 每周工作容量（小时）
  currentLoad: number; // 当前负载（小时）
  createdAt: string;
}

// 排程结果接口
export interface ScheduleResult {
  taskId: string;
  memberId: string;
  scheduledDate: string;
  hours: number;
  status: 'scheduled' | 'pending' | 'failed';
  reason?: string; // 失败原因
}

// 团队接口
export interface Team {
  id: string;
  name: string;
  members: string[]; // 成员ID数组
  createdAt: string;
}

// 项目接口
export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: string[]; // 任务ID数组
  teams: string[]; // 团队ID数组
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}