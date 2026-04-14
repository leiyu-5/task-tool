import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  PlusCircle, 
  Menu, 
  Calendar, 
  ListChecks, 
  Paperclip,
  X,
  Share2,
  Trash2
} from 'lucide-react';
import { apiService } from '../services/api';
import { Task } from '../types';

const Board: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await apiService.fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('获取任务失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 按状态分组任务
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // 打开任务详情抽屉
  const openDrawer = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  // 关闭任务详情抽屉
  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedTask(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 头部视图切换与操作 */}
      <header className="flex flex-col gap-6 mb-8 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              创意营销战役 - 2026 夏季
              <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">主干项目</span>
            </h2>
            <p className="text-slate-500 mt-1">项目截止日期：2026年6月15日 · 剩余时间 65 天</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3 mr-4">
              <img alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" src="https://via.placeholder.com/100" />
              <img alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" src="https://via.placeholder.com/100" />
              <img alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" src="https://via.placeholder.com/100" />
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">+12</div>
            </div>
            <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all">
              <Filter className="text-xl text-slate-600" />
            </button>
            <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all">
              <Search className="text-xl text-slate-600" />
            </button>
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all">
              <PlusCircle className="text-xl" />
          新建列表
            </button>
          </div>
        </div>
        <div className="flex gap-4 border-b border-slate-200">
          <button className="px-6 py-3 border-b-2 border-indigo-600 text-indigo-600 font-bold text-sm">看板视图</button>
          <button className="px-6 py-3 text-slate-500 font-medium text-sm hover:text-slate-700">列表模式</button>
          <button className="px-6 py-3 text-slate-500 font-medium text-sm hover:text-slate-700">甘特图表</button>
          <button className="px-6 py-3 text-slate-500 font-medium text-sm hover:text-slate-700">项目日历</button>
        </div>
      </header>

      {/* 看板主区域 */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {/* 待处理 */}
        <div className="kanban-column flex-shrink-0 w-80 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-700">待处理</h4>
              <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">{todoTasks.length}</span>
            </div>
            <Menu className="text-slate-400 cursor-pointer" />
          </div>
          
          {todoTasks.map(task => (
            <div 
              key={task.id} 
              className="task-card" 
              onClick={() => openDrawer(task)}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${task.priority === 'urgent' ? 'priority-urgent' : task.priority === 'high' ? 'priority-high' : task.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                  {task.priority === 'urgent' ? '紧急' : task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </span>
                {task.tags.map(tag => (
                  <span key={tag} className="bg-indigo-50 text-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <h5 className="font-bold text-slate-800 text-sm mb-3">{task.title}</h5>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="text-slate-300" />
                  <span className="text-[10px] text-slate-400 font-medium">0/4 子任务</span>
                </div>
                <img className="w-6 h-6 rounded-full border border-white" src="https://via.placeholder.com/100" />
              </div>
            </div>
          ))}
          
          <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 text-xs font-bold hover:border-indigo-400 hover:text-indigo-500 transition-all">
            + 添加新任务
          </button>
        </div>

        {/* 进行中 */}
        <div className="kanban-column flex-shrink-0 w-80 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-700">进行中</h4>
              <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full">{inProgressTasks.length}</span>
            </div>
            <Menu className="text-slate-400 cursor-pointer" />
          </div>
          
          {inProgressTasks.map(task => (
            <div 
              key={task.id} 
              className="task-card ring-2 ring-indigo-200" 
              onClick={() => openDrawer(task)}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${task.priority === 'urgent' ? 'priority-urgent' : task.priority === 'high' ? 'priority-high' : task.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                  {task.priority === 'urgent' ? '紧急' : task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </span>
                {task.tags.map(tag => (
                  <span key={tag} className="bg-emerald-50 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <h5 className="font-bold text-slate-800 text-sm mb-2">{task.title}</h5>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-indigo-600 h-full w-[65%]"></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Calendar className="text-lg" />
                  <span className="text-[10px] font-bold">今天到期</span>
                </div>
                <img className="w-6 h-6 rounded-full border border-white" src="https://via.placeholder.com/100" />
              </div>
            </div>
          ))}
        </div>

        {/* 已完成 */}
        <div className="kanban-column flex-shrink-0 w-80 p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-700">已完成</h4>
              <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full">{completedTasks.length}</span>
            </div>
            <Menu className="text-slate-400 cursor-pointer" />
          </div>
          
          {completedTasks.map(task => (
            <div 
              key={task.id} 
              className="task-card opacity-70 grayscale-[0.3]" 
              onClick={() => openDrawer(task)}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider line-through">
                  {task.priority === 'urgent' ? '紧急' : task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
              <h5 className="font-bold text-slate-600 text-sm mb-3 line-through">{task.title}</h5>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-emerald-500">
                  <svg className="text-lg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span className="text-[10px] font-bold">已于昨日归档</span>
                </div>
                <img className="w-6 h-6 rounded-full border border-white opacity-50" src="https://via.placeholder.com/100" />
              </div>
            </div>
          ))}
        </div>

        {/* 空列表 */}
        <div className="kanban-column flex-shrink-0 w-80 p-4 border-2 border-dashed border-slate-300 bg-transparent opacity-50 flex items-center justify-center">
          <button className="flex flex-col items-center gap-2">
            <svg className="text-4xl text-slate-400" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span className="text-sm font-bold text-slate-500 tracking-wider">创建新阶段</span>
          </button>
        </div>
      </div>

      {/* 任务详情抽屉 */}
      {drawerOpen && selectedTask && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 flex justify-end" onClick={closeDrawer}>
          <div className="w-[500px] h-full bg-white shadow-2xl flex flex-col pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600" onClick={closeDrawer}>
                  <X className="text-2xl" />
                </button>
                <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">任务详情</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600"><Share2 className="text-xl" /></button>
                <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="text-xl" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${selectedTask.priority === 'urgent' ? 'priority-urgent' : selectedTask.priority === 'high' ? 'priority-high' : selectedTask.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                  {selectedTask.priority === 'urgent' ? '紧急' : selectedTask.priority === 'high' ? '高' : selectedTask.priority === 'medium' ? '中' : '低'}
                </span>
                {selectedTask.tags.map(tag => (
                  <span key={tag} className="bg-indigo-50 text-indigo-500 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">{selectedTask.title}</h3>
              <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">负责人</p>
                  <div className="flex items-center gap-3">
                    <img className="w-8 h-8 rounded-full" src="https://via.placeholder.com/100" />
                    <span className="text-sm font-bold text-slate-700">陈明远 (你)</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">截止日期</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-indigo-500 text-xl" />
                    <span className="text-sm font-bold text-slate-700">{new Date(selectedTask.dueDate).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="text-slate-400" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <line x1="21" y1="10" x2="7" y2="10"/>
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/>
                    <line x1="21" y1="18" x2="7" y2="18"/>
                  </svg>
                  任务描述
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl">
                  {selectedTask.description}
                </p>
              </div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ListChecks className="text-slate-400" />
                    子任务拆解 (1/4)
                  </h4>
                  <span className="text-[10px] text-indigo-600 font-bold">25%</span>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-emerald-100 bg-emerald-50/30 rounded-xl cursor-pointer">
                    <svg className="text-emerald-500 text-xl" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span className="text-sm text-slate-400 line-through">收集风格意向图 (Pinterest/Behance)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-100 hover:bg-slate-50 rounded-xl cursor-pointer">
                    <svg className="text-slate-300 text-xl" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span className="text-sm text-slate-700 font-medium">绘制 3 版不同色调的线框草图</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-100 hover:bg-slate-50 rounded-xl cursor-pointer">
                    <svg className="text-slate-300 text-xl" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span className="text-sm text-slate-700 font-medium">C4D 模型渲染与打光</span>
                  </label>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Paperclip className="text-slate-400" />
                  附件 (2)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img className="w-full h-full object-cover" src="https://via.placeholder.com/200" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <svg className="text-white text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </div>
                  </div>
                  <div className="p-3 border border-slate-200 rounded-xl flex items-center gap-3 hover:bg-slate-50 cursor-pointer">
                    <svg className="text-indigo-500 text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate">项目参考.zip</p>
                      <p className="text-[10px] text-slate-400">12.5 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 底部评论区 */}
            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <div className="flex gap-4 mb-4">
                <img className="w-8 h-8 rounded-full" src="https://via.placeholder.com/100" />
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                  <textarea className="w-full text-xs outline-none border-none bg-transparent resize-none" placeholder="发表你的讨论..." rows={2}></textarea>
                  <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-2">
                    <div className="flex gap-2 text-slate-400 text-lg">
                      <svg className="hover:text-indigo-500 cursor-pointer" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                      <svg className="hover:text-indigo-500 cursor-pointer" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <svg className="hover:text-indigo-500 cursor-pointer" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </div>
                    <button className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-lg hover:bg-indigo-700">发送</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;