import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService, ConfirmOptions } from '../../../core/services/confirm.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-300 flex items-center justify-center p-4 animate-fade-in">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/90 backdrop-blur-sm" (click)="cancel()"></div>
      
      <!-- Modal Content -->
      <div class="relative glass-card w-full max-w-md p-10 shadow-2xl border border-white/10 animate-scale-up z-10">
        <!-- Accent Bar -->
        <div class="absolute top-0 left-0 w-full h-1.5 rounded-t-xl bg-gradient-to-r" 
             [ngClass]="{
               'from-red-600 via-red-500 to-pink-600': options?.type === 'danger',
               'from-yellow-500 via-yellow-400 to-orange-500': options?.type === 'warning',
               'from-indigo-600 via-indigo-500 to-purple-600': options?.type === 'info' || !options?.type
             }">
        </div>

        <div class="flex flex-col items-center">
          <!-- Icon Container -->
          <div class="w-24 h-24 rounded-[32px] flex items-center justify-center mb-10 shadow-inner"
               [ngClass]="{
                 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5': options?.type === 'danger',
                 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-yellow-500/5': options?.type === 'warning',
                 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-indigo-500/5': options?.type === 'info' || !options?.type
               }">
            <i class="fa-solid fa-3x transition-transform hover:scale-110 duration-700" 
               [ngClass]="{
                 'fa-trash-can': options?.type === 'danger',
                 'fa-triangle-exclamation': options?.type === 'warning',
                 'fa-circle-question': options?.type === 'info' || !options?.type
               }"></i>
          </div>

          <h3 class="text-3xl font-black mb-4 text-white tracking-tighter">{{ options?.title }}</h3>
          <p class="text-slate-500 text-center text-lg mb-12 leading-relaxed font-bold max-w-[300px]">{{ options?.message }}</p>

          <div class="flex gap-5 w-full">
            <button (click)="cancel()" class="flex-1 btn btn-ghost border-white/5 bg-white/5 hover:bg-white/10 text-white !rounded-2xl !py-5 font-black uppercase tracking-[0.2em] text-[10px]">
              {{ options?.cancelText || 'Discard' }}
            </button>
            <button (click)="confirm()" 
                    class="flex-1 btn shadow-2xl font-black uppercase tracking-[0.2em] text-[10px] !rounded-2xl !py-5"
                    [ngClass]="{
                      'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25': options?.type === 'danger',
                      'bg-yellow-500 hover:bg-yellow-600 text-slate-900 shadow-yellow-500/25': options?.type === 'warning',
                      'btn-primary shadow-indigo-500/25': options?.type === 'info' || !options?.type
                    }">
              {{ options?.confirmText || 'Proceed' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-scale-up {
      animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ConfirmModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  options: ConfirmOptions | null = null;
  private resolver: ((result: boolean) => void) | null = null;
  private subscription?: Subscription;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.subscription = this.confirmService.confirm$.subscribe(data => {
      this.options = data.options;
      this.resolver = data.resolver;
      this.isOpen = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  confirm(): void {
    this.isOpen = false;
    this.resolver?.(true);
  }

  cancel(): void {
    this.isOpen = false;
    this.resolver?.(false);
  }
}
