import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinNewPage } from './coin-new-page';

describe('CoinNewPage', () => {
  let component: CoinNewPage;
  let fixture: ComponentFixture<CoinNewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoinNewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
