import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletEditPage } from './wallet-edit-page';

describe('WalletEditPage', () => {
  let component: WalletEditPage;
  let fixture: ComponentFixture<WalletEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
