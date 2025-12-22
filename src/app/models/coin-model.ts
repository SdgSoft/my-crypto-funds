import { IModel } from "./imodel";

export interface Coin  extends IModel {
  name: string,
  symbol: string,
  slug?: string,
  price?: number,
  updatedAt: Date,
}