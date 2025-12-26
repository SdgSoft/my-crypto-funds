import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
        <p class="mb-4">{{ message }}</p>
        <div class="flex justify-end gap-2">
            <button class="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" (click)="cancel.emit()">Cancel</button>
            <button class="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" (click)="confirm.emit()">Confirm</button>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class ConfirmDialogComponent {
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
