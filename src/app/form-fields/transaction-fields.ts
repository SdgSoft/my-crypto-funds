import { Validators } from "@angular/forms";
import { Transaction } from "../models/transaction-model";
import { FormField } from "./form-field";
import { FormFieldFormatters } from "./form-field-formatters";

export const TransactionFieldsConfig : FormField<Transaction>[] = [
    { key: 'deposit', label: 'Deposit', type: 'text', validators: [Validators.required], defaultValue: 0, format: FormFieldFormatters.price('€', 'en-US', 2, 2) },
    { key: 'available', label: 'Available', type: 'text', validators: [Validators.required], defaultValue: 0,format: FormFieldFormatters.number('en-US', 2, 10) },
    { key: 'staked', label: 'Staked', type: 'text', validators: [Validators.required], defaultValue: 0, format: FormFieldFormatters.number('en-US', 2, 10) },
    { key: 'description', label: 'Description', type: 'text', defaultValue: '' },
];