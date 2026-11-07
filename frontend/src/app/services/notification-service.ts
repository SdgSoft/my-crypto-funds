import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _message = signal<string | null>(null);
  private readonly _type = signal<'error' | 'success' | 'info'>('info');

  readonly message = this._message;
  readonly type = this._type;

  show(message: string, type: 'error' | 'success' | 'info' = 'info', duration = 4000) {
    this._message.set(message);
    this._type.set(type);
    setTimeout(() => this.clear(), duration);
  }

  clear() {
    this._message.set(null);
  }
}
