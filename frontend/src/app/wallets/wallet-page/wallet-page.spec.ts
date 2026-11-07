import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';
import { WalletPage } from './wallet-page';

describe('WalletEditPage', () => {
  let component: WalletPage;
  let fixture: ComponentFixture<WalletPage>;

  const mockWalletsService = {
    getWalletById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test Wallet', adress: '0x123', chainid: 1, chainname: 'Test Chain' })),
    editWallet: vi.fn().mockReturnValue(of({ id: 1, name: 'Updated Wallet' }))
  };

  const mockChainsService = {
    getChains: vi.fn().mockReturnValue(of([{ id: 1, name: 'Test Chain' }]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: WalletsService, useValue: mockWalletsService },
        { provide: ChainsService, useValue: mockChainsService }
      ]
    });

    fixture = TestBed.createComponent(WalletPage);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
