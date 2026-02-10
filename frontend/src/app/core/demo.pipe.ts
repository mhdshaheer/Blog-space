import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'square', pure: true })
export class SquarePipe implements PipeTransform {
  transform(value: number): number {
    return value ** 2;
  }
}

// Pure pipe change when input changes
// Impure pipe change every change detection.
