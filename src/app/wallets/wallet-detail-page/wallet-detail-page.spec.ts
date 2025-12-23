import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { WalletDetailPage } from './wallet-detail-page';
import { WalletsService } from '../../services/wallets-service';
import { ChainsService } from '../../services/chains-service';

describe('WalletDetailPage', () => {
  let component: WalletDetailPage;
  let fixture: ComponentFixture<WalletDetailPage>;

  const mockWalletsService = {
    getWalletById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test Wallet', adress: '0x123', chainid: 1, chainname: 'Test Chain' }))
  };

  const mockChainsService = {
    getChains: vi.fn().mockReturnValue(of([{ id: 1, name: 'Test Chain' }]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletDetailPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: WalletsService, useValue: mockWalletsService },
        { provide: ChainsService, useValue: mockChainsService }
      ]
    });

    fixture = TestBed.createComponent(WalletDetailPage);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
