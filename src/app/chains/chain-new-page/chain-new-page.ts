import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { ChainFieldsConfig } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

import { NotificationService } from '../../services/notification-service';


@Component({
    selector: 'app-chain-new-page',
    templateUrl: './chain-new-page.html',
    styleUrl: './chain-new-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainNewPage {
  private readonly router = inject(Router);
  private readonly chainsService = inject(ChainsService);
  private readonly notification = inject(NotificationService);

  readonly chainFieldsConfig = ChainFieldsConfig;

  readonly defaultChain : Chain = {
    id: -1,
    name: ""
  }

  onSubmit(chain: Chain): void {
    this.chainsService.createChain(chain).subscribe({
        next: (data) => {
          this.notification.show('Chain created', 'success');
          this.router.navigate(['/chains'])
        },
        error: (err) => {
          this.notification.show('Failed to create chain: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}
