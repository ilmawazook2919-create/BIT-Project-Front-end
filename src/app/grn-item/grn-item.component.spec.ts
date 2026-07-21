import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnItemComponent } from './grn-item.component';

describe('GrnItemComponent', () => {
  let component: GrnItemComponent;
  let fixture: ComponentFixture<GrnItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrnItemComponent]
    });
    fixture = TestBed.createComponent(GrnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
