import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-assets-page',
    templateUrl: './assets-page.html',
    styleUrl: './assets-page.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPage {

}
