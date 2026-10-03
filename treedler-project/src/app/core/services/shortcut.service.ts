import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShortcutService {
  public multiplier = signal<number>(1);

  constructor() {
    window.addEventListener('keydown', (e) => this.update(e));
    window.addEventListener('keyup', (e) => this.update(e));
  }

  private update(e: KeyboardEvent): void {
    if (e.shiftKey && e.ctrlKey) {
      this.multiplier.set(50);
    } else if (e.ctrlKey) {
      this.multiplier.set(10);
    } else if (e.shiftKey) {
      this.multiplier.set(5);
    } else {
      this.multiplier.set(1);
    }
  }
}
