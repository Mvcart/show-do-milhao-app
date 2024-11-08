import { TestBed } from '@angular/core/testing';

import { ManageQuestionsService } from './manage.questions.service';

describe('ManageQuestionsService', () => {
  let service: ManageQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
