import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  PlusCircle, 
  CheckSquare, 
  Clock, 
  Flame, 
  CheckCircle2 
} from 'lucide-react';
import { apiService } from '../services/api';
import { Task } from '../types';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await apiService.fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 计算统计数据
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const totalHours = tasks.reduce((sum, task) => sum + (task.actualHours || task.estimatedHours), 0);
  const urgentTasks = tasks.filter(task => task.priority === 'urgent').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100 * 10) / 10 : 0;

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div>
      {/* 顶部通栏 */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">早安，明远 👋</h1>
          <p className="text-slate-500 mt-1">今天是 {new Date().toLocaleDateString('zh-CN')}，你有 {tasks.length} 个任务需要关注。</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="text-2xl text-slate-400 cursor-pointer hover:text-indigo-600 transition-all" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-semibold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            <PlusCircle className="text-xl" />
            新建任务
          </button>
        </div>
      </header>

      {/* 关键数据卡片 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckSquare className="text-2xl" />
            </div>
            <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">进行中任务</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{inProgressTasks}</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Clock className="text-2xl" />
            </div>
            <span className="text-slate-400 text-xs font-bold bg-slate-50 px-2 py-1 rounded-lg">稳定</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">总消耗工时</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalHours}h</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <Flame className="text-2xl" />
            </div>
            <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-lg">高负载</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">紧急待办项目</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{urgentTasks}</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="text-2xl" />
            </div>
            <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">+5%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">平均完成率</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{completionRate}%</h3>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 任务效率趋势 */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">周交付效率分析</h3>
            <select className="text-sm bg-slate-50 border-none rounded-xl px-3 py-2 outline-none">
              <option>最近 7 天</option>
              <option>最近 30 天</option>
            </select>
          </div>
          <div className="w-full h-[320px] bg-slate-50 rounded-xl flex items-center justify-center">
            <p className="text-slate-400">图表区域</p>
          </div>
        </div>

        {/* 实时动态与讨论 */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">协作动态</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 max-h-[320px]">
            <div className="flex gap-4">
              <img alt="User" className="w-10 h-10 rounded-full flex-shrink-0" src="https://via.placeholder.com/100" />
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900">李佳丽</span> 更新了 
                  <span className="text-indigo-600 font-medium">#元宇宙交互设计</span> 任务状态为 
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">已完成</span>
                </p>
                <span className="text-xs text-slate-400 mt-1 block">10 分钟前</span>
              </div>
            </div>
            <div className="flex gap-4">
              <img alt="User" className="w-10 h-10 rounded-full flex-shrink-0" src="https://via.placeholder.com/100" />
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900">张小龙</span> 在任务 
                  <span className="text-indigo-600 font-medium">#3D渲染引擎优化</span> 下发表了新讨论：
                </p>
                <div className="bg-slate-50 p-3 rounded-xl mt-2 text-xs italic text-slate-500">
                  "目前的着色器在低配设备上性能不佳，我们需要重新审核一下光影方案。"
                </div>
                <span className="text-xs text-slate-400 mt-1 block">25 分钟前</span>
              </div>
            </div>
            <div className="flex gap-4">
              <img alt="User" className="w-10 h-10 rounded-full flex-shrink-0" src="https://via.placeholder.com/100" />
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-900">AI 助手</span> 自动完成了 
                  <span className="text-indigo-600 font-medium">#下周排程计划</span> 的初步生成
                </p>
                <span className="text-xs text-slate-400 mt-1 block">1 小时前</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-3 border border-indigo-100 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all">
            查看全部动态
          </button>
        </div>
      </div>

      {/* 底部快捷推荐 */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">AI 智能分析报告已生成</h3>
            <p className="opacity-80 text-sm mb-6 max-w-[280px]">
              基于过去30天的数据，系统检测到团队在视觉设计环节存在瓶颈，建议优化流程。
            </p>
            <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm inline-block hover:shadow-lg transition-all">
              立即查看建议
            </button>
          </div>
          <div className="text-[120px] opacity-20 absolute -right-4 -bottom-4 rotate-12">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </div>
            <div>
              <h4 className="font-bold">团队本周星成员</h4>
              <p className="text-xs text-slate-400">贡献度排名第一</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img alt="Star Member" className="w-14 h-14 rounded-2xl border-2 border-emerald-500" src="https://via.placeholder.com/100" />
            <div>
              <p className="text-lg font-bold">赵美玲</p>
              <p className="text-sm text-slate-400">提前完成了 4 项高难度任务，保持 0 bug 率。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;