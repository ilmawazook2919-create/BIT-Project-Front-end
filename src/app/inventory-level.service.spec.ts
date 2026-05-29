import { TestBed } from '@angular/core/testing';

import { InventoryLevelService } from './inventory-level.service';

describe('InventoryLevelService', () => {
  let service: InventoryLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
