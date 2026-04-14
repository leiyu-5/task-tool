import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RefreshCw, 
  Clock, 
  Users, 
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { Task, Member, ScheduleResult } from '../types';
import { TaskScheduler } from '../utils/scheduler';

const Schedule: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [results, setResults] = useState<ScheduleResult[]>([]);
  const [report, setReport] = useState<{
    totalTasks: number;
    scheduledTasks: number;
    failedTasks: number;
    memberSchedules: {
      memberId: string;
      memberName: string;
      totalScheduledHours: number;
      remainingHours: number;
      taskCount: number;
    }[];
    summary: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

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

  const runSchedule = async () => {
    setScheduling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const scheduleResults = TaskScheduler.scheduleTasks(tasks, members);
      setResults(scheduleResults);
      
      const scheduleReport = TaskScheduler.generateScheduleReport(scheduleResults, tasks, members);
      setReport(scheduleReport);
      
      await apiService.saveSchedule(scheduleResults);
    } catch (error) {
      console.error('排程失败:', error);
    } finally {
      setScheduling(false);
    }
  };

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* 左侧工时看板 */}
      <div className="w-1/2 border-r border-slate-200 p-6 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">工时看板</h1>
          <p className="text-slate-500 mt-2">实时监控团队成员的工作负载分布</p>
        </header>

        {/* 成员卡片 */}
        <div className="space-y-4">
          {members.map(member => (
            <div 
              key={member.id} 
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleMemberClick(member)}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img className="w-14 h-14 rounded-xl" src={member.avatar} />
                  <span className={`absolute -bottom-1 -right-1 w-5 h-5 ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'} border-2 border-white rounded-full`}></span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.status === 'online' ? 'bg-emerald-100 text-emerald-600' : member.status === 'busy' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      {member.status === 'online' ? '在线' : member.status === 'busy' ? '忙碌' : '离线'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{member.role}</p>
                  
                  {/* 进度条 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">本周工时</span>
                      <span className="font-bold text-slate-700">{member.currentLoad}h / {member.weeklyCapacity}h</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${member.currentLoad / member.weeklyCapacity > 0.8 ? 'bg-rose-500' : member.currentLoad / member.weeklyCapacity > 0.6 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                        style={{ width: `${(member.currentLoad / member.weeklyCapacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">已用 {Math.round((member.currentLoad / member.weeklyCapacity) * 100)}%</span>
                      <span className="font-bold text-indigo-600">剩余 {(member.weeklyCapacity - member.currentLoad).toFixed(1)}h</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="text-slate-300" />
              </div>
              
              {/* 技能标签 */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {member.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
                {member.skills.length > 4 && (
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    +{member.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧任务排程 */}
      <div className="flex-1 p-6 flex flex-col">
        {/* 头部 */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">智能排程引擎</h1>
            <p className="text-slate-500 mt-2">基于技能匹配与工时约束的智能任务分配</p>
          </div>
          <button 
            onClick={runSchedule}
            disabled={scheduling}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${scheduling ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
          >
            {scheduling ? (
              <>
                <RefreshCw className="text-xl animate-spin" />
                排程中...
              </>
            ) : (
              <>
                <Play className="text-xl" />
                一键排程
              </>
            )}
          </button>
        </header>

        {/* 排程结果统计 */}
        {report && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-xl">
                  <Clock className="text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">总任务数</p>
                  <p className="text-2xl font-bold text-slate-900">{report.totalTasks}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CheckCircle2 className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">已排程</p>
                  <p className="text-2xl font-bold text-emerald-600">{report.scheduledTasks}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <AlertCircle className="text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">未排程</p>
                  <p className="text-2xl font-bold text-rose-500">{report.failedTasks}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 任务列表 */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-200 rounded-full"></span>
              <span className="text-sm font-medium text-slate-600">待排程</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{todoTasks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
              <span className="text-sm font-medium text-slate-600">进行中</span>
              <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded-full">{inProgressTasks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span className="text-sm font-medium text-slate-600">已完成</span>
              <span className="text-xs bg-emerald-100 px-2 py-0.5 rounded-full">{completedTasks.length}</span>
            </div>
          </div>

          {/* 待排程任务 */}
          <div className="space-y-4">
            {todoTasks.length > 0 ? (
              todoTasks.map(task => {
                const result = results.find(r => r.taskId === task.id);
                const assignedMember = result?.memberId ? members.find(m => m.id === result.memberId) : null;
                
                return (
                  <div 
                    key={task.id} 
                    className={`bg-white rounded-xl p-5 border ${result?.status === 'scheduled' ? 'border-emerald-200 bg-emerald-50/30' : result?.status === 'failed' ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100'} shadow-sm`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${task.priority === 'urgent' ? 'bg-rose-100 text-rose-600' : task.priority === 'high' ? 'bg-amber-100 text-amber-600' : task.priority === 'medium' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                          {task.priority === 'urgent' ? '紧急' : task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                        </span>
                        <span className="text-xs text-slate-400">截止: {new Date(task.dueDate).toLocaleDateString('zh-CN')}</span>
                      </div>
                      {result?.status === 'scheduled' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          已分配
                        </span>
                      )}
                      {result?.status === 'failed' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                          <AlertCircle className="w-3 h-3" />
                          {result.reason}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3">{task.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {task.skills.map(skill => (
                          <span key={skill} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{task.estimatedHours}h</span>
                      </div>
                    </div>
                    {assignedMember && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                        <img className="w-8 h-8 rounded-full" src={assignedMember.avatar} />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{assignedMember.name}</p>
                          <p className="text-xs text-slate-500">预计完成</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl">
                <Clock className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400">暂无待排程任务</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 成员详情弹窗 */}
      {showModal && selectedMember && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 flex items-center justify-center" onClick={closeModal}>
          <div className="w-[500px] bg-white rounded-3xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img className="w-16 h-16 rounded-2xl" src={selectedMember.avatar} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedMember.name}</h3>
                  <p className="text-sm text-slate-500">{selectedMember.role}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="text-slate-400" />
              </button>
            </div>

            {/* 状态 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 ${selectedMember.status === 'online' ? 'bg-emerald-500' : selectedMember.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'} rounded-full`}></span>
                <span className="text-sm font-medium text-slate-600">
                  {selectedMember.status === 'online' ? '在线工作' : selectedMember.status === 'busy' ? '专注中' : '离线/休假'}
                </span>
              </div>
            </div>

            {/* 工时统计 */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <h4 className="text-sm font-bold text-slate-900 mb-3">本周工时统计</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">已使用工时</span>
                  <span className="font-bold text-slate-900">{selectedMember.currentLoad}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">剩余工时</span>
                  <span className="font-bold text-indigo-600">{(selectedMember.weeklyCapacity - selectedMember.currentLoad).toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">工作容量</span>
                  <span className="font-bold text-slate-900">{selectedMember.weeklyCapacity}h</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${selectedMember.currentLoad / selectedMember.weeklyCapacity > 0.8 ? 'bg-rose-500' : selectedMember.currentLoad / selectedMember.weeklyCapacity > 0.6 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                    style={{ width: `${(selectedMember.currentLoad / selectedMember.weeklyCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 技能列表 */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">技能掌握</h4>
              <div className="space-y-3">
                {selectedMember.skills.map(skill => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{skill}</span>
                      <span className="font-bold text-slate-900">{selectedMember.skillLevels[skill]}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full"
                        style={{ width: `${selectedMember.skillLevels[skill]}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;