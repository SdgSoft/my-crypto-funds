import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { ChainFieldsConfig } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

import { NotificationService } from '../../services/notification-service';

@Component({
    selector: 'app-chain-edit-page',
    templateUrl: './chain-edit-page.html',
    styleUrl: './chain-edit-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainEditPage {
  private router = inject(Router);
  private chainsService = inject(ChainsService);
  private notification = inject(NotificationService);

  readonly id = input.required<string>();
  chainFieldsConfig = ChainFieldsConfig;

  chainResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.chainsService.getChainById(params.id)
  });

  onSubmit(chain: Chain): void {
    const id = parseInt(this.id());
    this.chainsService.editChain({ ...chain, id: id }).subscribe({
        next: (data) => {
          this.notification.show('Chain updated', 'success');
          this.router.navigate(['/chains'])
        },
        error: (err) => {
          this.notification.show('Failed to update chain: ' + (err.message || 'Unknown error'), 'error');
        }
      });
  }
}
