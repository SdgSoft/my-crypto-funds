import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoinFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';



@Component({
  selector: 'app-coin-new-page',
  standalone: false,
  templateUrl: './coin-new-page.html',
  styleUrl: './coin-new-page.css',
})
export class CoinNewPage {
  coinFieldsConfig : FormField<Coin>[] = CoinFieldsConfig;

  constructor(
    private router: Router,
    private coinsService: CoinsService
  ) {}

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
