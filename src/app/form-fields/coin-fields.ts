import { Validators } from "@angular/forms";
import { FormField } from ".";
import { Coin } from "../models";

export const CoinFieldsConfig : FormField<Coin>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required] },
    { key: 'symbol', label: 'Symbol', type: 'text', validators: [Validators.required] },
    { key: 'price', label: 'Price', type: 'number' },
];
