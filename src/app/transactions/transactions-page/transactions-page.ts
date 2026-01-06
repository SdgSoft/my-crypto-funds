import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowPath, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../services/notification-service';
import { TransactionsService } from '../../services/transactions-service';
import { TransactionPage } from '../transaction-page/transaction-page';

@Component({
    selector: 'app-transactions-page',
    templateUrl: './transactions-page.html',
    styleUrl: './transactions-page.css',
    imports: [RouterLink, DatePipe, CurrencyPipe, DecimalPipe, NgIcon, ConfirmDialogComponent, TransactionPage],
    providers: [provideIcons({ heroArrowLeft, heroArrowPath, heroDocumentPlus , heroPencilSquare, heroTrash })],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsPage {
  private transactionsService = inject(TransactionsService);
  private notification = inject(NotificationService);

  readonly assetid = input.required<string>();

  // rxResource handles the fetch, loading state, and error state automatically
  transactionsResource = rxResource({
    params: () => ({ id: this.assetid() }),
    stream: ({ params }) => this.transactionsService.getAssetTransactionsByAssetid(params.id),
    defaultValue: []
  });

  readonly sumDeposit = computed(() => {
    return this.transactionsResource.value().reduce((sum, asset) => sum + asset.deposit, 0);
  });

  readonly sumAvailable = computed(() => {
    return this.transactionsResource.value().reduce((sum, asset) => sum + asset.available, 0);
  });

  readonly sumStaked = computed(() => {
    return this.transactionsResource.value().reduce((sum, asset) => sum + asset.staked, 0);
  });

  readonly averagePrice = computed(() => {
    const totalAmount = this.sumAvailable() + this.sumStaked();
    return totalAmount === 0 ? 0 : this.sumDeposit() / totalAmount;
  });

  readonly sumCurrentValue = computed(() => {
    return this.transactionsResource.value().reduce((sum, asset) => sum + (asset.currentValue ?? 0), 0);
  });

  readonly sumGains = computed(() => {
    return this.transactionsResource.value().reduce((sum, asset) => sum + (asset.gains ?? 0), 0);
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
    this.transactionsService.deleteTransaction(id).subscribe({
      next: () => {
        this.transactionsResource.reload();
        this.notification.show('Asset deleted', 'success');
      },
      error: (err) => {
        this.notification.show('Delete failed: ' + (err.message || 'Unknown error'), 'error');
      }
    });
    this.confirmDeleteId.set(null);
  }

  // Modal state for create/edit
  readonly showFormDialog = signal(false);
  editingTransactionId = '-1';

  openNewFormDialog() {
    this.editingTransactionId = '-1';
    this.showFormDialog.set(true);
  }

  openEditFormDialog(id: string) {
    this.editingTransactionId = id;
    this.showFormDialog.set(true);
  }

  onFormDialogClose() {
    this.transactionsResource.reload();
    this.showFormDialog.set(false);
  }

}
