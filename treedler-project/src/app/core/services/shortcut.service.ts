import { Injectable, signal, computed } from '@angular/core';

export type BuyMultiplierOption = 1 | 5 | 10 | 'MAX';

@Injectable({ providedIn: 'root' })
export class ShortcutService {
  public baseMultiplier = signal<BuyMultiplierOption>(1);

  private isShiftPressed = signal<boolean>(false);
  private isCtrlPressed = signal<boolean>(false);
  private isAltPressed = signal<boolean>(false);

  public multiplier = computed<number | 'MAX'>(() => {
    if (this.isAltPressed()) return 'MAX';

    let mult = 1;
    if (this.isShiftPressed()) mult *= 5;
    if (this.isCtrlPressed()) mult *= 10;

    // Jeśli wciśnięto modyfikatory (wynik 5, 10 lub 50), nadpisują one bazę
    if (mult > 1) return mult;

    return this.baseMultiplier();
  });

  // Metoda pomocnicza dla UpgradeService - tłumaczy 'MAX' na bezpieczny limit dla pętli
  public getNumericMultiplier(): number {
    const val = this.multiplier();
    return val === 'MAX' ? 1000 : val;
  }

  constructor() {
    window.addEventListener('keydown', (e) => this.updateModifierKeys(e));
    window.addEventListener('keyup', (e) => this.updateModifierKeys(e));
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
