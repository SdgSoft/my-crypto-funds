import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { DataModalForm } from '../../data-modal-form/data-modal-form';
import { AssetFieldsConfig, FormField } from '../../form-fields';
import { Asset } from '../../models';
import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';
import { NotificationService } from '../../services/notification-service';
import { WalletsService } from '../../services/wallets-service';

@Component({
    selector: 'app-asset-page',
    templateUrl: './asset-page.html',
    styleUrl: './asset-page.css',
    imports: [DataModalForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPage {
  private readonly assetsService = inject(AssetsService);
  private readonly coinsService = inject(CoinsService);
  private readonly walletsService = inject(WalletsService);
  private readonly notification = inject(NotificationService);

  readonly closed = output<void>();
  readonly showModal = signal(true);

  readonly id = input.required<string>();

  readonly defaultAsset: Asset = {
    id: -1,
    coinid: 0,
    walletid: 0,
  };

  assetResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
      const idNum = parseInt(params.id, 10);
      if (idNum > -1) {
        return this.assetsService.getAssetById(params.id);
      }
      return of(this.defaultAsset);
    },
    defaultValue: this.defaultAsset
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
    if (this.id() === '-1') {
      // Create new asset
      const model = { ...asset };
      if (model.coinid) model.coinid = parseInt(String(model.coinid), 10);
      if (model.walletid) model.walletid = parseInt(String(model.walletid), 10);
      this.assetsService.createAsset(model).subscribe({
        next: () => {
          this.notification.show('Asset created', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to create asset: ' + (err.message || 'Unknown error'), 'error');
        }
      });
    } else {
      // Edit existing asset
      const idNum = parseInt(this.id(), 10);
      const model = { ...asset, id: idNum };
      if (model.coinid) model.coinid = parseInt(String(model.coinid), 10);
      if (model.walletid) model.walletid = parseInt(String(model.walletid), 10);
      this.assetsService.editAsset(model).subscribe({
        next: () => {
          this.notification.show('Asset updated', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to update asset: ' + (err.message || 'Unknown error'), 'error');
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
