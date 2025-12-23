import { Routes } from '@angular/router';
import { AssetsPage } from './assets/assets-page/assets-page';
import { ChainDetailPage } from './chains/chain-detail-page/chain-detail-page';
import { ChainEditPage } from './chains/chain-edit-page/chain-edit-page';
import { ChainNewPage } from './chains/chain-new-page/chain-new-page';
import { ChainsPage } from './chains/chains-page/chains-page';
import { CoinDetailPage } from './coins/coin-detail-page/coin-detail-page';
import { CoinEditPage } from './coins/coin-edit-page/coin-edit-page';
import { CoinNewPage } from './coins/coin-new-page/coin-new-page';
import { CoinsPage } from './coins/coins-page/coins-page';
import { WalletDetailPage } from './wallets/wallet-detail-page/wallet-detail-page';
import { WalletEditPage } from './wallets/wallet-edit-page/wallet-edit-page';
import { WalletNewPage } from './wallets/wallet-new-page/wallet-new-page';
import { WalletsPage } from './wallets/wallets-page/wallets-page';

export const routes: Routes = [
  { path: '', redirectTo: '/assets', pathMatch: 'full' },
  { path: 'assets', component: AssetsPage , pathMatch: 'full' },
  { path: 'chains', component: ChainsPage , pathMatch: 'full' },
  { path: 'chains/:id', component: ChainDetailPage},
  { path: 'chain-new', component: ChainNewPage},
  { path: 'chain-edit/:id', component: ChainEditPage},
  { path: 'coins', component: CoinsPage , pathMatch: 'full' },
  { path: 'coins/:id', component: CoinDetailPage},
  { path: 'coin-new', component: CoinNewPage},
  { path: 'coin-edit/:id', component: CoinEditPage},
  { path: 'wallets', component: WalletsPage , pathMatch: 'full' },
  { path: 'wallets/:id', component: WalletDetailPage},
  { path: 'wallet-new', component: WalletNewPage},
  { path: 'wallet-edit/:id', component: WalletEditPage},
];
