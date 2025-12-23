import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChainsService } from '../../services/chains-service';
import { WalletsService } from '../../services/wallets-service';
import { WalletNewPage } from './wallet-new-page';

describe('WalletNewPage', () => {
  let component: WalletNewPage;
  let fixture: ComponentFixture<WalletNewPage>;

  const mockWalletsService = {
    createWallet: vi.fn().mockReturnValue(of({ id: 1, name: 'New Wallet' }))
  };

  const mockChainsService = {
    getChains: vi.fn().mockReturnValue(of([{ id: 1, name: 'Test Chain' }]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletNewPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: WalletsService, useValue: mockWalletsService },
        { provide: ChainsService, useValue: mockChainsService }
      ]
    });

    fixture = TestBed.createComponent(WalletNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
