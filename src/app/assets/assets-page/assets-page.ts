import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Asset } from '../../models';
import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';

interface AssetWithComputed extends Asset {
  averagePrice: number;
  percPrice: number;
  currentPrice: number;
  currentValue: number;
  gains: number;
  percGains: number;
}

@Component({
    selector: 'app-assets-page',
    templateUrl: './assets-page.html',
    styleUrl: './assets-page.css',
    imports: [RouterLink, DatePipe, CurrencyPipe, DecimalPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPage {
  private assetsService = inject(AssetsService);
  private coinsService = inject(CoinsService);

  // rxResource handles the fetch, loading state, and error state automatically
  assetsResource = rxResource({
    stream: () => this.assetsService.getAssets(),
    defaultValue: []
  });

  coinsResource = rxResource({
    stream: () => this.coinsService.getCoins(),
    defaultValue: []
  });

  assetsWithComputed = computed<AssetWithComputed[]>(() => {
    const assets = this.assetsResource.value() || [];
    const coins = this.coinsResource.value() || [];
    const totalDeposit = assets.reduce((sum, asset) => sum + asset.deposit, 0);

    return assets.map(asset => {
      const coin = coins.find(c => c.id === asset.coinid);
      const currentPrice = coin?.price || 0;
      const totalAmount = asset.available + asset.staked;
      const currentValue = currentPrice * totalAmount;
      const gains = currentValue - asset.deposit;
      const averagePrice = totalAmount === 0 ? 0 : asset.deposit / totalAmount;
      const percPrice = totalDeposit === 0 ? 0 : (asset.deposit / totalDeposit) * 100;
      const percGains = asset.deposit === 0 ? 1 : (gains / asset.deposit) * 100;

      return {
        ...asset,
        averagePrice,
        percPrice,
        currentPrice,
        currentValue,
        gains,
        percGains
      };
    });
  });

    sumDeposit = computed(() => {
      return this.assetsWithComputed().reduce((sum, asset) => sum + asset.deposit, 0);
    });

    sumCurrentValue = computed(() => {
      return this.assetsWithComputed().reduce((sum, asset) => sum + asset.currentValue, 0);
    });

    sumGains = computed(() => {
      return this.assetsWithComputed().reduce((sum, asset) => sum + asset.gains, 0);
    });

    percTotalGains = computed(() => {
      const deposit = this.sumDeposit();
      if (deposit === 0) return 0;
      return (this.sumGains() / deposit) * 100;
    });

  onDeleteClicked(id: string): void {
    this.assetsService.deleteAsset(id).subscribe({
      next: () => {
        // Simple built-in method to re-fetch the data
        this.assetsResource.reload();
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }

  onUpdatePricesClicked(): void {
    this.coinsService.updateCoinPrices().subscribe({
      next: () => {
        // Reload the coins to show updated prices
        this.assetsResource.reload();
      },
      error: (err) => console.error('Update prices failed:', err)
    });
  }
}
