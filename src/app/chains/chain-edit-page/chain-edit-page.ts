import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChainFieldsConfig, FormField, SubmitRequest } from '../../form-fields';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

@Component({
  selector: 'app-chain-edit-page',
  standalone: false,
  templateUrl: './chain-edit-page.html',
  styleUrl: './chain-edit-page.css',
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
