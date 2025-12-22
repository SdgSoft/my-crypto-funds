import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChainsService } from '../../services/chains-service';
import { Observable, Subject, startWith, switchMap } from 'rxjs';
import { Chain } from '../../models';

@Component({
  selector: 'app-chains-page',
  standalone: false,
  templateUrl: './chains-page.html',
  styleUrl: './chains-page.css'
})
export class ChainsPage implements OnInit, OnDestroy {
  private readonly refresh$ = new Subject<void>();
  chains$! : Observable<Chain[]>;

  constructor(private chainsService: ChainsService ) {
    this.chains$ = this.refresh$.pipe(
      startWith(undefined), // Load list immediately on init
      switchMap(() => this.chainsService.getChains()) // Fetch chains whenever 'refresh$' emits
    );
  }

  ngOnInit(): void {

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
