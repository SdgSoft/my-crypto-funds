import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormattedInput]'
})
export class FormattedInputDirective implements OnInit {
  @Input('appFormattedInput') formatFn: ((val: string) => string) | null = null;

  public lastRawValue: string = '';

  constructor(private el: ElementRef<HTMLInputElement>, public control: NgControl) {}

  ngOnInit() {
    this.lastRawValue = this.control.value ?? '';
    if (this.formatFn && this.lastRawValue !== '') {
      this.el.nativeElement.value = this.formatFn(this.lastRawValue);
    }
  }

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.value = this.lastRawValue;
  }

  @HostListener('blur')
  onBlur() {
    // Always use the latest raw value for formatting
    if (this.formatFn && this.lastRawValue !== '') {
      this.control.control?.setValue(this.formatFn(this.lastRawValue));
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
