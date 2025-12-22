import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinDetailPage } from './coin-detail-page';

describe('CoinDetailPage', () => {
  let component: CoinDetailPage;
  let fixture: ComponentFixture<CoinDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoinDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
