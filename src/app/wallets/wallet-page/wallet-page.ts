import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormField } from '../../common/form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';

import { of } from 'rxjs';
import { DataModalForm } from '../../common/data-modal-form/data-modal-form';
import { NotificationService } from '../../services/notification-service';
import { WalletFieldsConfig } from './wallet-fields';

@Component({
    selector: 'app-wallet-page',
    templateUrl: './wallet-page.html',
    styleUrl: './wallet-page.css',
    imports: [DataModalForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPage {
  private walletsService = inject(WalletsService);
  private chainsService = inject(ChainsService);
  private notification = inject(NotificationService);

  readonly showModal = signal(true);
  readonly id = input.required<string>();
  readonly closed = output<void>();

  readonly defaultWallet: Wallet = {
    id: -1,
    name: '',
    adress: '',
  };

  walletResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
          const idNum = parseInt(params.id, 10);
          if (idNum > -1) {
            return this.walletsService.getWalletById(params.id);
          }
          return of(this.defaultWallet);
        },
        defaultValue: this.defaultWallet
  });

  chainsResource = rxResource({
    stream: () => this.chainsService.getChains(),
    defaultValue: [] // Initial empty state avoids undefined issues
  });

  readonly walletFieldsConfig = computed<FormField<Wallet>[]>(() => {
    const chains = this.chainsResource.value() || [];

    // Map chains to the required option format
    const chainOptions = chains.map(c => ({
      label: c.name,
      value: c.id
    }));

    // Return the config with the 'chainid' options dynamically injected
    return WalletFieldsConfig.map(field =>
      field.key === 'chainid'
        ? { ...field, options: chainOptions }
        : field
    );
  });

  onSubmit(wallet: Wallet): void {
    if (this.id() === '-1') {
      // Create new asset
      const model = { ...wallet };
      if (model.chainid) model.chainid = parseInt(String(model.chainid), 10);
        this.walletsService.createWallet(model).subscribe({
        next: () => {
          this.notification.show('Wallet created', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to create wallet: ' + (err.message || 'Unknown error'), 'error');
        }
      });
    } else {
      // Edit existing asset
      const idNum = parseInt(this.id(), 10);
      const model = { ...wallet, id: idNum };
      if (model.chainid) model.chainid = parseInt(String(model.chainid), 10);
      this.walletsService.editWallet(model).subscribe({
        next: () => {
          this.notification.show('Wallet updated', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to update wallet: ' + (err.message || 'Unknown error'), 'error');
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
