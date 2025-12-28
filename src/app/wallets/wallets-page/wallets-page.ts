import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { WalletsService } from '../../services/wallets-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-wallets-page',
  templateUrl: './wallets-page.html',
  styleUrl: './wallets-page.css',
  imports: [RouterLink, NgIcon, ConfirmDialogComponent],
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
}
