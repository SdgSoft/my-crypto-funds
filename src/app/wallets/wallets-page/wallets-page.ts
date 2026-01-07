import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { WalletsService } from '../../services/wallets-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowDown, heroArrowUp, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { Wallet } from '../../models';
import { NotificationService } from '../../services/notification-service';
import { SortAccessor, Sorting } from '../../utils/sort-util';
import { WalletPage } from '../wallet-page/wallet-page';

@Component({
  selector: 'app-wallets-page',
  templateUrl: './wallets-page.html',
  styleUrl: './wallets-page.css',
  imports: [NgIcon, ConfirmDialogComponent, WalletPage],
  providers: [provideIcons({ heroDocumentPlus, heroPencilSquare, heroTrash, heroArrowUp, heroArrowDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WalletsPage {
  private walletsService = inject(WalletsService);
  private notification = inject(NotificationService);

  // rxResource handles the fetch, loading state, and error state automatically
  walletsResource = rxResource({
    stream: () => this.walletsService.getWallets(),
    defaultValue: []
  });

  readonly confirmDeleteId = signal<string | null>(null);
  readonly showFormDialog = signal(false);
  editingWalletId = '-1';

  // Sorting state using Sorting class
  sorting = new Sorting<Wallet>('name', 'asc');

  setSort(column: keyof Wallet) {
    this.sorting.setSort(column);
  }

  readonly sortedWallets = computed(() => {
    const col: keyof Wallet = this.sorting.sortColumn();
    const accessor: SortAccessor<Wallet> = (wallet: Wallet) => wallet[col];
    return this.sorting.sortArray(this.walletsResource.value(), accessor);
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
    this.walletsService.deleteWallet(id).subscribe({
      next: () => {
        this.walletsResource.reload();
        this.notification.show('Wallet deleted', 'success');
      },
      error: (err) => {
        this.notification.show('Delete failed: ' + (err.message || 'Unknown error'), 'error');
      }
    });
    this.confirmDeleteId.set(null);
  }

  openNewFormDialog() {
    this.editingWalletId = '-1';
    this.showFormDialog.set(true);
  }

  openEditFormDialog(id: string) {
    this.editingWalletId = id;
    this.showFormDialog.set(true);
  }

  onFormDialogClose() {
    this.walletsResource.reload();
    this.showFormDialog.set(false);
  }
}
