import { TestBed } from '@angular/core/testing';

import { PageDetailsService } from './page-details.service';

describe('PageDetailsService', () => {
  let service: PageDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
