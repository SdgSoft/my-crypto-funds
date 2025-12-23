import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChainsService } from '../../services/chains-service';
import { ChainEditPage } from './chain-edit-page';

describe('ChainEditPage', () => {
  let component: ChainEditPage;
  let fixture: ComponentFixture<ChainEditPage>;

  const mockChainsService = {
    getChainById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test Chain' })),
    editChain: vi.fn().mockReturnValue(of({ id: 1, name: 'Updated Chain' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChainEditPage, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ChainsService, useValue: mockChainsService }]
    });

    fixture = TestBed.createComponent(ChainEditPage);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
