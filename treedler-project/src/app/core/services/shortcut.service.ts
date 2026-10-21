import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class ShortcutService {
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  public multiplier = signal<number>(1);

  constructor() {
    const windowObj = this.document.defaultView;
    if (!windowObj) return;

    const keydown$ = fromEvent<KeyboardEvent>(windowObj, 'keydown');
    const keyup$ = fromEvent<KeyboardEvent>(windowObj, 'keyup');

    merge(keydown$, keyup$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => this.updateMultiplier(e));
  }

  private updateMultiplier(e: KeyboardEvent): void {
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
