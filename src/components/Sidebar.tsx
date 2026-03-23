import React, { useState } from 'react';
import { Search, ChevronRight, Calendar, Users, LayoutDashboard, ClipboardList } from 'lucide-react';
import { WeeklyReport } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  reports: WeeklyReport[];
  weeks: string[];
  selectedWeek: string;
  currentView: 'dashboard' | 'reviews';
  onWeekChange: (week: string) => void;
  onPersonClick: (id: string) => void;
  onViewChange: (view: 'dashboard' | 'reviews') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  reports,
  weeks,
  selectedWeek,
  currentView,
  onWeekChange,
  onPersonClick,
  onViewChange
}) => {
  const [search, setSearch] = useState('');

  const filteredReports = reports.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-80 h-screen bg-zinc-50 border-r border-zinc-200 flex flex-col fixed left-0 top-0 z-20">
      {/* Header */}
      <div className="p-6 border-bottom border-zinc-200 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">智能周报</h1>
        </div>

        {/* View Toggle */}
        <div className="flex bg-zinc-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => onViewChange('dashboard')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              currentView === 'dashboard' 
                ? "bg-white text-emerald-600 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            团队周报评分
          </button>
          <button
            onClick={() => onViewChange('reviews')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              currentView === 'reviews' 
                ? "bg-white text-emerald-600 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            <ClipboardList className="w-4 h-4" />
            团队有效审阅率
          </button>
        </div>

        {/* Week Selector */}
        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            历史周报 (近五周)
          </label>
          <div className="flex flex-wrap gap-2">
            {weeks.map(week => (
              <button
                key={week}
                onClick={() => onWeekChange(week)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                  selectedWeek === week 
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-sm" 
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                )}
              >
                {week}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="搜索人员姓名..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Personnel List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        <div className="px-2 mb-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            团队成员 ({filteredReports.length})
          </span>
        </div>
        {filteredReports.map((report) => (
          <button
            key={report.id}
            onClick={() => onPersonClick(report.id)}
            className="w-full group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm transition-all text-left border border-transparent hover:border-zinc-200"
          >
            <img 
              src={report.avatar} 
              alt={report.name} 
              className="w-9 h-9 rounded-lg bg-zinc-200 border border-zinc-100"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">{report.name}</p>
              <p className="text-[11px] text-zinc-500 truncate">{report.role}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                report.totalScore >= 90 ? "bg-emerald-100 text-emerald-700" :
                report.totalScore >= 80 ? "bg-blue-100 text-blue-700" :
                report.totalScore >= 70 ? "bg-amber-100 text-amber-700" :
                report.totalScore >= 60 ? "bg-orange-100 text-orange-700" :
                "bg-rose-100 text-rose-700"
              )}>
                {report.grade}
              </span>
              <ChevronRight className="w-3 h-3 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};
