import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FormField, SubmitRequest, WalletFieldsConfig } from '../../form-fields';
import { Wallet } from '../../models';
import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';
import { DataForm } from '../../data-form/data-form';

@Component({
    selector: 'app-wallet-new-page',
    templateUrl: './wallet-new-page.html',
    styleUrl: './wallet-new-page.css',
    imports: [DataForm],
})
export class WalletNewPage  implements OnInit {
  walletFieldsConfig : FormField<Wallet>[] = WalletFieldsConfig;

  constructor(
    private router: Router,
    private walletsService: WalletsService,
    private chainsService: ChainsService
  ) {}

  ngOnInit() {
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
    this.walletsService.createWallet(request.model).subscribe({
      next: (data) => {
        console.log('Wallet created:', data);
        this.router.navigate(['/wallets'])
      },
      error: (err) => {
        console.error('Failed to create new wallet:', err);
        request.callback( { error: true, message: "Failed to create new wallet" })
      }
    });
  }
}
