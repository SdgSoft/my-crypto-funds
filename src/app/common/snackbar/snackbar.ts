import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-snackbar',
  template: `
    @if (message()) {
      <div class="snackbar" [class.error]="type() === 'error'" [class.success]="type() === 'success'" [class.info]="type() === 'info'">
        {{ message() }}
      </div>
    }
  `,
  styles: [`
    .snackbar {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 50;
      transition: opacity 0.3s;
      opacity: 0.95;
      min-width: 200px;
      max-width: 90vw;
      pointer-events: none;
    }
    .snackbar.error { background: #dc2626; }
    .snackbar.success { background: #16a34a; }
    .snackbar.info { background: #2563eb; }
  `],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackbarComponent {
  private notification = inject(NotificationService);
  message = this.notification.message;
  type = this.notification.type;
}
