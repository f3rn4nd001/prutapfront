import { TestBed } from '@angular/core/testing';

import { ShiftTextService } from './shift-text.service';

describe('ShiftTextService', () => {
  let service: ShiftTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
