import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, startWith, switchMap } from 'rxjs';
import { Chain } from '../../models';
import { ChainsService } from '../../services/chains-service';

@Component({
    selector: 'app-chains-page',
    templateUrl: './chains-page.html',
    styleUrl: './chains-page.css',
    imports: [RouterLink, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChainsPage implements OnInit, OnDestroy {
  private chainsService = inject(ChainsService);

  private readonly refresh$ = new Subject<void>();
  chains$! : Observable<Chain[]>;

  ngOnInit(): void {
    this.chains$ = this.refresh$.pipe(
      startWith(undefined), // Load list immediately on init
      switchMap(() => this.chainsService.getChains()) // Fetch chains whenever 'refresh$' emits
    );
  }

  ngOnDestroy() {
    this.refresh$.complete(); // Explicitly complete the subject
  }

  onDeleteClicked(id: string): void {
    this.chainsService.deleteChain(id).subscribe({
      next: () => {
        // Upon successful delete, trigger the refresh subject.
        // This causes the switchMap above to run getChains() again automatically.
        this.refresh$.next();
      },
      error: (err) => {
        // Handle the error visually (e.g., show a snackbar/toast)
        console.error('Delete failed:', err);
      }
    });
  }
}
