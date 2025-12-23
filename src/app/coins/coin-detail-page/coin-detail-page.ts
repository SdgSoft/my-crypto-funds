import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig } from '../../form-fields';
import { CoinsService } from '../../services/coins-service';

@Component({
    selector: 'app-coin-detail-page',
    templateUrl: './coin-detail-page.html',
    styleUrl: './coin-detail-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinDetailPage {
  private coinsService = inject(CoinsService);

  readonly id = input.required<string>();

  readonly coinFieldsConfig = CoinFieldsConfig;

  coinResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.coinsService.getCoinById(params.id)
  });
}