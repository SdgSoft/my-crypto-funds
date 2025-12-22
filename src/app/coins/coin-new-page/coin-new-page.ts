import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
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
  private router = inject(Router);
  private coinsService = inject(CoinsService);

  coinFieldsConfig : FormField<Coin>[] = CoinFieldsConfig;

  onSubmit(request: SubmitRequest<Coin>): void {
    this.coinsService.createCoin(request.model).subscribe({
        next: (data) => {
          console.log('Coin created:', data);
          this.router.navigate(['/coins'])
        },
        error: (err) => {
          console.error('Failed to create coin:', err);
          request.callback( { error: true, message: "Failed to create coin" })
        }
      });
  }
}
