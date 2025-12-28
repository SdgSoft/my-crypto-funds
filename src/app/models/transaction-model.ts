import { IModel } from '.';
export interface Transaction extends IModel {
  assetid: number,
  assetinfo?: string,
  deposit: number,
  available: number,
  staked: number,
  description?: string
  updatedAt: Date,
}