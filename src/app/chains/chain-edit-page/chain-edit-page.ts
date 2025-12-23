import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { ChainFieldsConfig, SubmitRequest } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

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

  readonly id = input.required<string>();
  chainFieldsConfig = ChainFieldsConfig;

  chainResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.chainsService.getChainById(params.id)
  });

  onSubmit(request: SubmitRequest<Chain>): void {
    this.chainsService.editChain(request.model).subscribe({
        next: () => {
          this.router.navigate(['/chains'])
        },
        error: (err) => {
          console.error('Failed to update chain:', err);
          request.callback( { error: true, message: "Failed to update chain" })
        }
      });
  }
}
