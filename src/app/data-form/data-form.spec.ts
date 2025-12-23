import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataForm } from './data-form';
import { Coin } from '../models';

describe('DataForm', () => {
  let component: DataForm<Coin>;
  let fixture: ComponentFixture<DataForm<Coin>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataForm]
    });

    fixture = TestBed.createComponent(DataForm<Coin>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('initialData', { id: '1', name: 'Test', symbol: 'TST', slug: 'test', price: 100, updatedAt: new Date() });
    fixture.componentRef.setInput('config', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
