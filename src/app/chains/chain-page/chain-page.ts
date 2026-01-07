import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

import { of } from 'rxjs';
import { DataModalForm } from '../../common/data-modal-form/data-modal-form';
import { NotificationService } from '../../services/notification-service';
import { ChainFieldsConfig } from './chain-fields';

@Component({
    selector: 'app-chain-page',
    templateUrl: './chain-page.html',
    styleUrl: './chain-page.css',
    imports: [DataModalForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainPage {
  private router = inject(Router);
  private chainsService = inject(ChainsService);
  private notification = inject(NotificationService);

  readonly closed = output<void>();
  readonly showModal = signal(true);

  readonly id = input.required<string>();
  chainFieldsConfig = ChainFieldsConfig;

  readonly defaultChain : Chain = {
    id: -1,
    name: ""
  }

  chainResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => {
      const idNum = parseInt(params.id, 10);
      if (idNum > -1) {
        return this.chainsService.getChainById(params.id);
      }
      return of(this.defaultChain);
    },
    defaultValue: this.defaultChain
  });


  onSubmit(chain: Chain): void {
    if (this.id() === '-1') {
      // Create new asset
      const model = { ...chain };
      this.chainsService.createChain(model).subscribe({
        next: () => {
          this.notification.show('Chain created', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to create chain: ' + (err.message || 'Unknown error'), 'error');
        }
      });
    } else {
      // Edit existing asset
      const idNum = parseInt(this.id(), 10);
      const model = { ...chain, id: idNum };
      this.chainsService.editChain(model).subscribe({
        next: () => {
          this.notification.show('Chain updated', 'success');
        },
        error: (err) => {
          this.notification.show('Failed to update chain: ' + (err.message || 'Unknown error'), 'error');
        }
      });
    }
    this.showModal.set(false);
    this.closed.emit();
  }

  onCancel(): void {
    this.showModal.set(false);
    this.closed.emit();
  }
}
