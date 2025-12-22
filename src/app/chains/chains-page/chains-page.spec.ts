import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainsPage } from './chains-page';

describe('ChainsPage', () => {
  let component: ChainsPage;
  let fixture: ComponentFixture<ChainsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChainsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChainsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
