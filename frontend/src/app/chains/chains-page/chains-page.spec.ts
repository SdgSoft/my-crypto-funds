import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ChainsService } from '../../services/chains-service';
import { ChainsPage } from './chains-page';

describe('ChainsPage', () => {
  let component: ChainsPage;
  let fixture: ComponentFixture<ChainsPage>;
  let mockChainsService: { getChains: () => unknown; deleteChain: (id: unknown) => unknown };

  beforeEach(async () => {
    mockChainsService = {
      getChains: vi.fn().mockReturnValue(of([])),
      deleteChain: vi.fn().mockReturnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [ChainsPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ChainsService, useValue: mockChainsService }
      ]
    });

    fixture = TestBed.createComponent(ChainsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
