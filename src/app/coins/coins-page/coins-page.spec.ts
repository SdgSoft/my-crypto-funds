import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CoinsService } from '../../services/coins-service';
import { CoinsPage } from './coins-page';

describe('CoinsPage', () => {
  let component: CoinsPage;
  let fixture: ComponentFixture<CoinsPage>;
  let mockCoinsService: { getCoins: any; deleteCoin: any };

  beforeEach(async () => {
    mockCoinsService = {
      getCoins: vi.fn().mockReturnValue(of([])),
      deleteCoin: vi.fn().mockReturnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [CoinsPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CoinsService, useValue: mockCoinsService }
      ]
    });

    fixture = TestBed.createComponent(CoinsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
