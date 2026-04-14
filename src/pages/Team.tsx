import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus,
  X,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../services/api';
import { Member } from '../types';

const Team: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('全部部门');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleAddMember = async (newMember: Omit<Member, 'id' | 'createdAt'>) => {
    try {
      const member = await apiService.createMember(newMember);
      setMembers([...members, member]);
      setShowAddModal(false);
    } catch (error) {
      console.error('创建成员失败:', error);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (confirm('确定要删除这个成员吗？')) {
      try {
        await apiService.deleteMember(memberId);
        setMembers(members.filter(m => m.id !== memberId));
        setShowDetailModal(false);
      } catch (error) {
        console.error('删除成员失败:', error);
      }
    }
  };

  const handleUpdateMember = async (memberId: string, updates: Partial<Member>) => {
    try {
      await apiService.updateMember(memberId, updates);
      setMembers(members.map(m => m.id === memberId ? { ...m, ...updates } : m));
      setEditingMember(null);
    } catch (error) {
      console.error('更新成员失败:', error);
    }
  };

  const openDetailModal = (member: Member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMember(null);
    setEditingMember(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">加载中...</div>;
  }

  return (
    <div>
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">团队技能矩阵</h1>
          <p className="text-slate-500 mt-2">实时监控 {members.length} 位成员的能力分布与工作负载，科学排期。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500">
            <Search className="mr-2 text-lg" />
            <input 
              className="outline-none bg-transparent w-48" 
              placeholder="搜索成员或技能..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
          >
            <UserPlus className="text-xl" />
            邀请成员
          </button>
        </div>
      </header>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map(member => (
          <div 
            key={member.id} 
            className="member-card bg-slate-50/50 p-6 rounded-[2rem] cursor-pointer hover:shadow-lg transition-all"
            onClick={() => openDetailModal(member)}
          >
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
            <div className="w-full h-[180px] bg-slate-50 rounded-xl mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="none"/>
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="#6366f1" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${Math.round((member.currentLoad / member.weeklyCapacity) * 352)} 352`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{Math.round((member.currentLoad / member.weeklyCapacity) * 100)}%</span>
                    <span className="text-xs text-slate-500">本周负荷</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase">剩余工时</div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${member.currentLoad / member.weeklyCapacity > 0.8 ? 'bg-rose-500' : member.currentLoad / member.weeklyCapacity > 0.6 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                    style={{ width: `${(member.currentLoad / member.weeklyCapacity) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs">
                  <span className="text-slate-400">已用 {member.currentLoad}h</span>
                  <span className="font-bold text-indigo-600">剩余 {(member.weeklyCapacity - member.currentLoad).toFixed(1)}h</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="bg-white px-3 py-1 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200">
                    #{skill}
                  </span>
                ))}
                {member.skills.length > 3 && (
                  <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    +{member.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div 
          onClick={() => setShowAddModal(true)}
          className="border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center p-8 opacity-40 hover:opacity-100 transition-all cursor-pointer"
        >
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

      {showDetailModal && selectedMember && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 flex items-center justify-center" onClick={closeDetailModal}>
          <div className="w-[550px] bg-white rounded-3xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <img className="w-16 h-16 rounded-2xl" src={selectedMember.avatar} />
                <div>
                  {editingMember ? (
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        defaultValue={selectedMember.name}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        className="text-xl font-bold text-slate-900 border-b border-indigo-400 outline-none"
                      />
                      <button 
                        onClick={() => handleUpdateMember(selectedMember.id, editingMember)}
                        className="p-1 bg-indigo-100 rounded-lg"
                      >
                        <CheckCircle2 className="text-indigo-600" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-slate-900">{selectedMember.name}</h3>
                      <p className="text-sm text-slate-500">{selectedMember.role}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingMember(selectedMember)}
                  className="p-2 text-slate-400 hover:text-indigo-600"
                >
                  <Edit3 className="text-xl" />
                </button>
                <button 
                  onClick={() => handleDeleteMember(selectedMember.id)}
                  className="p-2 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="text-xl" />
                </button>
                <button onClick={closeDetailModal} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className={`w-3 h-3 ${selectedMember.status === 'online' ? 'bg-emerald-500' : selectedMember.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'} rounded-full`}></span>
              <span className="text-sm font-medium text-slate-600">
                {selectedMember.status === 'online' ? '在线工作' : selectedMember.status === 'busy' ? '专注中' : '离线/休假'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="text-indigo-500" />
                  <span className="text-sm font-bold text-slate-900">本周工时统计</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">已使用工时</span>
                    <span className="font-bold text-slate-900">{selectedMember.currentLoad}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">剩余工时</span>
                    <span className="font-bold text-indigo-600">{(selectedMember.weeklyCapacity - selectedMember.currentLoad).toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">工作容量</span>
                    <span className="font-bold text-slate-900">{selectedMember.weeklyCapacity}h</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mt-3">
                    <div 
                      className={`h-full ${selectedMember.currentLoad / selectedMember.weeklyCapacity > 0.8 ? 'bg-rose-500' : selectedMember.currentLoad / selectedMember.weeklyCapacity > 0.6 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                      style={{ width: `${(selectedMember.currentLoad / selectedMember.weeklyCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-indigo-900 mb-3">技能概览</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map(skill => (
                    <span key={skill} className="bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                      {skill} ({selectedMember.skillLevels[skill]}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4">技能详情</h4>
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

      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 flex items-center justify-center" onClick={() => setShowAddModal(false)}>
          <div className="w-[500px] bg-white rounded-3xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-900">添加团队成员</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const skillsInput = formData.get('skills') as string;
              const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
              const skillLevels: Record<string, number> = {};
              skills.forEach(skill => {
                skillLevels[skill] = 80;
              });
              const newMember: Omit<Member, 'id' | 'createdAt'> = {
                name: formData.get('name') as string,
                role: formData.get('role') as string,
                avatar: `https://via.placeholder.com/100?text=${(formData.get('name') as string).charAt(0)}`,
                status: 'online',
                skills,
                skillLevels,
                weeklyCapacity: 40,
                currentLoad: 0
              };
              handleAddMember(newMember);
            }}>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">姓名</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入成员姓名"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">职位</label>
                  <input 
                    type="text" 
                    name="role" 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入职位"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">技能 (逗号分隔)</label>
                  <input 
                    type="text" 
                    name="skills" 
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如：Figma, C4D, 视觉设计"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                >
                  添加成员
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;