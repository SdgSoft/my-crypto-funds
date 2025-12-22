import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { WalletsService } from '../../services/wallets-service';

@Component({
    selector: 'app-wallets-page',
    templateUrl: './wallets-page.html',
    styleUrl: './wallets-page.css',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsPage {
  private walletsService = inject(WalletsService);

  // rxResource handles the fetch, loading state, and error state automatically
  walletsResource = rxResource({
    stream: () => this.walletsService.getWallets(),
    defaultValue: []
  });

  onDeleteClicked(id: string): void {
    this.walletsService.deleteWallet(id).subscribe({
      next: () => {
        // Simple built-in method to re-fetch the data
        this.walletsResource.reload();
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}
