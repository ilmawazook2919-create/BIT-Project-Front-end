import { TestBed } from '@angular/core/testing';

import { GoodsReceivedNoteService } from './goods-received-note.service';

describe('GoodsReceivedNoteService', () => {
  let service: GoodsReceivedNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsReceivedNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
