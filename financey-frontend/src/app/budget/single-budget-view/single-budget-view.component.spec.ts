import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBudgetViewComponent } from './single-budget-view.component';

describe('SingleBudgetViewComponent', () => {
  let component: SingleBudgetViewComponent;
  let fixture: ComponentFixture<SingleBudgetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBudgetViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBudgetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
