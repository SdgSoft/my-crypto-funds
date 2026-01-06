import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ChainsService } from '../../services/chains-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { NotificationService } from '../../services/notification-service';
import { ChainPage } from '../chain-page/chain-page';

@Component({
  selector: 'app-chains-page',
  templateUrl: './chains-page.html',
  styleUrl: './chains-page.css',
  imports: [NgIcon, ConfirmDialogComponent, ChainPage],
  providers: [provideIcons({ heroDocumentPlus, heroPencilSquare, heroTrash })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainsPage {
  private chainsService = inject(ChainsService);
  private notification = inject(NotificationService);

   // rxResource automatically subscribes to the stream and exposes signals
  chainsResource = rxResource({
    stream: () => this.chainsService.getChains(),
    defaultValue: [] // Initial empty state avoids undefined issues
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
    this.chainsService.deleteChain(id).subscribe({
      next: () => {
        this.chainsResource.reload();
        this.notification.show('Chain deleted', 'success');
      },
      error: (err) => {
        this.notification.show('Delete failed: ' + (err.message || 'Unknown error'), 'error');
      }
    });
    this.confirmDeleteId.set(null);
  }

  // Modal state for create/edit
  readonly showFormDialog = signal(false);
  editingChainId = '-1';

  openNewFormDialog() {
    this.editingChainId = '-1';
    this.showFormDialog.set(true);
  }

  openEditFormDialog(id: string) {
    this.editingChainId = id;
    this.showFormDialog.set(true);
  }

  onFormDialogClose() {
    this.chainsResource.reload();
    this.showFormDialog.set(false);
  }

}
