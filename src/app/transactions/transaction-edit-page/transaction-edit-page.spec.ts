import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEditPage } from './transaction-edit-page';

describe('TransactionEditPage', () => {
  let component: TransactionEditPage;
  let fixture: ComponentFixture<TransactionEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
