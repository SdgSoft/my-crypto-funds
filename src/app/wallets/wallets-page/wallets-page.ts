import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { WalletsService } from '../../services/wallets-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { NotificationService } from '../../services/notification-service';
import { WalletPage } from '../wallet-page/wallet-page';

@Component({
  selector: 'app-wallets-page',
  templateUrl: './wallets-page.html',
  styleUrl: './wallets-page.css',
  imports: [NgIcon, ConfirmDialogComponent, WalletPage],
  providers: [provideIcons({ heroDocumentPlus, heroPencilSquare, heroTrash })],
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

  // Modal state for create/edit
  readonly showFormDialog = signal(false);
  editingWalletId = '-1';

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
