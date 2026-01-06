import { Routes } from '@angular/router';
import { AssetsPage } from './assets/assets-page/assets-page';
import { ChainsPage } from './chains/chains-page/chains-page';
import { CoinsPage } from './coins/coins-page/coins-page';
import { TransactionsPage } from './transactions/transactions-page/transactions-page';
import { WalletsPage } from './wallets/wallets-page/wallets-page';

export const routes: Routes = [
  { path: '', redirectTo: '/assets', pathMatch: 'full' },
  { path: 'assets', component: AssetsPage , pathMatch: 'full' },
  { path: 'assets/transactions/:assetid', component: TransactionsPage},
  { path: 'chains', component: ChainsPage , pathMatch: 'full' },
  { path: 'coins', component: CoinsPage , pathMatch: 'full' },
  { path: 'wallets', component: WalletsPage , pathMatch: 'full' },
];
