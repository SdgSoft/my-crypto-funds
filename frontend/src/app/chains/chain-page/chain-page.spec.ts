import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChainsService } from '../../services/chains-service';
import { ChainPage } from './chain-page';

describe('ChainEditPage', () => {
  let component: ChainPage;
  let fixture: ComponentFixture<ChainPage>;

  const mockChainsService = {
    getChainById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test Chain' })),
    editChain: vi.fn().mockReturnValue(of({ id: 1, name: 'Updated Chain' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChainPage, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ChainsService, useValue: mockChainsService }]
    });

    fixture = TestBed.createComponent(ChainPage);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
