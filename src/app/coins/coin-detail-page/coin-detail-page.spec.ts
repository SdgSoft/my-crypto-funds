import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CoinDetailPage } from './coin-detail-page';
import { CoinsService } from '../../services/coins-service';

describe('CoinDetailPage', () => {
  let component: CoinDetailPage;
  let fixture: ComponentFixture<CoinDetailPage>;
  let mockCoinsService: { getCoinById: any };

  beforeEach(async () => {
    mockCoinsService = {
      getCoinById: vi.fn().mockReturnValue(of({ id: '1', name: 'Test Coin', symbol: 'TST', slug: 'test-coin', price: 100, updatedAt: new Date() }))
    };

    await TestBed.configureTestingModule({
      imports: [CoinDetailPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CoinsService, useValue: mockCoinsService }
      ]
    });

    fixture = TestBed.createComponent(CoinDetailPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
