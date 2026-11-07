import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CoinsService } from '../../services/coins-service';
import { CoinPage } from './coin-page';


describe('CoinEditPage', () => {
  let component: CoinPage;
  let fixture: ComponentFixture<CoinPage>;
  let mockCoinsService: { getCoinById: (id: unknown) => unknown; editCoin: (coin: unknown) => unknown };

  beforeEach(async () => {
    mockCoinsService = {
      getCoinById: vi.fn().mockReturnValue(of({ id: '1', name: 'Test Coin', symbol: 'TST', slug: 'test-coin', price: 100, updatedAt: new Date() })),
      editCoin: vi.fn().mockReturnValue(of({ id: '1', name: 'Test Coin', symbol: 'TST', slug: 'test-coin', price: 100, updatedAt: new Date() }))
    };

    await TestBed.configureTestingModule({
      imports: [CoinPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CoinsService, useValue: mockCoinsService }
      ]
    });

    fixture = TestBed.createComponent(CoinPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
