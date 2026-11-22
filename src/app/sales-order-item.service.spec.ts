import { TestBed } from '@angular/core/testing';

import { SalesOrderItemService } from './sales-order-item.service';

describe('SalesOrderItemService', () => {
  let service: SalesOrderItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesOrderItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
