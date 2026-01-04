import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = computed(() => this._toasts());
  private _counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const id = this._counter++;
    const toast: Toast = { message, type, id };
    
    this._toasts.update(toasts => [...toasts, toast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  remove(id: number): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
