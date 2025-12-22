import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainNewPage } from './chain-new-page';

describe('ChainNewPage', () => {
  let component: ChainNewPage;
  let fixture: ComponentFixture<ChainNewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChainNewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChainNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
