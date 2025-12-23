import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChainDetailPage } from './chain-detail-page';
import { ChainsService } from '../../services/chains-service';

describe('ChainDetailPage', () => {
  let component: ChainDetailPage;
  let fixture: ComponentFixture<ChainDetailPage>;

  const mockChainsService = {
    getChainById: vi.fn().mockReturnValue(of({ id: 1, name: 'Test Chain' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChainDetailPage, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: ChainsService, useValue: mockChainsService }]
    });

    fixture = TestBed.createComponent(ChainDetailPage);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
