import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CoinsService } from '../../services/coins-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPath, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-coins-page',
  templateUrl: './coins-page.html',
  styleUrl: './coins-page.css',
  imports: [RouterLink, CurrencyPipe, DatePipe, NgIcon],
  providers: [provideIcons({ heroArrowPath, heroDocumentPlus, heroPencilSquare, heroTrash })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinsPage {
  private coinsService = inject(CoinsService);
  private notification = inject(NotificationService);

  coinsResource = rxResource({
    stream: () => this.coinsService.getCoins(),
    defaultValue: [] // Ensures coinsResource.value() returns Coin[] instead of Coin[] | undefined
  });

  onDeleteClicked(id: string): void {
    this.coinsService.deleteCoin(id).subscribe({
      next: () => {
        this.coinsResource.reload();
        this.notification.show('Coin deleted', 'success');
      },
      error: (err) => {
        this.notification.show('Delete failed: ' + (err.message || 'Unknown error'), 'error');
      }
    });
  }

  onUpdatePricesClicked(): void {
    this.coinsService.updateCoinPrices().subscribe({
      next: () => {
        this.coinsResource.reload();
        this.notification.show('Prices updated', 'success');
      },
      error: (err) => {
        this.notification.show('Update prices failed: ' + (err.message || 'Unknown error'), 'error');
      }
    });
  }
}
