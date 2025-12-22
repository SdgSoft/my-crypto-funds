import { Validators } from "@angular/forms";
import { FormField } from ".";
import { Wallet } from "../models";

export const WalletFieldsConfig : FormField<Wallet>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required] },
    { key: 'adress', label: 'Adress', type: 'text' },
    { key: 'chainid', label: 'Chain', type: 'select' },
];