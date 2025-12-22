import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ChainsService } from '../../services/chains-service';

@Component({
    selector: 'app-chains-page',
    templateUrl: './chains-page.html',
    styleUrl: './chains-page.css',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainsPage {
  private chainsService = inject(ChainsService);

   // rxResource automatically subscribes to the stream and exposes signals
  chainsResource = rxResource({
    stream: () => this.chainsService.getChains(),
    defaultValue: [] // Initial empty state avoids undefined issues
  });

  onDeleteClicked(id: string): void {
    this.chainsService.deleteChain(id).subscribe({
      next: () => {
        // Triggers the stream to execute again
        this.chainsResource.reload();
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}
