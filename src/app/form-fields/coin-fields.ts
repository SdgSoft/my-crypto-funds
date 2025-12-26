import { Validators } from "@angular/forms";
import { Coin } from "../models";
import { FormField } from "./form-field";
import { FormFieldFormatters } from "./form-field-formatters";

export const CoinFieldsConfig : FormField<Coin>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required], defaultValue: "" },
    { key: 'symbol', label: 'Symbol', type: 'text', validators: [Validators.required], defaultValue: "" },
    { key: 'slug', label: 'Slug', type: 'text', defaultValue: "" },
    { key: 'price', label: 'Price (EUR)', type: 'text', defaultValue: 0, format: FormFieldFormatters.price('€', 'en-US', 2, 10) },
];
