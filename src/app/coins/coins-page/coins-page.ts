import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CoinsService } from '../../services/coins-service';

@Component({
    selector: 'app-coins-page',
    templateUrl: './coins-page.html',
    styleUrl: './coins-page.css',
    imports: [RouterLink, CurrencyPipe, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinsPage {
  private coinsService = inject(CoinsService);

  coinsResource = rxResource({
    stream: () => this.coinsService.getCoins(),
    defaultValue: [] // Ensures coinsResource.value() returns Coin[] instead of Coin[] | undefined
  });

  onDeleteClicked(id: string): void {
    this.coinsService.deleteCoin(id).subscribe({
      next: () => {
        // Built-in reload() re-triggers the stream logic
        this.coinsResource.reload();
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}
