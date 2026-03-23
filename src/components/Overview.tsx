import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { TeamStats, WeeklyReport } from '../types';
import { TrendingUp, TrendingDown, Users, Target, AlertCircle, CheckCircle2, MessageSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom tick component for wrapping dimension text
const WrappedTick = (props: any) => {
  const { payload, x, y, textAnchor, index } = props;
  const value = payload.value;
  
  // Split 4-character Chinese strings into 2+2 for better fit in small spaces
  const shouldWrap = value.length > 3;
  const line1 = shouldWrap ? value.slice(0, 2) : value;
  const line2 = shouldWrap ? value.slice(2) : '';

  // To ensure the two lines are centered relative to each other, we use textAnchor="middle".
  // We adjust the x offset based on the original textAnchor to prevent overlapping the radar.
  let dx = 0;
  if (textAnchor === 'start') dx = 12;
  if (textAnchor === 'end') dx = -12;

  return (
    <g transform={`translate(${x + dx},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor="middle"
        fill="#71717a"
        fontSize={9}
        fontWeight={500}
      >
        <tspan x={0} dy="0">{line1}</tspan>
        {shouldWrap && <tspan x={0} dy="10">{line2}</tspan>}
      </text>
    </g>
  );
};

interface OverviewProps {
  stats: TeamStats;
  reports: WeeklyReport[];
}

export const Overview: React.FC<OverviewProps> = ({ stats, reports }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const distributionData = [
    { name: '优秀', value: stats.distribution.excellent, color: '#10b981' },
    { name: '良好', value: stats.distribution.good, color: '#34d399' },
    { name: '中等', value: stats.distribution.fair, color: '#f59e0b' },
    { name: '待提升', value: stats.distribution.needsImprovement, color: '#f97316' },
    { name: '待改进', value: stats.distribution.needsCorrection, color: '#f43f5e' },
  ];

  const getGradeFromScore = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    if (score >= 60) return '待提升';
    return '待改进';
  };

  const scoreDiff = stats.averageScore - stats.previousAverageScore;

  const lowPerformers = reports.filter(r => r.totalScore < 70);
  
  // Default to 2 rows of 4 = 8 items
  const visibleReports = isExpanded ? reports : reports.slice(0, 8);

  return (
    <section className="space-y-8 mb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">团队周报评分总览</h2>
          <p className="text-zinc-500 text-sm">基于本周所有成员周报评分的综合分析</p>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="周报提交率"
          value={`${Math.round((stats.submittedCount / stats.totalPeople) * 100)}%`}
          subValue={`(${stats.submittedCount}/${stats.totalPeople}人)`}
          icon={<Users className="w-4 h-4" />}
          color="indigo"
        />
        <StatCard 
          label="团队平均等级"
          value={getGradeFromScore(stats.averageScore)}
          trend={scoreDiff >= 0 ? 'up' : 'down'}
          trendValue={Math.abs(scoreDiff)}
          icon={<TrendingUp className="w-4 h-4" />}
          color="emerald"
        />
        <StatCard 
          label="团队审阅率"
          value={`${stats.reviewRate}%`}
          icon={<MessageSquare className="w-4 h-4" />}
          color="indigo"
        />
        <StatCard 
          label="团队有效审阅率"
          value={`${stats.effectiveReviewRate}%`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          color="violet"
          highlight
        />
      </div>

      {/* Parallel Radar Charts */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
            <div className="w-1.5 h-3 bg-emerald-500 rounded-full" />
            全员能力维度对比
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleReports.map((report) => (
            <div key={report.id} className="flex flex-col items-center p-4 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors">
              <span className="text-xs font-bold text-zinc-700 mb-4">{report.name}</span>
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={report.dimensionScores}>
                    <PolarGrid stroke="#f4f4f5" />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={<WrappedTick />}
                    />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name={report.name}
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {reports.length > 8 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-8 w-full py-3 border border-zinc-100 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center gap-2 group"
          >
            {isExpanded ? (
              <>收起 <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /></>
            ) : (
              <>展示更多 <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /></>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Distribution */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-zinc-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
              本周评分分布
            </h3>
            <div className="space-y-3">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] text-zinc-500">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-900">{item.value}人</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[180px] w-[180px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focus List: Needs Improvement/Correction */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-xs font-bold text-zinc-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <div className="w-1.5 h-3 bg-rose-500 rounded-full" />
            重点关注名单 (待提升/待改进)
          </h3>
          <div className="space-y-3">
            {lowPerformers.length > 0 ? (
              lowPerformers.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-3">
                    <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full border border-rose-200" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{r.name}</p>
                      <p className="text-[10px] text-zinc-500">{r.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{r.grade}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs">本周全员表现良好，暂无重点关注人员</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down';
  trendValue?: number;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'indigo' | 'violet' | 'rose';
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, trend, trendValue, icon, color, highlight }) => {
  return (
    <div className="p-4 rounded-xl border border-zinc-100 bg-white transition-all hover:border-indigo-200 group">
      <div className="flex items-center justify-between mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-zinc-50 text-zinc-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-0.5 text-[10px] font-bold",
            trend === 'up' ? "text-emerald-500" : "text-rose-500"
          )}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-zinc-900 leading-tight">
            {value}
          </span>
          {subValue && (
            <span className="text-[10px] font-medium text-zinc-400">
              {subValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
