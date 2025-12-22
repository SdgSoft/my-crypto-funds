import { Model } from "./model";

export interface Coin  extends Model {
  name: string,
  symbol: string,
  slug?: string,
  price?: number,
  updatedAt: Date,
}