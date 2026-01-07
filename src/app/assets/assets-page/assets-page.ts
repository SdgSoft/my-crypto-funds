import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowDown, heroArrowPath, heroArrowsRightLeft, heroArrowUp, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { Asset } from '../../models';
import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';
import { NotificationService } from '../../services/notification-service';
import { SortAccessor, Sorting } from '../../utils/sort-util';
import { AssetPage } from '../asset-page/asset-page';

@Component({
    selector: 'app-assets-page',
    templateUrl: './assets-page.html',
    styleUrl: './assets-page.css',
    imports: [RouterLink, DatePipe, CurrencyPipe, DecimalPipe, NgIcon, ConfirmDialogComponent, AssetPage],
    providers: [provideIcons({ heroArrowPath, heroDocumentPlus , heroPencilSquare, heroTrash, heroArrowsRightLeft, heroArrowUp, heroArrowDown })],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPage {
  private assetsService = inject(AssetsService);
  private coinsService = inject(CoinsService);
  private notification = inject(NotificationService);

  // Sorting state using Sorting class
  sorting = new Sorting<Asset>('assetinfo', 'asc');

  setSort(column: keyof Asset) {
    this.sorting.setSort(column);
  }

  readonly sortedAssets = computed(() => {
    const col: keyof Asset = this.sorting.sortColumn();
    const accessor: SortAccessor<Asset> = (asset: Asset) => asset[col];
    return this.sorting.sortArray(this.assetsResource.value(), accessor);
  });

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
        this.assetsResource.reload();
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
    this.assetsResource.reload();
    this.showFormDialog.set(false);
  }
}
