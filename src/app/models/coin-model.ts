export interface Coin {
  id: number,
  name: string,
  symbol: string,
  slug?: string,
  price?: number,
  updatedAt: Date,
}