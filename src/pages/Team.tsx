import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus 
} from 'lucide-react';
import { apiService } from '../services/api';
import { Member } from '../types';

const Team: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('全部部门');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersData = await apiService.fetchMembers();
        setMembers(membersData);
      } catch (error) {
        console.error('获取成员失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div>
      {/* 头部操作栏 */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">团队技能矩阵</h1>
          <p className="text-slate-500 mt-2">实时监控 {members.length} 位成员的能力分布与工作负载，科学排期。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500">
            <Search className="mr-2 text-lg" />
            <input className="outline-none bg-transparent w-48" placeholder="搜索成员或技能..." type="text" />
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
            <UserPlus className="text-xl" />
            邀请成员
          </button>
        </div>
      </header>

      {/* 过滤器 */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button 
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${filter === '全部部门' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-500'}`}
          onClick={() => setFilter('全部部门')}
        >
          全部部门
        </button>
        <button 
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === '创意设计' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-500'}`}
          onClick={() => setFilter('创意设计')}
        >
          创意设计
        </button>
        <button 
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === '技术开发' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-500'}`}
          onClick={() => setFilter('技术开发')}
        >
          技术开发
        </button>
        <button 
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === '产品策划' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-500'}`}
          onClick={() => setFilter('产品策划')}
        >
          产品策划
        </button>
        <button 
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === '市场营销' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-500'}`}
          onClick={() => setFilter('市场营销')}
        >
          市场营销
        </button>
      </div>

      {/* 成员网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map(member => (
          <div key={member.id} className="member-card bg-slate-50/50 p-6 rounded-[2rem]">
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <img className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm" src={member.avatar} />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'} border-2 border-white rounded-full`}></span>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 justify-end ${member.status === 'online' ? 'status-online' : member.status === 'busy' ? 'status-busy' : 'status-away'}`}>
                  <svg className="text-xs" width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {member.status === 'online' ? '在线工作' : member.status === 'busy' ? '专注中' : '离线 / 休假'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">负载: {Math.round((member.currentLoad / member.weeklyCapacity) * 100)}%</p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="text-sm text-slate-500">{member.role}</p>
            </div>
            {/* 技能雷达 */}
            <div className="w-full h-[180px] bg-slate-50 rounded-xl mb-4 flex items-center justify-center">
              <p className="text-slate-400">技能雷达图</p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase">本周负荷</div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`bg-${member.status === 'online' ? 'indigo' : member.status === 'busy' ? 'amber' : 'slate'}-500 h-full w-[${Math.round((member.currentLoad / member.weeklyCapacity) * 100)}%]`}></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="bg-white px-3 py-1 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200">
                    #{skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* 添加成员占位符 */}
        <div className="border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-8 opacity-40 hover:opacity-100 transition-all cursor-pointer">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
            <svg className="text-4xl text-slate-400" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <p className="font-bold text-slate-500">添加团队成员</p>
          <p className="text-xs text-slate-400 mt-2">扩展您的创意引擎</p>
        </div>
      </div>
    </div>
  );
};

export default Team;