import { TestBed } from '@angular/core/testing';

import { EventHandlingService } from './event-handling.service';

describe('EventHandlingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventHandlingService = TestBed.get(EventHandlingService);
    expect(service).toBeTruthy();
  });
});
