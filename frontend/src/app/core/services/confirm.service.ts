import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly _confirmSubject = new Subject<{ options: ConfirmOptions; resolver: (result: boolean) => void }>();
  readonly confirm$ = this._confirmSubject.asObservable();

  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this._confirmSubject.next({ options, resolver: resolve });
    });
  }
}
