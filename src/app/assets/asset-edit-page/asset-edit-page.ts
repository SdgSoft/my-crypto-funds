import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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
    selector: 'app-asset-edit-page',
    templateUrl: './asset-edit-page.html',
    styleUrl: './asset-edit-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetEditPage {
  private readonly router = inject(Router);
  private readonly assetsService = inject(AssetsService);
  private readonly coinsService = inject(CoinsService);
  private readonly walletsService = inject(WalletsService);
  private readonly notification = inject(NotificationService);

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
      label: c.symbol,
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

  onSubmit(asset: Asset): void {
    const id = parseInt(this.id());
    const model = { ...asset };
    if (model.coinid) {
      model.coinid = parseInt(model.coinid as any, 10);
    }
    if (model.walletid) {
      model.walletid = parseInt(model.walletid as any, 10);
    }
    if (model.deposit !== undefined) {
      model.deposit = parseFloat(model.deposit as any);
    }
    if (model.available !== undefined) {
      model.available = parseFloat(model.available as any);
    }
    if (model.staked !== undefined) {
      model.staked = parseFloat(model.staked as any);
    }
    this.assetsService.editAsset({ ...model, id: id }).subscribe({
        next: (data) => {
          this.notification.show('Asset updated', 'success');
          this.router.navigate(['/assets'])
        },
        error: (err) => {
          this.notification.show('Failed to update asset: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}