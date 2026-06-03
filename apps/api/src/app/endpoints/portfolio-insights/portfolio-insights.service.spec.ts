import { PortfolioInsightsService } from './portfolio-insights.service';

describe('PortfolioInsightsService', () => {
  let service: PortfolioInsightsService;

  beforeEach(() => {
    service = new PortfolioInsightsService();
  });

  it('returns the deterministic demo portfolio insights', () => {
    const insights = service.getInsights();

    expect(insights.accounts).toHaveLength(3);
    expect(insights.anomalies).toHaveLength(5);
    expect(insights.accounts[0].topConcentration).toEqual({
      costSharePct: 39.5,
      symbol: 'VWCE.DE'
    });
    expect(insights.disclaimer).toContain('no asesoramiento financiero');
  });
});
