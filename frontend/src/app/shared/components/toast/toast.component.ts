import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-400 flex flex-col gap-3 pointer-events-none">
      <div 
        *ngFor="let toast of toasts$ | async" 
        class="pointer-events-auto p-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in border glass-card min-w-[300px]"
        [ngClass]="{
          'border-green-500/50 bg-green-500/10 text-green-500': toast.type === 'success',
          'border-red-500/50 bg-red-500/10 text-red-500': toast.type === 'error',
          'border-indigo-500/50 bg-indigo-500/10 text-indigo-400': toast.type === 'info',
          'border-yellow-500/50 bg-yellow-500/10 text-yellow-400': toast.type === 'warning'
        }"
      >
        <i class="fa-solid" [ngClass]="{
          'fa-circle-check': toast.type === 'success',
          'fa-circle-xmark': toast.type === 'error',
          'fa-circle-info': toast.type === 'info',
          'fa-triangle-exclamation': toast.type === 'warning'
        }"></i>
        <p class="text-sm font-medium">{{ toast.message }}</p>
        <button (click)="remove(toast.id)" class="ml-auto text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeInRight 0.3s ease-out;
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ToastComponent {
  toasts$;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }
}
