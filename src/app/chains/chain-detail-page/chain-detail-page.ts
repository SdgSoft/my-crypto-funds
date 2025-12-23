import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DataForm } from '../../data-form/data-form';
import { ChainFieldsConfig } from '../../form-fields';
import { ChainsService } from '../../services/chains-service';

@Component({
    selector: 'app-chain-detail-page',
    templateUrl: './chain-detail-page.html',
    styleUrl: './chain-detail-page.css',
    imports: [DataForm],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainDetailPage {
  private route = inject(ActivatedRoute);
  private chainsService = inject(ChainsService);

  readonly id = input.required<string>();
  chainFieldsConfig = ChainFieldsConfig;

  chainResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.chainsService.getChainById(params.id)
  });
}