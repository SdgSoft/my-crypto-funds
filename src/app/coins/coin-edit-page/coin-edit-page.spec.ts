import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CoinsService } from '../../services/coins-service';
import { CoinEditPage } from './coin-edit-page';

describe('CoinEditPage', () => {
  let component: CoinEditPage;
  let fixture: ComponentFixture<CoinEditPage>;
  let mockCoinsService: { getCoinById: any; editCoin: any };

  beforeEach(async () => {
    mockCoinsService = {
      getCoinById: vi.fn().mockReturnValue(of({ id: '1', name: 'Test Coin', symbol: 'TST', slug: 'test-coin', price: 100, updatedAt: new Date() })),
      editCoin: vi.fn().mockReturnValue(of({ id: '1', name: 'Test Coin', symbol: 'TST', slug: 'test-coin', price: 100, updatedAt: new Date() }))
    };

    await TestBed.configureTestingModule({
      imports: [CoinEditPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CoinsService, useValue: mockCoinsService }
      ]
    });

    fixture = TestBed.createComponent(CoinEditPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
