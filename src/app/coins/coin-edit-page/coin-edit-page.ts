import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CoinFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';
import { DataForm } from '../../data-form/data-form';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-coin-edit-page',
    templateUrl: './coin-edit-page.html',
    styleUrl: './coin-edit-page.css',
    imports: [DataForm, AsyncPipe],
})
export class CoinEditPage implements OnInit {
  coin$! : Observable<Coin>;
  coinFieldsConfig : FormField<Coin>[] = CoinFieldsConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private coinsService: CoinsService
  ) { }

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
