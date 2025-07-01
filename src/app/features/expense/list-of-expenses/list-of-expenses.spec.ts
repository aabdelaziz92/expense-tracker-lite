import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfExpenses } from './list-of-expenses';

describe('ListOfExpenses', () => {
  let component: ListOfExpenses;
  let fixture: ComponentFixture<ListOfExpenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfExpenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfExpenses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
