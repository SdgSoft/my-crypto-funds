import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataForm } from '../../data-form/data-form';
import { ChainFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

@Component({
    selector: 'app-chain-edit-page',
    templateUrl: './chain-edit-page.html',
    styleUrl: './chain-edit-page.css',
    imports: [DataForm, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainEditPage implements OnInit {
  chain$! : Observable<Chain>;
  chainFieldsConfig : FormField<Chain>[] = ChainFieldsConfig;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chainsService: ChainsService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') || "";;
    this.chain$ = this.chainsService.getChainById(id);
  }

  onSubmit(request: SubmitRequest<Chain>): void {
    this.chainsService.editChain(request.model).subscribe({
        next: (data) => {
          console.log('Chain updated:', data);
          this.router.navigate(['/chains'])
        },
        error: (err) => {
          console.error('Failed to update chain:', err);
          request.callback( { error: true, message: "Failed to update chain" })
        }
      });
  }
}
