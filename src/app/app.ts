import { Component, signal } from '@angular/core';
import { NavBar } from './nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
    imports: [NavBar, RouterOutlet],
})
export class App {
  protected readonly title = signal('my-crypto-funds-classic');
}
