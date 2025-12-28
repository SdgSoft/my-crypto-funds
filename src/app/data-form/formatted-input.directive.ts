import { Directive, ElementRef, HostListener, OnInit, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormattedInput]'
})

export class FormattedInputDirective implements OnInit {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  control = inject(NgControl);

  readonly formatFn = input<((val: string) => string) | null>(null, { alias: 'appFormattedInput' });

  public lastRawValue = '';

  ngOnInit() {
    this.lastRawValue = this.control.value ?? '';
    if (this.formatFn() && this.lastRawValue !== '') {
      this.el.nativeElement.value = this.formatFn()!(this.lastRawValue);
    }
  }

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.value = this.lastRawValue;
  }

  @HostListener('blur')
  onBlur() {
    // Always use the latest raw value for formatting
    if (this.formatFn() && this.lastRawValue !== '') {
      this.control.control?.setValue(this.formatFn()!(this.lastRawValue));
    } else {
      this.control.control?.setValue(this.lastRawValue);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.lastRawValue = value;
    this.control.control?.setValue(value);
  }
}
