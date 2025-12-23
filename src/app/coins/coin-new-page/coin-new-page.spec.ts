import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CoinsService } from '../../services/coins-service';
import { CoinNewPage } from './coin-new-page';

describe('CoinNewPage', () => {
  let component: CoinNewPage;
  let fixture: ComponentFixture<CoinNewPage>;
  let mockCoinsService: { createCoin: any };

  beforeEach(async () => {
    mockCoinsService = {
      createCoin: vi.fn().mockReturnValue(of({ id: '1', name: 'Test Coin', symbol: 'TST', slug: 'test-coin', price: 100, updatedAt: new Date() }))
    };

    await TestBed.configureTestingModule({
      imports: [CoinNewPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CoinsService, useValue: mockCoinsService }
      ]
    });

    fixture = TestBed.createComponent(CoinNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
