import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { AssetFieldsConfig, FormField } from '../../form-fields';
import { Asset } from '../../models';
import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';
import { WalletsService } from '../../services/wallets-service';

import { NotificationService } from '../../services/notification-service';

@Component({
    selector: 'app-asset-new-page',
    templateUrl: './asset-new-page.html',
    styleUrl: './asset-new-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetNewPage {
  private router = inject(Router);
  private assetsService = inject(AssetsService);
  private coinsService = inject(CoinsService);
  private walletsService = inject(WalletsService);
  private notification = inject(NotificationService);

  readonly defaultAsset: Asset = {
    id: -1,
    coinid: 0,
    walletid: 0,
  };

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
      label: c.symbol,
      value: c.id
    }));

    const walletOptions = wallets.map(w => ({
      label: w.name + (w.chainname ? ' (' + w.chainname + ')' : ''),
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

  onSubmit(asset: Asset): void {
    const model = { ...asset };
    if (model.coinid) {
      model.coinid = parseInt(model.coinid as any);
    }
    if (model.walletid) {
      model.walletid = parseInt(model.walletid as any);
    }
    this.assetsService.createAsset(model).subscribe({
      next: (data) => {
        this.notification.show('Asset created', 'success');
        this.router.navigate(['/assets'])
      },
      error: (err) => {
        this.notification.show('Failed to create asset: ' + (err.message || 'Unknown error'), 'error');
      }
    });
  }
}
