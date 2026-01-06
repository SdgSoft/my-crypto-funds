import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, HostListener, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';

@Directive({
  selector: '[appFormattedInput]'
})
export class FormattedInputDirective implements AfterViewInit {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  control = inject(NgControl);

  readonly formatFn = input<((val: string) => string) | null>(null, { alias: 'appFormattedInput' });

  public lastRawValue = '';

  ngAfterViewInit() {
    // Subscribe to value changes, including the initial value, but do NOT format on every change
    this.control.control?.valueChanges
      .pipe(startWith(this.control.value))
      .subscribe(val => {
        const strVal = val != null ? String(val) : '';
        this.lastRawValue = strVal;
        // Only update the input value directly, do not format here
        this.el.nativeElement.value = strVal;
        this.cdr.markForCheck();
      });

    // Force update after a short delay in case value is patched late
    setTimeout(() => {
      const initialValue = this.control.value;
      const strVal = initialValue != null ? String(initialValue) : '';
      this.lastRawValue = strVal;
      if (this.formatFn() && strVal !== '') {
        this.el.nativeElement.value = this.formatFn()!(strVal);
      } else {
        this.el.nativeElement.value = strVal;
      }
      this.cdr.markForCheck();
    }, 50);
  }

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.value = this.lastRawValue;
    this.cdr.markForCheck();
  }

  @HostListener('blur')
  onBlur() {
    if (this.formatFn() && this.lastRawValue !== '') {
      this.el.nativeElement.value = this.formatFn()!(this.lastRawValue);
    } else {
      this.el.nativeElement.value = this.lastRawValue;
    }
    this.cdr.markForCheck();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = String((event.target as HTMLInputElement).value);
    this.lastRawValue = value;
    this.control.control?.setValue(value);
    this.cdr.markForCheck();
  }
}