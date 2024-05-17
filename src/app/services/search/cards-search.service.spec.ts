import { TestBed } from '@angular/core/testing';

import { CardsSearchService } from './cards-search.service';

describe('CardsSearchService', () => {
  let service: CardsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
