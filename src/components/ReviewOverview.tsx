import React from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { TeamStats } from '../types';
import { CheckCircle2, MessageSquare, Users, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReviewOverviewProps {
  stats: TeamStats;
}

export const ReviewOverview: React.FC<ReviewOverviewProps> = ({ stats }) => {
  const distributionData = [
    { name: '有效审阅', value: stats.effectiveReviewRate, color: '#10b981' },
    { name: '无效审阅', value: 100 - stats.effectiveReviewRate, color: '#f43f5e' },
  ];

  // Mock data for all managers - sorted from high to low
  const managerPerformance = [
    { name: '康晓华', rate: 92 },
    { name: '白九梅', rate: 90 },
    { name: '曹晶晶', rate: 88 },
    { name: '杨蔚光', rate: 85 },
    { name: '周廉', rate: 72 },
    { name: '杨端', rate: 68 },
    { name: '张锐', rate: 65 },
    { name: '刘静', rate: 62 },
    { name: '张昕', rate: 58 },
    { name: '于晓波', rate: 55 },
  ].sort((a, b) => b.rate - a.rate);

  return (
    <section className="space-y-8 mb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">审阅质量总览</h2>
          <p className="text-zinc-500 text-sm">基于管理层对下属周报审阅反馈的深度分析</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="团队审阅率"
          value={`${stats.reviewRate}%`}
          icon={<Users className="w-4 h-4" />}
          color="indigo"
        />
        <StatCard 
          label="团队有效审阅率"
          value={`${stats.effectiveReviewRate}%`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          color="emerald"
          highlight
        />
        <StatCard 
          label="审阅不达标人数"
          value="3人"
          subValue="有效率低于70%"
          icon={<ShieldCheck className="w-4 h-4" />}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Effective Rate Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center">
          <h3 className="text-sm font-bold text-zinc-900 mb-6 w-full flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            全团队审阅有效性
          </h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
              <span className="text-2xl font-black text-emerald-600">{stats.effectiveReviewRate}%</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">有效率</span>
            </div>
          </div>
        </div>

        {/* Manager Ranking */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
              管理者审阅有效率排行
            </div>
            <span className="text-[10px] text-zinc-400 font-normal">全团队管理者</span>
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '300px' }}>
            <div style={{ height: `${managerPerformance.length * 40}px`, minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={managerPerformance} layout="vertical" margin={{ left: 0, right: 60, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 12, fontWeight: 500 }}
                    width={60}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="rate" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                    label={{ position: 'right', formatter: (val: number) => `${val}%`, fill: '#71717a', fontSize: 12, fontWeight: 'bold' }}
                  >
                    {managerPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.rate >= 80 ? '#10b981' : entry.rate >= 70 ? '#3b82f6' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
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
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'indigo' | 'violet' | 'rose';
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, color, highlight }) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    violet: "text-violet-600 bg-violet-50 border-violet-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
  };

  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between",
      highlight ? "bg-emerald-600 border-emerald-500 text-white" : "bg-white border-zinc-200"
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center border", highlight ? "bg-emerald-500 border-emerald-400 text-white" : colorMap[color])}>
          {icon}
        </div>
      </div>
      <div>
        <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", highlight ? "text-emerald-100" : "text-zinc-400")}>
          {label}
        </p>
        <div className="flex flex-col">
          <span className={cn("text-lg font-bold leading-tight", highlight ? "text-white" : "text-zinc-900")}>
            {value}
          </span>
          {subValue && (
            <span className={cn("text-[10px] font-medium", highlight ? "text-emerald-200" : "text-zinc-500")}>
              {subValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
