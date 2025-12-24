import { Validators } from "@angular/forms";
import { FormField } from "../form-fields";
import { Asset } from "../models";

export const AssetFieldsConfig : FormField<Asset>[] = [
    { key: 'coinid', label: 'Coin', type: 'select', validators: [Validators.required] },
    { key: 'walletid', label: 'Wallet', type: 'select', validators: [Validators.required] },
    { key: 'deposit', label: 'Deposit', type: 'number', validators: [Validators.required, Validators.min(0)], defaultValue: 0 },
    { key: 'available', label: 'Available', type: 'number', validators: [Validators.required, Validators.min(0)], defaultValue: 0 },
    { key: 'staked', label: 'Staked', type: 'number', validators: [Validators.required, Validators.min(0)], defaultValue: 0 },
];