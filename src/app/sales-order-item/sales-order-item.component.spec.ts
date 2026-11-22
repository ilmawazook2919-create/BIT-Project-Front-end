import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderItemComponent } from './sales-order-item.component';

describe('SalesOrderItemComponent', () => {
  let component: SalesOrderItemComponent;
  let fixture: ComponentFixture<SalesOrderItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesOrderItemComponent]
    });
    fixture = TestBed.createComponent(SalesOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
