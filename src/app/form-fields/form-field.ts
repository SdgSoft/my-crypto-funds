import { ValidatorFn, Validators } from "@angular/forms";
import { FormFieldOption } from ".";
import { ValidationError } from "@angular/forms/signals";
import { Observable } from "rxjs";

export interface FormField<T> {
  key: keyof T & string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'select'; // Added 'select'
  options?: FormFieldOption[]; // Options for the select dropdown
  options$?: Observable<FormFieldOption[]>
  validators?: any[];
}