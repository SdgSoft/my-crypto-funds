import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DataForm } from '../../data-form/data-form';
import { ChainFieldsConfig, FormField } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

@Component({
    selector: 'app-chain-detail-page',
    templateUrl: './chain-detail-page.html',
    styleUrl: './chain-detail-page.css',
    imports: [DataForm, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
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