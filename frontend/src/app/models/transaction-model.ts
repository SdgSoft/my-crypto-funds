import { IModel } from '.';
export interface Transaction extends IModel {
  assetid: number;
  assetinfo?: string;
  deposit: number;
  available: number;
  staked: number;
  description?: string;
  updatedAt: Date;
  // Backend-calculated fields (optional for compatibility)
  averagePrice?: number;
  percPrice?: number;
  currentPrice?: number;
  currentValue?: number;
  gains?: number;
  percGains?: number;
}