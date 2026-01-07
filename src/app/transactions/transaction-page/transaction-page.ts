import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { of } from 'rxjs';
import { DataModalForm } from '../../common/data-modal-form/data-modal-form';
import { TransactionFieldsConfig } from '../../common/form-fields';
import { Transaction } from '../../models/transaction-model';
import { NotificationService } from '../../services/notification-service';
import { TransactionsService } from '../../services/transactions-service';

@Component({
    selector: 'app-transaction-page',
    templateUrl: './transaction-page.html',
    styleUrl: './transaction-page.css',
    imports: [DataModalForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionPage {
  private readonly transactionsService = inject(TransactionsService);
  private readonly notification = inject(NotificationService);

  readonly closed = output<void>();
  readonly showModal = signal(true);

  readonly id = input.required<string>();
  readonly assetid = input.required<string>();

  readonly transactionFieldsConfig = TransactionFieldsConfig;

  readonly defaultTransaction: Transaction = {
      id: -1,
      assetid: -1,
      deposit: 0,
      available: 0,
      staked: 0,
      updatedAt: new Date()
  }

  transactionResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
          const idNum = parseInt(params.id, 10);
          if (idNum > -1) {
            return this.transactionsService.getTransactionById(params.id);
          }
          return of(this.defaultTransaction);
        },
        defaultValue: this.defaultTransaction
  });

  onSubmit(transaction: Transaction): void {
    if (this.id() === '-1') {
      // Create new asset
      const model = { ...transaction };
      if (this.assetid) model.assetid = parseInt(String(this.assetid()), 10);
      model.deposit = model.deposit !== undefined ? parseFloat(String(model.deposit)) : 0;
      model.available = model.available !== undefined ? parseFloat(String(model.available)) : 0;
      model.staked = model.staked !== undefined ? parseFloat(String(model.staked)) : 0;

      this.transactionsService.createTransaction(model).subscribe({
        next: () => {
          this.notification.show('Transaction created', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to create transaction: ' + (err.message || 'Unknown error'), 'error');
        }
      });
    } else {
      // Edit existing asset
      const idNum = parseInt(this.id(), 10);
      const model = { ...transaction, id: idNum };
      console.log(model);
      if (this.assetid) model.assetid = parseInt(String(this.assetid()), 10);
      model.deposit = model.deposit !== undefined ? parseFloat(String(model.deposit)) : 0;
      model.available = model.available !== undefined ? parseFloat(String(model.available)) : 0;
      model.staked = model.staked !== undefined ? parseFloat(String(model.staked)) : 0;

      this.transactionsService.editTransaction(model).subscribe({
        next: () => {
          this.notification.show('Transaction updated', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to update transaction: ' + (err.message || 'Unknown error'), 'error');
        }
      });
    }
    this.showModal.set(false);
    this.closed.emit();
  }

  onCancel(): void {
    this.showModal.set(false);
    this.closed.emit();
  }
}
