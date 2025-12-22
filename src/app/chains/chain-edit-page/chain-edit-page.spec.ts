import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainEditPage } from './chain-edit-page';

describe('ChainEditPage', () => {
  let component: ChainEditPage;
  let fixture: ComponentFixture<ChainEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChainEditPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChainEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
