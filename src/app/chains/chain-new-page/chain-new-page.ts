import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChainFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';


@Component({
  selector: 'app-chain-new-page',
  standalone: false,
  templateUrl: './chain-new-page.html',
  styleUrl: './chain-new-page.css',
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
