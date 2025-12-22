import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataForm } from './data-form';
import { Coin } from '../models';

describe('DataForm', () => {
  let component: DataForm<Coin>;
  let fixture: ComponentFixture<DataForm<Coin>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataForm<Coin>);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
