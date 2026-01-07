import { Validators } from "@angular/forms";
import { FormField } from "../../common/form-fields";
import { Chain } from "../../models";

export const ChainFieldsConfig : FormField<Chain>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required], defaultValue: "" },
];
