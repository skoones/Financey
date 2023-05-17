import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBudgetHomeViewComponent } from './single-budget-home-view.component';

describe('SingleBudgetViewComponent', () => {
  let component: SingleBudgetHomeViewComponent;
  let fixture: ComponentFixture<SingleBudgetHomeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBudgetHomeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBudgetHomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
