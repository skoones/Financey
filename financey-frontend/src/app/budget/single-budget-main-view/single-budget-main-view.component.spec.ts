import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBudgetMainViewComponent } from './single-budget-main-view.component';

describe('SingleBudgetViewComponent', () => {
  let component: SingleBudgetMainViewComponent;
  let fixture: ComponentFixture<SingleBudgetMainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleBudgetMainViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBudgetMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
