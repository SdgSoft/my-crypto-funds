import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" (click)="cancelDialog.emit()" tabindex="0" (keydown.enter)="cancelDialog.emit()" (keydown.space)="cancelDialog.emit()">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs" (click)="$event.stopPropagation()" tabindex="0" (keydown.enter)="$event.stopPropagation()" (keydown.space)="$event.stopPropagation()">
        <h3 class="text-lg font-semibold mb-2">{{ title() }}</h3>
        <p class="mb-4">{{ message() }}</p>
        <div class="flex justify-end gap-2">
            <button class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" (click)="cancelDialog.emit()" (keydown.enter)="cancelDialog.emit()" (keydown.space)="cancelDialog.emit()" tabindex="0">Cancel</button>
            <button class="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" (click)="confirmDialog.emit()" (keydown.enter)="confirmDialog.emit()" (keydown.space)="confirmDialog.emit()" tabindex="0">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  readonly title = input('Are you sure?');
  readonly message = input('This action cannot be undone.');
  confirmDialog = output<void>();
  cancelDialog = output<void>();
}
