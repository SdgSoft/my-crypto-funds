import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletsPage } from './wallets-page';

describe('WalletsPage', () => {
  let component: WalletsPage;
  let fixture: ComponentFixture<WalletsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WalletsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
