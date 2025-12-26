import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ChainsService } from '../../services/chains-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-chains-page',
  templateUrl: './chains-page.html',
  styleUrl: './chains-page.css',
  imports: [RouterLink, NgIcon, ConfirmDialogComponent],
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

  confirmDeleteId = signal<string | null>(null);

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
}
