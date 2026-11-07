import { IModel } from "./imodel";

export interface Wallet  extends IModel {
  name: string,
  adress?: string,
  chainid?: number,
  chainname?: string,
}