import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChainNewPage } from './chain-new-page';
import { ChainsService } from '../../services/chains-service';

describe('ChainNewPage', () => {
  let component: ChainNewPage;
  let fixture: ComponentFixture<ChainNewPage>;

  const mockChainsService = {
    createChain: vi.fn().mockReturnValue(of({ id: 1, name: 'New Chain' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChainNewPage, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ChainsService, useValue: mockChainsService }]
    });

    fixture = TestBed.createComponent(ChainNewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
