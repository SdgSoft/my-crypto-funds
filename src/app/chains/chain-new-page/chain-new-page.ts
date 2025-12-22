import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { ChainFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';


@Component({
    selector: 'app-chain-new-page',
    templateUrl: './chain-new-page.html',
    styleUrl: './chain-new-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainNewPage {
  chainFieldsConfig : FormField<Chain>[] = ChainFieldsConfig;

  constructor(
    private router: Router,
    private chainsService: ChainsService
  ) {}

  onSubmit(request: SubmitRequest<Chain>): void {
    this.chainsService.createChain(request.model).subscribe({
        next: (data) => {
          console.log('Chain created:', data);
          this.router.navigate(['/chains'])
        },
        error: (err) => {
          console.error('Failed to create chain:', err);
          request.callback( { error: true, message: "Failed to create chain" })
        }
      });
  }
}
