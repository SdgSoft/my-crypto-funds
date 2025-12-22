import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';

@Component({
    selector: 'app-coin-edit-page',
    templateUrl: './coin-edit-page.html',
    styleUrl: './coin-edit-page.css',
    imports: [DataForm, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinEditPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private coinsService = inject(CoinsService);

  coin$! : Observable<Coin>;
  coinFieldsConfig : FormField<Coin>[] = CoinFieldsConfig;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || "";;
    this.coin$ = this.coinsService.getCoinById(id)
  }

  onSubmit(request: SubmitRequest<Coin>): void {
    this.coinsService.editCoin(request.model).subscribe({
        next: (data) => {
          console.log('Coin updated:', data);
          this.router.navigate(['/coins'])
        },
        error: (err) => {
          console.error('Failed to update coin:', err);
          request.callback( { error: true, message: "Failed to update coin" })
        }
      });
  }

}
