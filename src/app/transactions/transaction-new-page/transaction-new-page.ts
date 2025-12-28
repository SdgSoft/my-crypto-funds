import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { TransactionFieldsConfig } from '../../form-fields';
import { Transaction } from '../../models/transaction-model';
import { AssetsService } from '../../services/assets-service';
import { NotificationService } from '../../services/notification-service';
import { TransactionsService } from '../../services/transactions-service';



@Component({
    selector: 'app-transaction-new-page',
    templateUrl: './transaction-new-page.html',
    styleUrl: './transaction-new-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionNewPage {
  private readonly router = inject(Router);
  private readonly transactionsService = inject(TransactionsService);
  private readonly notification = inject(NotificationService);
  private readonly assetsService = inject(AssetsService);

  readonly transactionFieldsConfig = TransactionFieldsConfig;

  readonly assetid = input.required<string>();

  assetsResource = rxResource({
    params: () => ({ id: this.assetid() }),
    stream: ({ params }) => this.assetsService.getAssetById(params.id)
  });

  assetinfo = computed<string>(() => {
    const asset = this.assetsResource.value();
    return asset ? `${asset.coinsymbol} (${asset.walletname}, ${asset.chainname})` : '';
  });

  readonly defaultTransaction: Transaction = {
      id: -1,
      assetid: -1,
      deposit: 0,
      available: 0,
      staked: 0,
      updatedAt: new Date()
  }

  onSubmit(transaction: Transaction): void {
    const assetid = parseInt(this.assetid());
    const model = { ...transaction };
    if (model.deposit !== undefined) {
      model.deposit = parseFloat(model.deposit as any);
    }
    if (model.available !== undefined) {
      model.available = parseFloat(model.available as any);
    }
    if (model.staked !== undefined) {
      model.staked = parseFloat(model.staked as any);
    }

    this.transactionsService.createTransaction({ ...model, assetid: assetid }).subscribe({
        next: (data) => {
          this.notification.show('Transaction created', 'success');
          this.router.navigate(['/assets/transactions/', this.assetid()])
        },
        error: (err) => {
          this.notification.show('Failed to create transaction: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}
