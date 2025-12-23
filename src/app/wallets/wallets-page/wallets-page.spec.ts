import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { WalletsPage } from './wallets-page';
import { WalletsService } from '../../services/wallets-service';

describe('WalletsPage', () => {
  let component: WalletsPage;
  let fixture: ComponentFixture<WalletsPage>;
  let mockWalletsService: { getWallets: any; deleteWallet: any };

  beforeEach(async () => {
    mockWalletsService = {
      getWallets: vi.fn().mockReturnValue(of([])),
      deleteWallet: vi.fn().mockReturnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [WalletsPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: WalletsService, useValue: mockWalletsService }
      ]
    });

    fixture = TestBed.createComponent(WalletsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
