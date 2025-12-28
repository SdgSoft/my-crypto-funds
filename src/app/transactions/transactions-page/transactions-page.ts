import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroArrowPath, heroDocumentPlus, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { Transaction } from '../../models/transaction-model';
import { CoinsService } from '../../services';
import { AssetsService } from '../../services/assets-service';
import { NotificationService } from '../../services/notification-service';
import { TransactionsService } from '../../services/transactions-service';


interface TransactionWithComputed extends Transaction {
  averagePrice: number;
  percPrice: number;
  currentPrice: number;
  currentValue: number;
  gains: number;
  percGains: number;
}

@Component({
    selector: 'app-transactions-page',
    templateUrl: './transactions-page.html',
    styleUrl: './transactions-page.css',
    imports: [RouterLink, DatePipe, CurrencyPipe, DecimalPipe, NgIcon, ConfirmDialogComponent],
    providers: [provideIcons({ heroArrowLeft, heroArrowPath, heroDocumentPlus , heroPencilSquare, heroTrash })],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsPage {
  private transactionsService = inject(TransactionsService);
  private assetsService = inject(AssetsService);
  private coinsService = inject(CoinsService);
  private notification = inject(NotificationService);

  readonly assetid = input.required<string>();

  // rxResource handles the fetch, loading state, and error state automatically
  transactionsResource = rxResource({
    params: () => ({ id: this.assetid() }),
    stream: ({ params }) => this.transactionsService.getAssetTransactionsByAssetid(params.id),
    defaultValue: []
  });

  assetResource = rxResource({
    params: () => ({ id: this.transactionsResource.value()[0]?.assetid || '-1'  }),
    stream: ({ params }) => this.assetsService.getAssetById(params.id.toString()),
  });

  coinResource = rxResource({
    params: () => ({ id: this.assetResource.value()?.coinid || '-1'  }),
    stream: ({ params }) => this.coinsService.getCoinById(params.id.toString()),
  });

  transactionsWithComputed = computed<TransactionWithComputed[]>(() => {
    const assetTransactions = this.transactionsResource.value() || [];
    const coin = this.coinResource.value();
    const totalDeposit = assetTransactions.reduce((sum, asset) => sum + (asset.deposit || 0), 0);

    return assetTransactions.map(assetTransaction => {
      const currentPrice = coin?.price || 0;
      const totalAmount = assetTransaction.available + assetTransaction.staked;
      const currentValue = currentPrice * totalAmount;
      const gains = currentValue - (assetTransaction.deposit || 0);
      const averagePrice = totalAmount === 0 ? 0 : assetTransaction.deposit / totalAmount;
      const percPrice = totalDeposit === 0 ? 0 : ((assetTransaction.deposit || 0) / totalDeposit) * 100;
      const percGains = (assetTransaction.deposit || 0) === 0 ? 1 : (gains / (assetTransaction.deposit || 0)) * 100;

      return {
        ...assetTransaction,
        averagePrice,
        percPrice,
        currentPrice,
        currentValue,
        gains,
        percGains
      };
    });
  });

  sumDeposit = computed(() => {
    return this.transactionsWithComputed().reduce((sum, asset) => sum + asset.deposit, 0);
  });

  sumAvailable = computed(() => {
    return this.transactionsWithComputed().reduce((sum, asset) => sum + asset.available, 0);
  });

  sumStaked = computed(() => {
    return this.transactionsWithComputed().reduce((sum, asset) => sum + asset.staked, 0);
  });

  averagePrice = computed(() => {
    const totalAmount = this.sumAvailable() + this.sumStaked();
    return totalAmount === 0 ? 0 : this.sumDeposit() / totalAmount;
  });

  sumCurrentValue = computed(() => {
    return this.transactionsWithComputed().reduce((sum, asset) => sum + asset.currentValue, 0);
  });

  sumGains = computed(() => {
    return this.transactionsWithComputed().reduce((sum, asset) => sum + asset.gains, 0);
  });

  percTotalGains = computed(() => {
    const deposit = this.sumDeposit();
    if (deposit === 0) return 0;
    return (this.sumGains() / deposit) * 100;
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
}
