import { Routes } from '@angular/router';
import { AssetEditPage } from './assets/asset-edit-page/asset-edit-page';
import { AssetNewPage } from './assets/asset-new-page/asset-new-page';
import { AssetsPage } from './assets/assets-page/assets-page';
import { ChainEditPage } from './chains/chain-edit-page/chain-edit-page';
import { ChainNewPage } from './chains/chain-new-page/chain-new-page';
import { ChainsPage } from './chains/chains-page/chains-page';
import { CoinEditPage } from './coins/coin-edit-page/coin-edit-page';
import { CoinNewPage } from './coins/coin-new-page/coin-new-page';
import { CoinsPage } from './coins/coins-page/coins-page';
import { TransactionEditPage } from './transactions/transaction-edit-page/transaction-edit-page';
import { TransactionNewPage } from './transactions/transaction-new-page/transaction-new-page';
import { TransactionsPage } from './transactions/transactions-page/transactions-page';
import { WalletEditPage } from './wallets/wallet-edit-page/wallet-edit-page';
import { WalletNewPage } from './wallets/wallet-new-page/wallet-new-page';
import { WalletsPage } from './wallets/wallets-page/wallets-page';

export const routes: Routes = [
  { path: '', redirectTo: '/assets', pathMatch: 'full' },
  { path: 'assets', component: AssetsPage , pathMatch: 'full' },
  { path: 'assets/new', component: AssetNewPage, pathMatch: 'full' },
  { path: 'assets/edit/:id', component: AssetEditPage},
  { path: 'assets/transactions/:assetid', component: TransactionsPage},
  { path: 'assets/transactions/new/:assetid', component: TransactionNewPage },
  { path: 'assets/transactions/edit/:id', component: TransactionEditPage},
  { path: 'chains', component: ChainsPage , pathMatch: 'full' },
  { path: 'chains/new', component: ChainNewPage, pathMatch: 'full' },
  { path: 'chains/edit/:id', component: ChainEditPage},
  { path: 'coins', component: CoinsPage , pathMatch: 'full' },
  { path: 'coins/new', component: CoinNewPage, pathMatch: 'full' },
  { path: 'coins/edit/:id', component: CoinEditPage},
  { path: 'wallets', component: WalletsPage , pathMatch: 'full' },
  { path: 'wallets/new', component: WalletNewPage, pathMatch: 'full' },
  { path: 'wallets/edit/:id', component: WalletEditPage},
];
