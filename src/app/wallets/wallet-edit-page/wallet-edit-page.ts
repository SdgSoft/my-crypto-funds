import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FormField, SubmitRequest, WalletFieldsConfig } from '../../form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';
import { DataForm } from '../../data-form/data-form';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-wallet-edit-page',
    templateUrl: './wallet-edit-page.html',
    styleUrl: './wallet-edit-page.css',
    imports: [DataForm, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletEditPage implements OnInit {
  wallet$! : Observable<Wallet>;
  walletFieldsConfig : FormField<Wallet>[] = WalletFieldsConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private walletsService: WalletsService,
    private chainsService: ChainsService
  ) { }

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

  onSubmit(request: SubmitRequest<Wallet>): void {
    this.walletsService.editWallet(request.model).subscribe({
        next: (data) => {
          console.log('Wallet updated:', data);
          this.router.navigate(['/wallets'])
        },
        error: (err) => {
          console.error('Failed to update wallet:', err);
          request.callback( { error: true, message: "Failed to update wallet" })
        }
      });
  }
}
