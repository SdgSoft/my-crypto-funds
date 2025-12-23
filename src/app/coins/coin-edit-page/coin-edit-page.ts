import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig, SubmitRequest } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';

@Component({
    selector: 'app-coin-edit-page',
    templateUrl: './coin-edit-page.html',
    styleUrl: './coin-edit-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinEditPage {
  private readonly router = inject(Router);
  private readonly coinsService = inject(CoinsService);

  readonly id = input.required<string>();
  readonly coinFieldsConfig = CoinFieldsConfig;

  coinResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.coinsService.getCoinById(params.id)
  });

  onSubmit(request: SubmitRequest<Coin>): void {
    this.coinsService.editCoin(request.model).subscribe({
        next: () => {
          this.router.navigate(['/coins'])
        },
        error: (err) => {
          console.log("Failed to create coin", err);
          request.callback( { error: true, message: "Failed to update coin" })
        }
      });
  }
}
