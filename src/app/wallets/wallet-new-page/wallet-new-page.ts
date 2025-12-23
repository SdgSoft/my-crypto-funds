import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { FormField, SubmitRequest, WalletFieldsConfig } from '../../form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';

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

  onSubmit(request: SubmitRequest<Wallet>): void {
    this.walletsService.createWallet(request.model).subscribe({
      next: (data) => {
        console.log('Wallet created:', data);
        this.router.navigate(['/wallets'])
      },
      error: (err) => {
        console.error('Failed to create new wallet:', err);
        request.callback( { error: true, message: "Failed to create new wallet" })
      }
    });
  }
}
