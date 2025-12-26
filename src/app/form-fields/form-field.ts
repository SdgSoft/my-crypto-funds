
import { ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { FormatterFunction } from "./form-field-formatters";
import { FormFieldOption } from './form-field-option';

export interface FormField<T> {
  key: keyof T & string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'select'; // Added 'select'
  options?: FormFieldOption[]; // Options for the select dropdown
  options$?: Observable<FormFieldOption[]>
  validators?: ValidatorFn[];
  defaultValue?: unknown;
  format?: FormatterFunction;
}