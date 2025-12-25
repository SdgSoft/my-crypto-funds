import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';

import { NotificationService } from '../../services/notification-service';



@Component({
    selector: 'app-coin-new-page',
    templateUrl: './coin-new-page.html',
    styleUrl: './coin-new-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinNewPage {
  private readonly router = inject(Router);
  private readonly coinsService = inject(CoinsService);
  private readonly notification = inject(NotificationService);

  readonly coinFieldsConfig = CoinFieldsConfig;

  readonly defaultCoin: Coin = {
    id: -1, // Or generate a UUID if your service doesn't
    name: '',
    symbol: '',
    price: 0,
    updatedAt: new Date()
    // ... add other required fields from your Coin model
  };

  onSubmit(coin: Coin): void {
    this.coinsService.createCoin(coin).subscribe({
        next: (data) => {
          this.notification.show('Coin created', 'success');
          this.router.navigate(['/coins'])
        },
        error: (err) => {
          this.notification.show('Failed to create coin: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}
