import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';

import { NotificationService } from '../../services/notification-service';

@Component({
    selector: 'app-coin-edit-page',
    templateUrl: './coin-edit-page.html',
    styleUrl: './coin-edit-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinEditPage {
  private readonly router = inject(Router);
  private readonly coinsService = inject(CoinsService);
  private readonly notification = inject(NotificationService);

  readonly id = input.required<string>();
  readonly coinFieldsConfig = CoinFieldsConfig;

  coinResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.coinsService.getCoinById(params.id)
  });

  onSubmit(coin: Coin): void {
    const id = parseInt(this.id());
    this.coinsService.editCoin({ ...coin, id: id }).subscribe({
        next: (data) => {
          this.notification.show('Coin updated', 'success');
          this.router.navigate(['/coins'])
        },
        error: (err) => {
          this.notification.show('Failed to update coin: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}
