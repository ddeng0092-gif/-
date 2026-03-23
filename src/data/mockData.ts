import { WeeklyReport, TeamStats, ReviewSummaryData } from '../types';

export const WEEKS = ['2024-W10', '2024-W09', '2024-W08', '2024-W07', '2024-W06'];

const NAMES = [
  '白九梅', '杨蔚光', '曹晶晶', '康晓华', '周廉', 
  '杨端', '张锐', '刘静', '张昕', '于晓波'
];

const ROLES = [
  '产品经理', '前端工程师', '后端工程师', 'UI设计师', '测试工程师',
  '数据分析师', '运维工程师', '项目经理', 'HRBP', '运营专家'
];

const generateReport = (name: string, id: string, week: string, index: number): WeeklyReport => {
  // Adjust scores based on index to ensure distribution
  // 0: Excellent (90+), 1-4: Good (80-89), 5-7: Fair (70-79), 8: Needs Improvement (60-69), 9: Needs Correction (<60)
  let baseScore = 75;
  if (index === 0) baseScore = 92;
  else if (index >= 1 && index <= 4) baseScore = 82;
  else if (index >= 5 && index <= 7) baseScore = 72;
  else if (index === 8) baseScore = 62;
  else if (index === 9) baseScore = 52;

  const dimensionScores = [
    { name: '本周进展有效性', score: baseScore + Math.floor(Math.random() * 6) - 3 },
    { name: '下周计划策略性', score: baseScore + Math.floor(Math.random() * 6) - 3 },
    { name: '协同推进', score: baseScore + Math.floor(Math.random() * 6) - 3 },
    { name: '深度思考', score: baseScore + Math.floor(Math.random() * 6) - 3 },
    { name: '审阅与回复', score: baseScore + Math.floor(Math.random() * 6) - 3 }
  ];

  const totalScore = Math.round(dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length);

  let grade = '良好';
  if (totalScore >= 90) grade = '优秀';
  else if (totalScore >= 80) grade = '良好';
  else if (totalScore >= 70) grade = '中等';
  else if (totalScore >= 60) grade = '待提升';
  else grade = '待改进';

  return {
    id,
    name,
    week,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    role: ROLES[Math.floor(Math.random() * ROLES.length)],
    grade,
    summary: '整体表现较为全面，涵盖了本周的进展、下周的计划以及深度思考和协同推进，但在部分细节如进展与季度目标的对齐度、文本质量和具体数据支撑方面仍有改进空间。',
    dimensionScores,
    highlights: [
      { title: '高效推进IIG业务计划与预算沟通', content: '完成了七个主要业务的业务计划Review，明确了业务进展、预算情况及面临的问题，共同探讨解决方案和未来规划。IIG整体预算目标达成共识。' },
      { title: '战略思考深度', content: '详细分析了国家政策和行业趋势对公司的潜在影响，明确指出把握AI变革的机遇。在多个关键业务领域进行了深入的战略研讨。' },
      { title: '任务边界明确', content: 'IIG三年战略规划讨论和IIG云和服务业务规划等任务边界清晰，具体到讨论内容和目标。' }
    ],
    deficiencies: [
      { title: '本周进展与季度目标对齐度不足', content: '部分工作事项未完全覆盖季度目标，如“AI驱动交付效率提升”未有具体进展。' },
      { title: '缺乏具体数据支撑', content: '在“IIG三年战略规划讨论”中，虽然讨论了市场机遇和面临的问题，但未提供具体的数据或案例支撑分析。' },
      { title: '任务边界模糊', content: '数字化委员会启动会仅提到参加启动会，未明确具体目标和讨论内容。' }
    ],
    suggestions: [
      { title: '提高周进展与季度目标的对齐度', content: '确保每个季度目标都有对应的周进展事项，避免遗漏关键任务。' },
      { title: '强化数据支撑', content: '在进行战略分析时，增加具体的数据或案例分析，以便更客观地评估市场机遇和问题。' },
      { title: '明确任务边界', content: '在数字化委员会启动会中明确具体讨论内容和目标，明确具体目标和时间表。' }
    ],
    totalScore
  };
};

export const MOCK_REPORTS: Record<string, WeeklyReport[]> = WEEKS.reduce((acc, week) => {
  acc[week] = NAMES.map((name, index) => generateReport(name, `user-${index}`, week, index));
  return acc;
}, {} as Record<string, WeeklyReport[]>);

export const getTeamStats = (reports: WeeklyReport[], previousReports?: WeeklyReport[]): TeamStats => {
  const avg = reports.reduce((sum, r) => sum + r.totalScore, 0) / reports.length;
  const prevAvg = previousReports 
    ? previousReports.reduce((sum, r) => sum + r.totalScore, 0) / previousReports.length 
    : avg - 2;

  const top = [...reports].sort((a, b) => b.totalScore - a.totalScore)[0].name;
  
  const dimensionAverages = [
    { name: '本周进展有效性', fullMark: 100, value: Math.round(reports.reduce((sum, r) => sum + r.dimensionScores[0].score, 0) / reports.length) },
    { name: '下周计划策略性', fullMark: 100, value: Math.round(reports.reduce((sum, r) => sum + r.dimensionScores[1].score, 0) / reports.length) },
    { name: '协同推进', fullMark: 100, value: Math.round(reports.reduce((sum, r) => sum + r.dimensionScores[2].score, 0) / reports.length) },
    { name: '深度思考', fullMark: 100, value: Math.round(reports.reduce((sum, r) => sum + r.dimensionScores[3].score, 0) / reports.length) },
    { name: '审阅与回复', fullMark: 100, value: Math.round(reports.reduce((sum, r) => sum + r.dimensionScores[4].score, 0) / reports.length) }
  ];

  const sortedDims = [...dimensionAverages].sort((a, b) => b.value - a.value);
  const strongest = sortedDims[0];
  const weakest = sortedDims[sortedDims.length - 1];

  const distribution = {
    excellent: reports.filter(r => r.totalScore >= 90).length,
    good: reports.filter(r => r.totalScore >= 80 && r.totalScore < 90).length,
    fair: reports.filter(r => r.totalScore >= 70 && r.totalScore < 80).length,
    needsImprovement: reports.filter(r => r.totalScore >= 60 && r.totalScore < 70).length,
    needsCorrection: reports.filter(r => r.totalScore < 60).length,
  };

  return {
    averageScore: Math.round(avg),
    previousAverageScore: Math.round(prevAvg),
    totalPeople: reports.length + 2,
    submittedCount: reports.length,
    reviewRate: 92,
    effectiveReviewRate: 68,
    topPerformer: top,
    strongestDimension: strongest,
    weakestDimension: weakest,
    dimensionAverages,
    distribution,
    aiSummary: "本周团队在组织架构调整和KPI制定上推进顺利，协同推进能力表现优异；但普遍在目标SMART法则适配及审阅回复意见上存在不足。"
  };
};

export const MOCK_REVIEW_SUMMARY: Record<string, Record<string, ReviewSummaryData>> = WEEKS.reduce((acc, week) => {
  const weekData: Record<string, ReviewSummaryData> = {};
  
  NAMES.forEach((managerName, mIndex) => {
    const totalToReview = 10;
    const reviews = NAMES.slice(0, totalToReview).map((subName, sIndex) => ({
      id: `review-${mIndex}-${sIndex}`,
      subordinateName: subName,
      content: (mIndex + sIndex) % 3 === 0 ? '审阅意见非常中肯，指出了目标分解中的SMART原则缺失。' : '已阅，继续保持。',
      isValid: (mIndex + sIndex) % 3 === 0,
      reason: (mIndex + sIndex) % 3 === 0 ? '提供了具体的改进建议和方向。' : '审阅内容过于简单，缺乏指导意义。'
    }));

    const validCount = reviews.filter(r => r.isValid).length;
    const validPercentage = Math.round((validCount / totalToReview) * 100);

    weekData[managerName] = {
      reviews,
      validPercentage,
      ratingReason: `${managerName}本周的审阅表现${mIndex % 2 === 0 ? '较为稳健' : '有待提升'}。`,
      totalToReview,
      validCount
    };
  });

  acc[week] = weekData;
  return acc;
}, {} as Record<string, Record<string, ReviewSummaryData>>);
