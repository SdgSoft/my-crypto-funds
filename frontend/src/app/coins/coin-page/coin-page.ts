import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';

import { of } from 'rxjs';
import { DataModalForm } from '../../common/data-modal-form/data-modal-form';
import { NotificationService } from '../../services/notification-service';
import { CoinFieldsConfig } from './coin-fields';

@Component({
    selector: 'app-coin-page',
    templateUrl: './coin-page.html',
    styleUrl: './coin-page.css',
    imports: [DataModalForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinPage {
  readonly closed = output<void>();
  readonly showModal = signal(true);

  private readonly coinsService = inject(CoinsService);
  private readonly notification = inject(NotificationService);

  readonly id = input.required<string>();
  readonly coinFieldsConfig = CoinFieldsConfig;

  readonly defaultCoin: Coin = {
    id: -1, // Or generate a UUID if your service doesn't
    name: '',
    symbol: '',
    price: 0,
    updatedAt: new Date()
    // ... add other required fields from your Coin model
  };

  coinResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
          const idNum = parseInt(params.id, 10);
          if (idNum > -1) {
            return this.coinsService.getCoinById(params.id);
          }
          return of(this.defaultCoin);
        },
        defaultValue: this.defaultCoin
  });

  onSubmit(coin: Coin): void {
    if (this.id() === '-1') {
      this.coinsService.createCoin(coin).subscribe({
          next: () => {
            this.notification.show('Coin created', 'success');
          },
          error: (err) => {
            this.notification.show('Failed to create coin: ' + (err.message || 'Unknown error'), 'error');
          }
        });
    } else {
      const idNum = parseInt(this.id(), 10);
      const model = { ...coin, id: idNum };

      this.coinsService.editCoin(model).subscribe({
          next: () => {
            this.notification.show('Coin updated', 'success');
          },
          error: (err) => {
            this.notification.show('Failed to update coin: ' + (err.message || 'Unknown error'), 'error');
          }
        });
    }
    this.showModal.set(false);
    this.closed.emit();
  }

  onCancel(): void {
    this.showModal.set(false);
    this.closed.emit();
  }
}
