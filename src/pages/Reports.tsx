import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  PieChart, 
  Stars
} from 'lucide-react';
import { apiService } from '../services/api';
import { Task, Member } from '../types';

const Reports: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('本季度');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, membersData] = await Promise.all([
          apiService.fetchTasks(),
          apiService.fetchMembers()
        ]);
        setTasks(tasksData);
        setMembers(membersData);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 计算统计数据
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100 * 10) / 10 : 0;
  const delayedTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return task.status !== 'completed' && dueDate < today;
  }).length;
  const delayedRate = totalTasks > 0 ? Math.round((delayedTasks / totalTasks) * 100 * 10) / 10 : 0;
  const totalHours = tasks.reduce((sum, task) => sum + (task.actualHours || task.estimatedHours), 0);
  const avgHoursPerWeek = members.length > 0 ? Math.round((totalHours / members.length) * 10) / 10 : 0;

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div>
      {/* 头部 */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">排务分析报告</h1>
          <p className="text-slate-500 mt-2">基于 AI 算法生成的 2026 Q1 项目效能深度洞察。</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex">
            <button 
              className={`px-4 py-2 rounded-lg transition-all ${timeRange === '本季度' ? 'bg-slate-100 text-slate-900 font-bold text-xs' : 'text-slate-500 font-bold text-xs hover:bg-slate-50'}`}
              onClick={() => setTimeRange('本季度')}
            >
              本季度
            </button>
            <button 
              className={`px-4 py-2 rounded-lg transition-all ${timeRange === '上季度' ? 'bg-slate-100 text-slate-900 font-bold text-xs' : 'text-slate-500 font-bold text-xs hover:bg-slate-50'}`}
              onClick={() => setTimeRange('上季度')}
            >
              上季度
            </button>
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:shadow-sm">
            <Calendar className="text-xl text-slate-600" />
          </button>
        </div>
      </header>

      {/* 顶部核心指标 */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">总任务数</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter">{totalTasks}</h3>
          <div className="flex items-center justify-center gap-1 text-green-500 text-xs mt-2 font-bold">
            <svg className="text-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            +15%
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">平均完成度</p>
          <h3 className="text-4xl font-extrabold text-indigo-600 tracking-tighter">{completionRate}%</h3>
          <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mt-2 font-bold">
            稳定增长
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">延期比例</p>
          <h3 className="text-4xl font-extrabold text-rose-500 tracking-tighter">{delayedRate}%</h3>
          <div className="flex items-center justify-center gap-1 text-green-500 text-xs mt-2 font-bold">
            <svg className="text-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              <polyline points="17 18 23 18 23 12"/>
            </svg>
            -2.1%
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">人均工时/周</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tighter">{avgHoursPerWeek}h</h3>
          <div className="flex items-center justify-center gap-1 text-amber-500 text-xs mt-2 font-bold">
            接近饱和
          </div>
        </div>
      </section>

      {/* 图表展示区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 任务完成趋势 */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-2xl text-indigo-500" />
            交付效率趋势图
          </h3>
          <div className="w-full h-[350px] bg-slate-50 rounded-xl flex items-center justify-center">
            <p className="text-slate-400">趋势图表</p>
          </div>
        </div>

        {/* 工时分布 */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChart className="text-2xl text-purple-500" />
            工时投入比例
          </h3>
          <div className="w-full h-[350px] bg-slate-50 rounded-xl flex items-center justify-center">
            <p className="text-slate-400">饼图图表</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 个人贡献排名 */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">团队贡献之星</h3>
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4">
              <span className="w-6 text-sm font-bold text-slate-300">01</span>
              <img className="w-10 h-10 rounded-xl" src="https://via.placeholder.com/100" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">赵美玲</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5">
                  <div className="bg-indigo-600 h-full w-[95%]"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600">952 pts</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-6 text-sm font-bold text-slate-300">02</span>
              <img className="w-10 h-10 rounded-xl" src="https://via.placeholder.com/100" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">李佳丽</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5">
                  <div className="bg-indigo-400 h-full w-[82%]"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500">810 pts</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-6 text-sm font-bold text-slate-300">03</span>
              <img className="w-10 h-10 rounded-xl" src="https://via.placeholder.com/100" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">张小龙</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5">
                  <div className="bg-indigo-300 h-full w-[78%]"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500">776 pts</span>
            </div>
          </div>
        </div>

        {/* AI 智能优化建议 */}
        <div className="lg:col-span-2 bg-indigo-900 p-8 rounded-[2.5rem] text-white flex flex-col relative overflow-hidden">
          <div className="text-[200px] text-white/5 absolute -right-10 -bottom-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Stars className="text-amber-400" />
              AI 智能效能诊断
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-white/10 rounded-2xl border border-white/5">
                <svg className="text-rose-400 text-2xl flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                  <h4 className="font-bold text-sm mb-1">视觉设计部门产能预警</h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    过去14天内，视觉设计相关的子任务周转率下降了12%。原因可能在于“3D渲染”环节工时估算偏低。建议在下个周期增加插画师的支援权重，或将部分初级建模任务外包。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white/10 rounded-2xl border border-white/5">
                <svg className="text-emerald-400 text-2xl flex-shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                  <h4 className="font-bold text-sm mb-1">研发交付质量显著提升</h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    由于引入了 AI 协作编程插件，代码 Bug 回退率从 8% 降至 1.5%。本季度的技术交付稳定性达到了历史新高，建议保持目前的开发节奏。
                  </p>
                </div>
              </div>
            </div>
            <button className="mt-8 px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:shadow-lg transition-all">
              生成完整优化蓝图
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;