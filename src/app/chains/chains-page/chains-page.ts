import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';
import { ChainsService } from '../../services/chains-service';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowDown, heroArrowUp, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { Chain } from '../../models';
import { NotificationService } from '../../services/notification-service';
import { SortAccessor, Sorting } from '../../utils/sort-util';
import { ChainPage } from '../chain-page/chain-page';

@Component({
  selector: 'app-chains-page',
  templateUrl: './chains-page.html',
  styleUrl: './chains-page.css',
  imports: [NgIcon, ConfirmDialogComponent, ChainPage],
  providers: [provideIcons({ heroDocumentPlus, heroPencilSquare, heroTrash, heroArrowUp, heroArrowDown })],
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

  // Sorting state using Sorting class
  sorting = new Sorting<Chain>('name', 'asc');

  setSort(column: keyof Chain) {
    this.sorting.setSort(column);
  }

  readonly sortedChains = computed(() => {
    const col: keyof Chain = this.sorting.sortColumn();
    const accessor: SortAccessor<Chain> = (chain: Chain) => chain[col];
    return this.sorting.sortArray(this.chainsResource.value(), accessor);
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
