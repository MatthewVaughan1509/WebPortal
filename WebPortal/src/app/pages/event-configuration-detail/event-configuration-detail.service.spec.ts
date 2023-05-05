import { TestBed } from '@angular/core/testing';

import { EventConfigurationDetailService } from './event-configuration-detail.service';

describe('EventConfigurationDetailService', () => {
  let service: EventConfigurationDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventConfigurationDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
