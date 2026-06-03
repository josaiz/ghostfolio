import { PortfolioInsightsResponse } from '@ghostfolio/common/interfaces';
import { DataService } from '@ghostfolio/ui/services';
import { GfValueComponent } from '@ghostfolio/ui/value';

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GfValueComponent, MatButtonModule],
  selector: 'gf-portfolio-insights',
  styleUrls: ['./portfolio-insights.scss'],
  templateUrl: './portfolio-insights.html'
})
export class GfPortfolioInsightsComponent implements OnInit {
  protected readonly error = signal<string | null>(null);
  protected readonly insights = signal<PortfolioInsightsResponse | null>(null);
  protected readonly isLoading = signal(true);

  private readonly dataService = inject(DataService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit() {
    this.fetchInsights();
  }

  protected fetchInsights() {
    this.error.set(null);
    this.isLoading.set(true);

    this.dataService
      .fetchPortfolioInsights()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.error.set('Unable to load demo insights. Please try again.');
          this.insights.set(null);
          this.isLoading.set(false);
        },
        next: (response) => {
          this.insights.set(response);
          this.isLoading.set(false);
        }
      });
  }

  protected getCostShareValue(costSharePct: number) {
    return costSharePct / 100;
  }
}
