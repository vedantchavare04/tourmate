
export interface LandmarkAnalysis {
  identified: boolean;
  name: string | null;
  location: {
    city: string | null;
    country: string | null;
  };
  /** 0 to 1 */
  confidence: number;
  category: string | null;
  description: string;
  history: string | null;
  architecture: string | null;
  culturalSignificance: string | null;
  unescoStatus: string | null;
  bestTimeToVisit: string | null;
  estimatedVisitDuration: string | null;
  interestingFacts: string[];
  travelTips: string[];
  uncertainty: string | null;
}
