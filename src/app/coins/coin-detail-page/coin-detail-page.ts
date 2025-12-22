import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CoinFieldsConfig, FormField } from '../../form-fields';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';
import { DataForm } from '../../data-form/data-form';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-coin-detail-page',
    templateUrl: './coin-detail-page.html',
    styleUrl: './coin-detail-page.css',
    imports: [DataForm, AsyncPipe],
})
export class CoinDetailPage implements OnInit {
  coin$! : Observable<Coin>;
  coinFieldsConfig : FormField<Coin>[] = CoinFieldsConfig;

  constructor(
    private route: ActivatedRoute,
    private coinsService: CoinsService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || "";
    this.coin$ = this.coinsService.getCoinById(id);
  }
}