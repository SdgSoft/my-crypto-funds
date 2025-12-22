import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DataForm } from '../../data-form/data-form';
import { CoinFieldsConfig, FormField } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';

@Component({
    selector: 'app-coin-detail-page',
    templateUrl: './coin-detail-page.html',
    styleUrl: './coin-detail-page.css',
    imports: [DataForm, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private coinsService = inject(CoinsService);

  coin$! : Observable<Coin>;
  coinFieldsConfig : FormField<Coin>[] = CoinFieldsConfig;

ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || "";
    this.coin$ = this.coinsService.getCoinById(id);
  }
}