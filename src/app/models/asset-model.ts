import { Coin, IModel, Wallet } from '.';
export interface Asset extends IModel {
  coin: Coin,
  wallet: Wallet,
  deposit: number,
  coins: number,
  coinsStaked: number,
  updatedAt: Date,
}