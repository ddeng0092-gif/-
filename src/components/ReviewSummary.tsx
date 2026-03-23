import React from 'react';
import { ReviewSummaryData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, MessageSquare, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReviewSummaryProps {
  managerName: string;
  data: ReviewSummaryData;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ managerName, data }) => {
  const chartData = [
    { name: '有效审阅', value: data.validPercentage },
    { name: '无效审阅', value: 100 - data.validPercentage },
  ];

  const COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden mb-12">
      {/* Card Header */}
      <div className="px-8 py-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {managerName[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900">{managerName} 的审阅汇总</h3>
            <p className="text-sm text-zinc-500">管理层审阅质量分析报告</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Top Section: Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-50/50 p-6 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">应审阅人数</span>
            <span className="text-3xl font-black text-zinc-900">{data.totalToReview}</span>
            <span className="text-xs font-bold text-zinc-400 mt-1">人</span>
          </div>
          <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/30 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">有效审阅数</span>
            <span className="text-3xl font-black text-emerald-600">{data.validCount}</span>
            <span className="text-xs font-bold text-emerald-500 mt-1">人</span>
          </div>
          <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/30 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">有效审阅率</span>
            <span className="text-3xl font-black text-blue-600">{data.validPercentage}%</span>
            <div className="mt-2 w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full" style={{ width: `${data.validPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Summary Table */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-zinc-50/50 border-b border-zinc-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">下属审阅明细</h3>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">下属姓名</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">审阅意见内容</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">有效性</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">判断理由</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data.reviews.map((review, index) => (
                  <motion.tr 
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-zinc-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-zinc-900">{review.subordinateName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">{review.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      {review.isValid ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>有效</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-rose-500 font-bold text-[10px]">
                          <XCircle className="w-3 h-3" />
                          <span>无效</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-zinc-400 italic">{review.reason}</p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
