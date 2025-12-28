import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionNewPage } from './transaction-new-page';

describe('TransactionNewPage', () => {
  let component: TransactionNewPage;
  let fixture: ComponentFixture<TransactionNewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionNewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
