import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainDetailPage } from './chain-detail-page';

describe('ChainDetailPage', () => {
  let component: ChainDetailPage;
  let fixture: ComponentFixture<ChainDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChainDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChainDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
