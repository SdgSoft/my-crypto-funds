import { IModel } from '.';
export interface Asset extends IModel {
  coinid: number,
  coinname: string,
  walletid: number,
  walletname: string,
  chainname: string,
  deposit: number,
  available: number,
  staked: number,
  updatedAt: Date,
}