import { Coin, Wallet } from '.'
export interface Asset {
  id: number,
  coin: Coin,
  wallet: Wallet,
  deposit: number,
  coins: number,
  coinsStaked: number,
  updatedAt: Date,
}