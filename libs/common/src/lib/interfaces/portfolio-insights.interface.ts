export interface PortfolioInsights {
  disclaimer: string;
  source: string;
  accounts: {
    name: string;
    currencies: string[];
    topConcentration: { symbol: string; costSharePct: number };
  }[];
  anomalies: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    count: number;
  }[];
}
