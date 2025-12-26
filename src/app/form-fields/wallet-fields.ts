import { Validators } from "@angular/forms";
import { Wallet } from "../models";
import { FormField } from "./form-field";

export const WalletFieldsConfig : FormField<Wallet>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required], defaultValue: "" },
    { key: 'adress', label: 'Adress', type: 'text', defaultValue: "" },
    { key: 'chainid', label: 'Chain', type: 'select' },
];