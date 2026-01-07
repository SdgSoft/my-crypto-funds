import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarComponent } from './common/snackbar/snackbar';
import { NavBar } from './nav-bar/nav-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
    imports: [NavBar, RouterOutlet, SnackbarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('my-crypto-funds');
}
