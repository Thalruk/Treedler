import { Injectable, signal, computed } from '@angular/core';

export type BuyMultiplierOption = 1 | 5 | 10 | 'MAX';

export const BUY_MULTIPLIER_OPTIONS: BuyMultiplierOption[] = [1, 5, 10, 'MAX'];

@Injectable({ providedIn: 'root' })
export class ShortcutService {
  public baseMultiplier = signal<BuyMultiplierOption>(1);

  private isShiftPressed = signal<boolean>(false);
  private isCtrlPressed = signal<boolean>(false);
  private isAltPressed = signal<boolean>(false);

  public multiplier = computed<number | 'MAX'>(() => {
    if (this.isAltPressed()) return 'MAX';

    let modifierMultiplier = 1;
    if (this.isShiftPressed()) modifierMultiplier *= 5;
    if (this.isCtrlPressed()) modifierMultiplier *= 10;

    if (modifierMultiplier > 1) return modifierMultiplier;

    return this.baseMultiplier();
  });

  public getNumericMultiplier(): number {
    const value = this.multiplier();
    return value === 'MAX' ? 1000 : value;
  }

  constructor() {
    window.addEventListener('keydown', (event) => this.updateModifierKeys(event));
    window.addEventListener('keyup', (event) => this.updateModifierKeys(event));
    window.addEventListener('blur', () => this.resetModifiers());
  }

  public setBaseMultiplier(value: BuyMultiplierOption): void {
    this.baseMultiplier.set(value);
  }

  private updateModifierKeys(event: KeyboardEvent): void {
    this.isShiftPressed.set(event.shiftKey);
    this.isCtrlPressed.set(event.ctrlKey || event.metaKey);
    this.isAltPressed.set(event.altKey);
  }

  private resetModifiers(): void {
    this.isShiftPressed.set(false);
    this.isCtrlPressed.set(false);
    this.isAltPressed.set(false);
  }
}
