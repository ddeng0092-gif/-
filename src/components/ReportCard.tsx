import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip
} from 'recharts';
import { WeeklyReport, DimensionScore } from '../types';
import { Check, X, ClipboardCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReportCardProps {
  report: WeeklyReport;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  return (
    <div id={report.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden mb-8 scroll-mt-24 transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-8 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/30">
        <div className="flex items-center gap-5">
          <img src={report.avatar} alt={report.name} className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">{report.name}</h3>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                report.totalScore >= 90 ? "bg-emerald-100 text-emerald-700" :
                report.totalScore >= 80 ? "bg-blue-100 text-blue-700" :
                report.totalScore >= 70 ? "bg-amber-100 text-amber-700" :
                "bg-rose-100 text-rose-700"
              )}>
                等级：{report.grade}
              </span>
            </div>
            <p className="text-zinc-500 text-sm font-medium">{report.role}</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Overall Summary */}
        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
          <p className="text-zinc-700 leading-relaxed text-sm font-medium italic">
            “{report.summary}”
          </p>
        </div>

        {/* Section I & II: Radar Chart and Core Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Radar Chart */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
              <h4 className="font-bold text-lg text-zinc-900">一、能力维度</h4>
            </div>
            <div className="w-full h-72 bg-zinc-50/50 rounded-2xl border border-zinc-100 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={report.dimensionScores}>
                  <PolarGrid stroke="#e4e4e7" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={report.name}
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Core Highlights */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <Check className="w-5 h-5 stroke-[3]" />
              <h4 className="font-bold text-lg">二、核心亮点</h4>
            </div>
            <div className="space-y-4">
              {report.highlights.map((item, idx) => (
                <div key={idx} className="pl-4 border-l-2 border-emerald-100">
                  <h5 className="text-sm font-bold text-zinc-900 mb-1">{idx + 1}. {item.title}</h5>
                  <p className="text-xs text-zinc-600 leading-relaxed">・{item.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Section III: Main Deficiencies */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4 text-rose-500">
            <X className="w-5 h-5 stroke-[3]" />
            <h4 className="font-bold text-lg">三、主要不足</h4>
          </div>
          <div className="space-y-4">
            {report.deficiencies.map((item, idx) => (
              <div key={idx} className="pl-4 border-l-2 border-rose-100">
                <h5 className="text-sm font-bold text-zinc-900 mb-1">{idx + 1}. {item.title}</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">・{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section IV: Improvement Suggestions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <ClipboardCheck className="w-5 h-5" />
            <h4 className="font-bold text-lg">四、改进建议</h4>
          </div>
          <div className="space-y-4">
            {report.suggestions.map((item, idx) => (
              <div key={idx} className="pl-4 border-l-2 border-blue-100">
                <h5 className="text-sm font-bold text-zinc-900 mb-1">{idx + 1}. {item.title}</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">・{item.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
