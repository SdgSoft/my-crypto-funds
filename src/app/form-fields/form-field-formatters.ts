export type FormatterFunction = (val: string) => string;

export class FormFieldFormatters {
  static price(
    currencySymbol: string = '',
    locale: string = 'en-US',
    minFractionDigits: number = 2,
    maxFractionDigits: number = 2
  ): FormatterFunction {
    return (val: string) => {
      const num = Number(val);
      if (isNaN(num) || val === '') return '';
      return `${currencySymbol} ${num.toLocaleString(locale, { minimumFractionDigits: minFractionDigits, maximumFractionDigits: maxFractionDigits })}`.trim();
    };
  }

  static number(
    locale: string = 'en-US',
    minFractionDigits: number,
    maxFractionDigits: number
  ): FormatterFunction {
    return (val: string) => {
      const num = Number(val);
      if (isNaN(num) || val === '') return '';
      return `${num.toLocaleString(locale, { minimumFractionDigits: minFractionDigits, maximumFractionDigits: maxFractionDigits })}`.trim();
    };
  }
}