import type { PortfolioInsights } from '@ghostfolio/common/interfaces';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PortfolioInsightsService {
  public getInsights(): PortfolioInsights {
    return {
      disclaimer:
        'Información descriptiva y educativa, no asesoramiento financiero. Datos demo del workshop.',
      source: 'data/workshop/import/ghostfolio-workshop-main.csv',
      accounts: [
        {
          currencies: ['EUR'],
          name: 'MyInvestor Core ETF',
          topConcentration: { costSharePct: 39.5, symbol: 'VWCE.DE' }
        },
        {
          currencies: ['EUR', 'USD'],
          name: 'Trade Republic Growth',
          topConcentration: { costSharePct: 26.2, symbol: 'AAPL' }
        },
        {
          currencies: ['USD'],
          name: 'Crypto Exchange',
          topConcentration: { costSharePct: 60.8, symbol: 'BTC-USD' }
        }
      ],
      anomalies: [
        { count: 1, severity: 'high', type: 'oversell-risk' },
        { count: 1, severity: 'medium', type: 'exact-duplicate' },
        { count: 1, severity: 'medium', type: 'currency-mismatch' },
        { count: 1, severity: 'medium', type: 'price-outlier' },
        { count: 1, severity: 'low', type: 'high-fee' }
      ]
    };
  }
}
