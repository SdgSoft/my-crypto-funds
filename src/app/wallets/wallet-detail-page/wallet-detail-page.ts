import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DataForm } from '../../data-form/data-form';
import { FormField, WalletFieldsConfig } from '../../form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';

@Component({
    selector: 'app-wallet-detail-page',
    templateUrl: './wallet-detail-page.html',
    styleUrl: './wallet-detail-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDetailPage {
  private walletsService = inject(WalletsService);
  private chainsService = inject(ChainsService);

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
}