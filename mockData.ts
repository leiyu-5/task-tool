import { Task, Member, ScheduleResult } from '../types';

// Mock成员数据
export const mockMembers: Member[] = [
  {
    id: '1',
    name: '赵美玲',
    role: '资深 UI/UX 设计师',
    avatar: 'https://via.placeholder.com/100?text=ZM',
    status: 'online',
    skills: ['Figma', 'C4D', 'AI交互', '视觉设计', '用户研究'],
    skillLevels: {
      'Figma': 95,
      'C4D': 80,
      'AI交互': 75,
      '视觉设计': 90,
      '用户研究': 85
    },
    weeklyCapacity: 40,
    currentLoad: 26,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '张小龙',
    role: '交互开发工程师',
    avatar: 'https://via.placeholder.com/100?text=ZXL',
    status: 'busy',
    skills: ['React', 'Three.js', 'JavaScript', 'CSS', 'UI动效'],
    skillLevels: {
      'React': 98,
      'Three.js': 95,
      'JavaScript': 96,
      'CSS': 90,
      'UI动效': 92
    },
    weeklyCapacity: 40,
    currentLoad: 36.8,
    createdAt: '2026-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '李佳丽',
    role: '视觉插画师',
    avatar: 'https://via.placeholder.com/100?text=JL',
    status: 'away',
    skills: ['Procreate', '手绘', '视觉设计', '插画', '品牌设计'],
    skillLevels: {
      'Procreate': 98,
      '手绘': 95,
      '视觉设计': 92,
      '插画': 96,
      '品牌设计': 88
    },
    weeklyCapacity: 40,
    currentLoad: 0,
    createdAt: '2026-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: '陈明远',
    role: '高级创意总监',
    avatar: 'https://via.placeholder.com/100?text=CMY',
    status: 'online',
    skills: ['创意策划', '项目管理', '品牌策略', '用户体验', '团队管理'],
    skillLevels: {
      '创意策划': 95,
      '项目管理': 90,
      '品牌策略': 92,
      '用户体验': 88,
      '团队管理': 94
    },
    weeklyCapacity: 40,
    currentLoad: 20,
    createdAt: '2026-01-04T00:00:00Z'
  }
];

// Mock任务数据
export const mockTasks: Task[] = [
  {
    id: '1',
    title: '元宇宙风格主视觉海报设计',
    description: '需要为本次2026夏季战役设计一套极具“元宇宙”和“数字生命”质感的主视觉系统。要求包含：3D抽象元素、流体梯度色彩、以及可动态拉伸的版式设计。成品需提供PSD及WebP格式。',
    priority: 'urgent',
    status: 'todo',
    dueDate: '2026-04-12T00:00:00Z',
    estimatedHours: 8,
    skills: ['视觉设计', 'C4D', 'Figma'],
    tags: ['视觉设计'],
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z'
  },
  {
    id: '2',
    title: '社交媒体发布计划表整理',
    description: '整理2026夏季战役的社交媒体发布计划，包括平台选择、内容类型、发布时间等。',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-04-15T00:00:00Z',
    estimatedHours: 4,
    skills: ['创意策划', '项目管理'],
    tags: ['市场营销'],
    createdAt: '2026-04-02T00:00:00Z',
    updatedAt: '2026-04-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'H5互动页面动画效果实现',
    description: '实现夏季战役H5互动页面的动画效果，包括滚动触发、3D转场等。',
    priority: 'high',
    status: 'in_progress',
    assignee: '2',
    dueDate: '2026-04-10T00:00:00Z',
    estimatedHours: 12,
    actualHours: 7.8,
    skills: ['React', 'Three.js', 'UI动效'],
    tags: ['前端开发'],
    createdAt: '2026-04-03T00:00:00Z',
    updatedAt: '2026-04-08T00:00:00Z'
  },
  {
    id: '4',
    title: '品牌升级色值表复核',
    description: '复核并更新品牌升级后的色值表，确保所有设计资产使用正确的色彩规范。',
    priority: 'low',
    status: 'in_progress',
    assignee: '1',
    dueDate: '2026-04-18T00:00:00Z',
    estimatedHours: 2,
    actualHours: 1,
    skills: ['视觉设计', 'Figma'],
    tags: ['视觉设计'],
    createdAt: '2026-04-04T00:00:00Z',
    updatedAt: '2026-04-09T00:00:00Z'
  },
  {
    id: '5',
    title: '活动预热文案初稿编写',
    description: '编写2026夏季战役的活动预热文案，包括社交媒体、官网等渠道的内容。',
    priority: 'medium',
    status: 'completed',
    assignee: '4',
    dueDate: '2026-04-09T00:00:00Z',
    estimatedHours: 6,
    actualHours: 5.5,
    skills: ['创意策划', '品牌策略'],
    tags: ['市场营销'],
    createdAt: '2026-04-05T00:00:00Z',
    updatedAt: '2026-04-09T00:00:00Z'
  }
];

// Mock排程结果
export const mockScheduleResults: ScheduleResult[] = [
  {
    taskId: '1',
    memberId: '1',
    scheduledDate: '2026-04-10T00:00:00Z',
    hours: 8,
    status: 'scheduled'
  },
  {
    taskId: '2',
    memberId: '4',
    scheduledDate: '2026-04-11T00:00:00Z',
    hours: 4,
    status: 'scheduled'
  },
  {
    taskId: '3',
    memberId: '2',
    scheduledDate: '2026-04-08T00:00:00Z',
    hours: 12,
    status: 'scheduled'
  },
  {
    taskId: '4',
    memberId: '1',
    scheduledDate: '2026-04-12T00:00:00Z',
    hours: 2,
    status: 'scheduled'
  }
];