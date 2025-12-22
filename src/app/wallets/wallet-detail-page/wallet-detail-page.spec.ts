import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletDetailPage } from './wallet-detail-page';

describe('WalletDetailPage', () => {
  let component: WalletDetailPage;
  let fixture: ComponentFixture<WalletDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
