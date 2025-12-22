import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinsPage } from './coins-page';

describe('CoinsPage', () => {
  let component: CoinsPage;
  let fixture: ComponentFixture<CoinsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoinsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
