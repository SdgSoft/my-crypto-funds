import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DataForm } from '../../data-form/data-form';
import { AssetFieldsConfig, FormField } from '../../form-fields';
import { Asset } from '../../models';
import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';
import { WalletsService } from '../../services/wallets-service';

@Component({
    selector: 'app-asset-detail-page',
    templateUrl: './asset-detail-page.html',
    styleUrl: './asset-detail-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetDetailPage {
  private readonly assetsService = inject(AssetsService);
  private readonly coinsService = inject(CoinsService);
  private readonly walletsService = inject(WalletsService);

  readonly id = input.required<string>();

  assetResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.assetsService.getAssetById(params.id)
  });

  coinsResource = rxResource({
    stream: () => this.coinsService.getCoins(),
    defaultValue: []
  });

  walletsResource = rxResource({
    stream: () => this.walletsService.getWallets(),
    defaultValue: []
  });

  readonly assetFieldsConfig = computed<FormField<Asset>[]>(() => {
    const coins = this.coinsResource.value() || [];
    const wallets = this.walletsResource.value() || [];

    const coinOptions = coins.map(c => ({
      label: c.name,
      value: c.id
    }));

    const walletOptions = wallets.map(w => ({
      label: w.name,
      value: w.id
    }));

    return AssetFieldsConfig.map(field => {
      if (field.key === 'coinid') {
        return { ...field, options: coinOptions };
      } else if (field.key === 'walletid') {
        return { ...field, options: walletOptions };
      }
      return field;
    });
  });
}