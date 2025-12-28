import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPath, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { NotificationService } from '../../services/notification-service';

@Component({
    selector: 'app-assets-page',
    templateUrl: './assets-page.html',
    styleUrl: './assets-page.css',
    imports: [RouterLink, DatePipe, CurrencyPipe, DecimalPipe, NgIcon, ConfirmDialogComponent],
    providers: [provideIcons({ heroArrowPath, heroDocumentPlus , heroPencilSquare, heroTrash })],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPage {
  private assetsService = inject(AssetsService);
  private coinsService = inject(CoinsService);
  private notification = inject(NotificationService);

  // rxResource handles the fetch, loading state, and error state automatically
  assetsResource = rxResource({
    stream: () => this.assetsService.getAssets(),
    defaultValue: []
  });

  coinsResource = rxResource({
    stream: () => this.coinsService.getCoins(),
    defaultValue: []
  });

  readonly sumDeposit = computed(() => {
    return this.assetsResource.value().reduce((sum, asset) => sum + (asset.deposit || 0), 0);
  });

  readonly sumCurrentValue = computed(() => {
    return this.assetsResource.value().reduce((sum, asset) => sum + (asset.currentValue ?? 0), 0);
  });

  readonly sumGains = computed(() => {
    return this.assetsResource.value().reduce((sum, asset) => sum + (asset.gains ?? 0), 0);
  });

  readonly percTotalGains = computed(() => {
    const deposit = this.sumDeposit();
    if (deposit === 0) return 0;
    return (this.sumGains() / deposit) * 100;
  });

  readonly confirmDeleteId = signal<string | null>(null);

  onDeleteClicked(id: string): void {
    this.confirmDeleteId.set(id);
  }

  onDialogCancel(): void {
    this.confirmDeleteId.set(null);
  }

  onDialogConfirm(): void {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.assetsService.deleteAsset(id).subscribe({
      next: () => {
        this.assetsResource.reload();
        this.notification.show('Asset deleted', 'success');
      },
      error: (err) => {
        this.notification.show('Delete failed: ' + (err.message || 'Unknown error'), 'error');
      }
    });
    this.confirmDeleteId.set(null);
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
