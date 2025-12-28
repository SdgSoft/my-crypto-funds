import { IModel } from '.';
export interface Asset extends IModel {
  assetinfo?: string;
  coinid: number;
  coinname?: string;
  coinsymbol?: string;
  walletid: number;
  walletname?: string;
  chainname?: string;
  deposit?: number;
  available?: number;
  staked?: number;
  updatedAt?: Date;
  // Backend-calculated fields (optional for compatibility)
  averagePrice?: number;
  percPrice?: number;
  currentPrice?: number;
  currentValue?: number;
  gains?: number;
  percGains?: number;
}