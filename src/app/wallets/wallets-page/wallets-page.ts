import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletsService } from '../../services/wallets-service';
import { Observable, Subject, startWith, switchMap } from 'rxjs';
import { Wallet } from '../../models';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-wallets-page',
    templateUrl: './wallets-page.html',
    styleUrl: './wallets-page.css',
    imports: [RouterLink, AsyncPipe]
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
