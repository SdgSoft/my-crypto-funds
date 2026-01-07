import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { CoinsService } from '../../services/coins-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowDown, heroArrowPath, heroArrowUp, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { Coin } from '../../models';
import { NotificationService } from '../../services/notification-service';
import { SortAccessor, Sorting } from '../../utils/sort-util';
import { CoinPage } from '../coin-page/coin-page';

@Component({
  selector: 'app-coins-page',
  templateUrl: './coins-page.html',
  styleUrl: './coins-page.css',
  imports: [CurrencyPipe, DatePipe, NgIcon, ConfirmDialogComponent, CoinPage],
  providers: [provideIcons({ heroArrowPath, heroDocumentPlus, heroPencilSquare, heroTrash, heroArrowUp, heroArrowDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinsPage {
  private coinsService = inject(CoinsService);
  private notification = inject(NotificationService);

  coinsResource = rxResource({
    stream: () => this.coinsService.getCoins(),
    defaultValue: [] // Ensures coinsResource.value() returns Coin[] instead of Coin[] | undefined
  });

  // Dialog state
  readonly confirmDeleteId = signal<string | null>(null);

  // Sorting state using Sorting class
  sorting = new Sorting<Coin>('name', 'asc');

  setSort(column: keyof Coin) {
    this.sorting.setSort(column);
  }

  readonly sortedCoins = computed(() => {
    const col: keyof Coin = this.sorting.sortColumn();
    const accessor: SortAccessor<Coin> = (coin: Coin) => coin[col];
    return this.sorting.sortArray(this.coinsResource.value(), accessor);
  });

  onDeleteClicked(id: string): void {
    this.confirmDeleteId.set(id);
  }

  onDialogCancel(): void {
    this.confirmDeleteId.set(null);
  }

  onDialogConfirm(): void {
    const id = this.confirmDeleteId();
    if (!id) return;
    this.coinsService.deleteCoin(id).subscribe({
      next: () => {
        this.coinsResource.reload();
        this.notification.show('Coin deleted', 'success');
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

  // Modal state for create/edit
  readonly showFormDialog = signal(false);
  editingAssetId = '-1';

  openNewFormDialog() {
    this.editingAssetId = '-1';
    this.showFormDialog.set(true);
  }

  openEditFormDialog(id: string) {
    this.editingAssetId = id;
    this.showFormDialog.set(true);
  }

  onFormDialogClose() {
    this.coinsResource.reload();
    this.showFormDialog.set(false);
  }

}
