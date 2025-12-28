import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';

import { TransactionFieldsConfig } from '../../form-fields';
import { Transaction } from '../../models/transaction-model';
import { NotificationService } from '../../services/notification-service';
import { TransactionsService } from '../../services/transactions-service';

@Component({
    selector: 'app-transaction-edit-page',
    templateUrl: './transaction-edit-page.html',
    styleUrl: './transaction-edit-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionEditPage {
  private readonly router = inject(Router);
  private readonly transactionsService = inject(TransactionsService);
  private readonly notification = inject(NotificationService);

  readonly id = input.required<string>();
  readonly transactionFieldsConfig = TransactionFieldsConfig;

  transactionResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.transactionsService.getTransactionById(params.id)
  });

  onSubmit(transaction: Transaction): void {
    const id = parseInt(this.id());
    const assetid = this.transactionResource.value()?.assetid as any;
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
    console.log('Transaction:', transaction);
    this.transactionsService.editTransaction({ ...model, id: id, assetid: assetid }).subscribe({
        next: (data) => {
          this.notification.show('Transaction updated', 'success');
          this.router.navigate(['/assets/transactions', this.transactionResource.value()?.assetid])
        },
        error: (err) => {
          this.notification.show('Failed to update transaction: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}
