import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { ReviewOverview } from './components/ReviewOverview';
import { ReportCard } from './components/ReportCard';
import { ReviewSummary } from './components/ReviewSummary';
import { MOCK_REPORTS, WEEKS, getTeamStats, MOCK_REVIEW_SUMMARY } from './data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [selectedWeek, setSelectedWeek] = useState(WEEKS[0]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'reviews'>('dashboard');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currentReports = useMemo(() => MOCK_REPORTS[selectedWeek] || [], [selectedWeek]);
  const stats = useMemo(() => {
    const currentIndex = WEEKS.indexOf(selectedWeek);
    const previousWeek = WEEKS[currentIndex + 1];
    const previousReports = previousWeek ? MOCK_REPORTS[previousWeek] : undefined;
    return getTeamStats(currentReports, previousReports);
  }, [currentReports, selectedWeek]);

  const handlePersonClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 400);
  };

  const scrollToTop = () => {
    const container = document.getElementById('main-content');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Sidebar 
        reports={currentReports}
        weeks={WEEKS}
        selectedWeek={selectedWeek}
        currentView={currentView}
        onWeekChange={setSelectedWeek}
        onPersonClick={handlePersonClick}
        onViewChange={setCurrentView}
      />

      <main 
        id="main-content"
        className="flex-1 ml-80 overflow-y-auto scroll-smooth custom-scrollbar relative"
        onScroll={handleScroll}
      >
        <div className="max-w-5xl mx-auto px-8 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedWeek}-${currentView}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {currentView === 'dashboard' ? (
                <>
                  <Overview stats={stats} reports={currentReports} />
                  <div className="mt-16 space-y-12">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                      <h2 className="text-xl font-bold text-zinc-900 tracking-tight">成员评分详情</h2>
                      <span className="text-xs font-medium text-zinc-500">
                        共 {currentReports.length} 份报告
                      </span>
                    </div>

                    <div className="space-y-8">
                      {currentReports.map((report) => (
                        <ReportCard key={report.id} report={report} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ReviewOverview stats={stats} />
                  <div className="mt-16">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-8">
                      <h2 className="text-xl font-bold text-zinc-900 tracking-tight">管理者审阅汇总详情</h2>
                      <span className="text-xs font-medium text-zinc-500">
                        {selectedWeek} 审阅分析
                      </span>
                    </div>
                    <div className="space-y-12">
                      {currentReports.map((report) => (
                        <ReviewSummary 
                          key={`review-${report.name}`} 
                          managerName={report.name} 
                          data={MOCK_REVIEW_SUMMARY[selectedWeek][report.name] || {
                            reviews: [],
                            validPercentage: 0,
                            ratingReason: '暂无审阅数据'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-12 h-12 bg-zinc-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-zinc-800 transition-colors z-30"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d8;
        }
      `}</style>
    </div>
  );
}
