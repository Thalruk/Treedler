import { Directive, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[appHoldToBuy]',
  standalone: true,
})
export class HoldToBuyDirective implements OnDestroy {
  @Output() public buyTrigger = new EventEmitter<void>();

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isHolding = false;

  private readonly initialDelay = 380;
  private readonly minDelay = 40;
  private readonly acceleration = 0.82;

  @HostListener('pointerdown', ['$event'])
  public onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    this.stopHolding();
    this.isHolding = true;

    this.buyTrigger.emit();

    this.scheduleNextTick(this.initialDelay);
  }

  @HostListener('pointerup')
  @HostListener('pointerleave')
  @HostListener('pointercancel')
  @HostListener('window:blur')
  public onPointerRelease(): void {
    this.stopHolding();
  }

  private scheduleNextTick(currentDelay: number): void {
    if (!this.isHolding) {
      return;
    }

    this.timeoutId = setTimeout(() => {
      if (!this.isHolding) {
        return;
      }

      this.buyTrigger.emit();

      const nextDelay = Math.max(this.minDelay, Math.floor(currentDelay * this.acceleration));
      this.scheduleNextTick(nextDelay);
    }, currentDelay);
  }

  private stopHolding(): void {
    this.isHolding = false;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public ngOnDestroy(): void {
    this.stopHolding();
  }
}
