import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, startWith, switchMap } from 'rxjs';
import { Coin } from '../../models';
import { CoinsService } from '../../services/coins-service';

@Component({
    selector: 'app-coins-page',
    templateUrl: './coins-page.html',
    styleUrl: './coins-page.css',
    imports: [RouterLink, AsyncPipe, CurrencyPipe, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinsPage implements OnInit, OnDestroy {
  private coinsService = inject(CoinsService);

  private readonly refresh$ = new Subject<void>();
  coins$! : Observable<Coin[]>;

  ngOnInit(): void {
    this.coins$ = this.refresh$.pipe(
      startWith(undefined), // Load list immediately on init
      switchMap(() => this.coinsService.getCoins()) // Fetch coins whenever 'refresh$' emits
    );
  }

  ngOnDestroy() {
    this.refresh$.complete(); // Explicitly complete the subject
  }

  onDeleteClicked(id: string): void {
    this.coinsService.deleteCoin(id).subscribe({
      next: () => {
        // Upon successful delete, trigger the refresh subject.
        // This causes the switchMap above to run getCoins() again automatically.
        this.refresh$.next();
      },
      error: (err) => {
        // Handle the error visually (e.g., show a snackbar/toast)
        console.error('Delete failed:', err);
      }
    });
  }
}
