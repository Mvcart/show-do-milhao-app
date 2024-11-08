import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageQuestionsPage } from './manage-questions.page';

describe('ManageQuestionsPage', () => {
  let component: ManageQuestionsPage;
  let fixture: ComponentFixture<ManageQuestionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
