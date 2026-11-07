import { Validators } from "@angular/forms";
import { FormField, FormFieldFormatters } from "../../common/form-fields";
import { Coin } from "../../models";


export const CoinFieldsConfig : FormField<Coin>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required], defaultValue: "" },
    { key: 'symbol', label: 'Symbol', type: 'text', validators: [Validators.required], defaultValue: "" },
    { key: 'slug', label: 'Slug', type: 'text', defaultValue: "" },
    { key: 'price', label: 'Price (EUR)', type: 'text', defaultValue: 0, format: FormFieldFormatters.price('€', 'en-US', 2, 10) },
];
