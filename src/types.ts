export interface DimensionScore {
  name: string;
  score: number;
}

export interface BulletPoint {
  title: string;
  content: string;
}

export interface WeeklyReport {
  id: string;
  name: string;
  avatar: string;
  role: string;
  grade: string;
  summary: string;
  dimensionScores: DimensionScore[];
  highlights: BulletPoint[];
  deficiencies: BulletPoint[];
  suggestions: BulletPoint[];
  totalScore: number;
  week: string;
}

export interface TeamStats {
  averageScore: number;
  previousAverageScore: number;
  totalPeople: number;
  submittedCount: number;
  reviewRate: number;
  effectiveReviewRate: number;
  topPerformer: string;
  strongestDimension: { name: string; value: number };
  weakestDimension: { name: string; value: number };
  dimensionAverages: {
    name: string;
    fullMark: number;
    value: number;
  }[];
  aiSummary: string;
  distribution: {
    excellent: number; // 90-100
    good: number;      // 80-89
    fair: number;      // 70-79
    needsImprovement: number; // 60-69
    needsCorrection: number;  // <60
  };
}

export interface ReviewItem {
  id: string;
  subordinateName: string;
  content: string;
  isValid: boolean;
  reason: string;
}

export interface ReviewSummaryData {
  reviews: ReviewItem[];
  validPercentage: number;
  ratingReason: string;
  totalToReview: number;
  validCount: number;
}
