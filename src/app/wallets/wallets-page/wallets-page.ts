import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, startWith, switchMap } from 'rxjs';
import { Wallet } from '../../models';
import { WalletsService } from '../../services/wallets-service';

@Component({
    selector: 'app-wallets-page',
    templateUrl: './wallets-page.html',
    styleUrl: './wallets-page.css',
    imports: [RouterLink, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsPage implements OnInit, OnDestroy {
  private readonly refresh$ = new Subject<void>();
  wallets$! : Observable<Wallet[]>;

  constructor(private walletsService: WalletsService ) {
    this.wallets$ = this.refresh$.pipe(
      startWith(undefined), // Load list immediately on init
      switchMap(() => this.walletsService.getWallets()) // Fetch wallets whenever 'refresh$' emits
    );
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.refresh$.complete(); // Explicitly complete the subject
  }

  onDeleteClicked(id: string): void {
    this.walletsService.deleteWallet(id).subscribe({
      next: () => {
        // Upon successful delete, trigger the refresh subject.
        // This causes the switchMap above to run getWallets() again automatically.
        this.refresh$.next();
      },
      error: (err) => {
        // Handle the error visually (e.g., show a snackbar/toast)
        console.error('Delete failed:', err);
      }
    });
  }
}
