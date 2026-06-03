import { Module } from '@nestjs/common';

import { PortfolioInsightsController } from './portfolio-insights.controller';
import { PortfolioInsightsService } from './portfolio-insights.service';

@Module({
  controllers: [PortfolioInsightsController],
  providers: [PortfolioInsightsService]
})
export class PortfolioInsightsModule {}
