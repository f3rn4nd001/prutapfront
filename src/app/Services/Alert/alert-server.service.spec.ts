import { TestBed } from '@angular/core/testing';

import { AlertServerService } from './alert-server.service';

describe('ErroresServerService', () => {
  let service: AlertServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
