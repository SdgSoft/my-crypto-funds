import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.html',
    styleUrl: './nav-bar.css',
    imports: [RouterLink, RouterLinkActive],
})
export class NavBar {

}
