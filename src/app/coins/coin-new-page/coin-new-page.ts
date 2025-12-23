import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig, SubmitRequest } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';



@Component({
    selector: 'app-coin-new-page',
    templateUrl: './coin-new-page.html',
    styleUrl: './coin-new-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinNewPage {
  private readonly router = inject(Router);
  private readonly coinsService = inject(CoinsService);

  readonly coinFieldsConfig = CoinFieldsConfig;

  readonly defaultCoin: Coin = {
    id: -1, // Or generate a UUID if your service doesn't
    name: '',
    symbol: '',
    price: 0,
    updatedAt: new Date()
    // ... add other required fields from your Coin model
  };

  onSubmit(request: SubmitRequest<Coin>): void {
    this.coinsService.createCoin(request.model).subscribe({
        next: () => {
          this.router.navigate(['/coins'])
        },
        error: (err) => {
          console.log("Failed to create coin", err);
          request.callback( { error: true, message: "Failed to create coin" })
        }
      });
  }
}
