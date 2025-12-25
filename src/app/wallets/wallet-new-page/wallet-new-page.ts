import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { FormField, WalletFieldsConfig } from '../../form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';

import { NotificationService } from '../../services/notification-service';

@Component({
    selector: 'app-wallet-new-page',
    templateUrl: './wallet-new-page.html',
    styleUrl: './wallet-new-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletNewPage {
  private router = inject(Router);
  private walletsService = inject(WalletsService);
  private chainsService = inject(ChainsService);
  private notification = inject(NotificationService);

  readonly defaultWallet: Wallet = {
    id: -1,
    name: '',
    adress: '',
  };

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
    const model = { ...wallet };
    if (model.chainid) {
      model.chainid = parseInt(model.chainid as any, 10);
    }
    this.walletsService.createWallet(model).subscribe({
      next: (data) => {
        this.notification.show('Wallet created', 'success');
        this.router.navigate(['/wallets'])
      },
      error: (err) => {
        this.notification.show('Failed to create new wallet: ' + (err.message || 'Unknown error'), 'error');
      }
    });
  }
}
