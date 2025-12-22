import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletNewPage } from './wallet-new-page';

describe('WalletNewPage', () => {
  let component: WalletNewPage;
  let fixture: ComponentFixture<WalletNewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletNewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
