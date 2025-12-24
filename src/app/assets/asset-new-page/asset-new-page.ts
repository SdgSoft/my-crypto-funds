import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { AssetFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Asset } from '../../models';
import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';
import { WalletsService } from '../../services/wallets-service';

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

  readonly defaultAsset: Asset = {
    id: -1,
    coinid: 0,
    coinname: '',
    walletid: 0,
    walletname: '',
    chainname: '',
    deposit: 0,
    available: 0,
    staked: 0,
    updatedAt: new Date(),
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

  onSubmit(request: SubmitRequest<Asset>): void {
    const model = { ...request.model };
    if (model.coinid) {
      model.coinid = parseInt(model.coinid as any);
    }
    if (model.walletid) {
      model.walletid = parseInt(model.walletid as any);
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
    this.assetsService.createAsset(model).subscribe({
      next: (data) => {
        console.log('Asset created:', data);
        this.router.navigate(['/assets'])
      },
      error: (err) => {
        console.error('Failed to create new asset:', err);
        request.callback( { error: true, message: "Failed to create new asset" })
      }
    });
  }
}
