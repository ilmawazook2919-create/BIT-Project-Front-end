import { TestBed } from '@angular/core/testing';

import { PurchaseOrderItemService } from './purchase-order-item.service';

describe('PurchaseOrderItemService', () => {
  let service: PurchaseOrderItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrderItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
