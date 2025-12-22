import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { AssetsPage } from './assets/assets-page/assets-page';
import { ChainDetailPage } from './chains/chain-detail-page/chain-detail-page';
import { ChainEditPage } from './chains/chain-edit-page/chain-edit-page';
import { ChainNewPage } from './chains/chain-new-page/chain-new-page';
import { ChainsPage } from './chains/chains-page/chains-page';
import { CoinDetailPage } from './coins/coin-detail-page/coin-detail-page';
import { CoinEditPage } from './coins/coin-edit-page/coin-edit-page';
import { CoinNewPage } from './coins/coin-new-page/coin-new-page';
import { CoinsPage } from './coins/coins-page/coins-page';
import { DataForm } from './data-form/data-form';
import { NavBar } from './nav-bar/nav-bar';
import { WalletDetailPage } from './wallets/wallet-detail-page/wallet-detail-page';
import { WalletEditPage } from './wallets/wallet-edit-page/wallet-edit-page';
import { WalletNewPage } from './wallets/wallet-new-page/wallet-new-page';
import { WalletsPage } from './wallets/wallets-page/wallets-page';

@NgModule({
  declarations: [
    App,
    AssetsPage,
    ChainsPage,
    ChainDetailPage,
    ChainNewPage,
    ChainEditPage,
    CoinsPage,
    CoinDetailPage,
    CoinNewPage,
    CoinEditPage,
    WalletsPage,
    WalletDetailPage,
    WalletNewPage,
    WalletEditPage,
    NavBar,
    DataForm,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
  bootstrap: [App]
})
export class AppModule { }
