import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinEditPage } from './coin-edit-page';

describe('CoinEditPage', () => {
  let component: CoinEditPage;
  let fixture: ComponentFixture<CoinEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoinEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
