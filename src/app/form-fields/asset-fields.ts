import { Validators } from "@angular/forms";
import { Asset } from "../models";
import { FormField } from "./form-field";

export const AssetFieldsConfig : FormField<Asset>[] = [
    { key: 'coinid', label: 'Coin', type: 'select', validators: [Validators.required] },
    { key: 'walletid', label: 'Wallet', type: 'select', validators: [Validators.required] },
];