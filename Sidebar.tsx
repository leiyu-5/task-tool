import React from 'react';
import { 
  Layout, 
  Clapperboard, 
  Users, 
  BarChart3, 
  Settings,
  CalendarCheck
} from 'lucide-react';

type Route = 'dashboard' | 'board' | 'team' | 'reports' | 'schedule';

interface SidebarProps {
  activeRoute: Route;
  onRouteChange: (route: Route) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRoute, onRouteChange }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white text-2xl font-bold">V</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">VisionTask</span>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <button 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeRoute === 'dashboard' ? 'sidebar-item-active' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
          onClick={() => onRouteChange('dashboard')}
        >
          <Layout className="text-xl" />
          <span className="font-medium">工作台</span>
        </button>
        <button 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeRoute === 'board' ? 'sidebar-item-active' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
          onClick={() => onRouteChange('board')}
        >
          <Clapperboard className="text-xl" />
          <span className="font-medium">任务看板</span>
        </button>
        <button 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeRoute === 'team' ? 'sidebar-item-active' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
          onClick={() => onRouteChange('team')}
        >
          <Users className="text-xl" />
          <span className="font-medium">团队技能</span>
        </button>
        <button 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeRoute === 'schedule' ? 'sidebar-item-active' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
          onClick={() => onRouteChange('schedule')}
        >
          <CalendarCheck className="text-xl" />
          <span className="font-medium">智能排程</span>
        </button>
        <button 
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeRoute === 'reports' ? 'sidebar-item-active' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
          onClick={() => onRouteChange('reports')}
        >
          <BarChart3 className="text-xl" />
          <span className="font-medium">数据报告</span>
        </button>
        <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">设置</div>
        <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">
          <Settings className="text-xl" />
          <span className="font-medium">系统配置</span>
        </button>
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <img 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
              src="https://via.placeholder.com/100" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">陈明远</p>
              <p className="text-xs text-slate-500 truncate">高级创意总监</p>
            </div>
          </div>
          <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all">
            退出登录
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;