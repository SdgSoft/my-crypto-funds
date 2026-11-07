import { Chain, Coin, Wallet } from "./models";

export interface FormFieldOption {
  label: string;
  value: number;
}

export interface FormFieldConfig<T> {
  key: keyof T & string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'select'; // Added 'select'
  required?: boolean;
  options?: FormFieldOption[]; // Options for the select dropdown
}

export const CoinFieldsConfig : FormFieldConfig<Coin>[] = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'symbol', label: 'Symbol', type: 'text', required: true },
    { key: 'price', label: 'Price', type: 'number', required: false },
  ];

  export const ChainFieldsConfig : FormFieldConfig<Chain>[] = [
    { key: 'name', label: 'Name', type: 'text', required: true },
  ];

  export const WalletFieldsConfig : FormFieldConfig<Wallet>[] = [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'adress', label: 'Adress', type: 'text', required: false },
    { key: 'chainid', label: 'Chain', type: 'select', required: false, options: [] },
  ];