import { Coin, Model, Wallet } from '.';
export interface Asset extends Model {
  coin: Coin,
  wallet: Wallet,
  deposit: number,
  coins: number,
  coinsStaked: number,
  updatedAt: Date,
}