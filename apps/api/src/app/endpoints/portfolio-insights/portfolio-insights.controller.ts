import type { PortfolioInsightsResponse } from '@ghostfolio/common/interfaces';

import { Controller, Get } from '@nestjs/common';

import { PortfolioInsightsService } from './portfolio-insights.service';

@Controller('portfolio-insights')
export class PortfolioInsightsController {
  public constructor(private readonly service: PortfolioInsightsService) {}

  @Get()
  public getPortfolioInsights(): PortfolioInsightsResponse {
    return { insights: this.service.getInsights() };
  }
}
