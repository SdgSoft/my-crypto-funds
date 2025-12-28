import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { FormField, WalletFieldsConfig } from '../../form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';

import { NotificationService } from '../../services/notification-service';

@Component({
    selector: 'app-wallet-edit-page',
    templateUrl: './wallet-edit-page.html',
    styleUrl: './wallet-edit-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletEditPage {
  private router = inject(Router);
  private walletsService = inject(WalletsService);
  private chainsService = inject(ChainsService);
  private notification = inject(NotificationService);

  readonly id = input.required<string>();

  walletResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.walletsService.getWalletById(params.id)
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
    const id = parseInt(this.id());
    const model = { ...wallet, id: id };
    this.walletsService.editWallet(model).subscribe({
        next: () => {
          this.notification.show('Wallet updated', 'success');
          this.router.navigate(['/wallets'])
        },
        error: (err) => {
          this.notification.show('Failed to update wallet: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}
