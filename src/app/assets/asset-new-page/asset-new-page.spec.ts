import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CoinsService } from '../../services/coins-service';
import { WalletsService } from '../../services/wallets-service';

import { AssetNewPage } from './asset-new-page';

describe('AssetNewPage', () => {
  let component: AssetNewPage;
  let fixture: ComponentFixture<AssetNewPage>;

  const mockCoinsService = {
    getCoins: vi.fn().mockReturnValue(of([]))
  };

  const mockWalletsService = {
    getWallets: vi.fn().mockReturnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetNewPage],
      providers: [
        { provide: CoinsService, useValue: mockCoinsService },
        { provide: WalletsService, useValue: mockWalletsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
