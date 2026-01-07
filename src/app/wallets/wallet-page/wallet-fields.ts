import { Validators } from "@angular/forms";
import { FormField } from "../../common/form-fields";
import { Wallet } from "../../models";

export const WalletFieldsConfig : FormField<Wallet>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required], defaultValue: "" },
    { key: 'adress', label: 'Adress', type: 'text', defaultValue: "" },
    { key: 'chainid', label: 'Chain', type: 'select' },
];