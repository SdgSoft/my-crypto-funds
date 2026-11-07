import { Validators } from "@angular/forms";
import { FormField } from "../../common/form-fields";
import { Asset } from "../../models";

export const AssetFieldsConfig : FormField<Asset>[] = [
    { key: 'coinid', label: 'Coin', type: 'select', validators: [Validators.required] },
    { key: 'walletid', label: 'Wallet', type: 'select', validators: [Validators.required] },
];