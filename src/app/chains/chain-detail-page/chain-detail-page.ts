import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormField, ChainFieldsConfig } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { Observable } from 'rxjs';
import { DataForm } from '../../data-form/data-form';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-chain-detail-page',
    templateUrl: './chain-detail-page.html',
    styleUrl: './chain-detail-page.css',
    imports: [DataForm, AsyncPipe],
})
export class ChainDetailPage implements OnInit {
  chain$! : Observable<Chain>;
  chainFieldsConfig : FormField<Chain>[] = ChainFieldsConfig;

  constructor(
    private route: ActivatedRoute,
    private chainsService: ChainsService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || "";
    this.chain$ = this.chainsService.getChainById(id);
  }
}