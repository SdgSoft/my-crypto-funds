import { IModel } from "./imodel";

export interface Coin  extends IModel {
  name: string,
  symbol: string,
  slug?: string,
  price?: number,
  updatedAt: Date,
  totalDeposit?: number,
  totalHolding?: number,
  averagePrice?: number,
  priceDifference?: number,
  percDifference?: number,
}