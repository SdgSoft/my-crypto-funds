import { Model } from "./model";

export interface Wallet  extends Model {
  name: string,
  adress?: string,
  chainid?: number,
  chainname?: string,
}