import { Validators } from "@angular/forms";
import { Chain } from "../models";
import { FormField } from "./form-field";

export const ChainFieldsConfig : FormField<Chain>[] = [
    { key: 'name', label: 'Name', type: 'text', validators: [Validators.required], defaultValue: "" },
];
