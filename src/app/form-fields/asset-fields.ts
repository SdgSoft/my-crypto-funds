import { Validators } from "@angular/forms";
import { Asset } from "../models";
import { FormField } from "./form-field";
import { FormFieldFormatters } from "./form-field-formatters";

export const AssetFieldsConfig : FormField<Asset>[] = [
    { key: 'coinid', label: 'Coin', type: 'select', validators: [Validators.required] },
    { key: 'walletid', label: 'Wallet', type: 'select', validators: [Validators.required] },
    { key: 'deposit', label: 'Deposit', type: 'text', validators: [Validators.required, Validators.min(0)], defaultValue: 0, format: FormFieldFormatters.price('€', 'en-US', 2, 2) },
    { key: 'available', label: 'Available', type: 'text', validators: [Validators.required, Validators.min(0)], defaultValue: 0,format: FormFieldFormatters.number('en-US', 2, 10) },
    { key: 'staked', label: 'Staked', type: 'text', validators: [Validators.required, Validators.min(0)], defaultValue: 0, format: FormFieldFormatters.number('en-US', 2, 10) },
];