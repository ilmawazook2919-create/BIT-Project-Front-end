import { TestBed } from '@angular/core/testing';

import { GrnItemService } from './grn-item.service';

describe('GrnItemService', () => {
  let service: GrnItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
