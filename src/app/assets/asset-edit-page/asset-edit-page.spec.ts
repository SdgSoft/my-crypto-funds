import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AssetsService } from '../../services/assets-service';
import { CoinsService } from '../../services/coins-service';
import { WalletsService } from '../../services/wallets-service';
import { AssetEditPage } from './asset-edit-page';

describe('AssetEditPage', () => {
  let component: AssetEditPage;
  let fixture: ComponentFixture<AssetEditPage>;
  let mockAssetsService: { getAssetById: () => unknown; editAsset: () => unknown };
  let mockCoinsService: { getCoins: () => unknown };
  let mockWalletsService: { getWallets: () => unknown };

  beforeEach(async () => {
    mockAssetsService = {
      getAssetById: vi.fn().mockReturnValue(of({
        id: 1,
        coinid: 1,
        coinname: 'Test Coin',
        walletid: 1,
        walletname: 'Test Wallet',
        chainname: 'Test Chain',
        deposit: 100,
        available: 50,
        staked: 25,
        updatedAt: new Date()
      })),
      editAsset: vi.fn().mockReturnValue(of({
        id: 1,
        coinid: 1,
        coinname: 'Test Coin',
        walletid: 1,
        walletname: 'Test Wallet',
        chainname: 'Test Chain',
        deposit: 100,
        available: 50,
        staked: 25,
        updatedAt: new Date()
      }))
    };

    mockCoinsService = {
      getCoins: vi.fn().mockReturnValue(of([{ id: 1, name: 'Test Coin', symbol: 'TST', slug: 'test-coin', price: 100, updatedAt: new Date() }]))
    };

    mockWalletsService = {
      getWallets: vi.fn().mockReturnValue(of([{ id: 1, name: 'Test Wallet', address: '0x123', updatedAt: new Date() }]))
    };

    await TestBed.configureTestingModule({
      imports: [AssetEditPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AssetsService, useValue: mockAssetsService },
        { provide: CoinsService, useValue: mockCoinsService },
        { provide: WalletsService, useValue: mockWalletsService }
      ]
    });

    fixture = TestBed.createComponent(AssetEditPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});