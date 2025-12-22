import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { DataForm } from '../../data-form/data-form';
import { FormField, WalletFieldsConfig } from '../../form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';

@Component({
    selector: 'app-wallet-detail-page',
    templateUrl: './wallet-detail-page.html',
    styleUrl: './wallet-detail-page.css',
    imports: [DataForm, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private walletsService = inject(WalletsService);
  private chainsService = inject(ChainsService);

  wallet$! : Observable<Wallet>;
  walletFieldsConfig : FormField<Wallet>[] = WalletFieldsConfig;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || "";
    this.wallet$ = this.walletsService.getWalletById(id);
    const chainField = this.walletFieldsConfig.find(f => f.key === 'chainid');
    if (chainField) {
      chainField.options$ = this.chainsService.getChains().pipe(
        map((c) =>
          c?.map((c) => ({
            label: c.name,
            value: c.id
          })
        )
      ));
    }
  }
}