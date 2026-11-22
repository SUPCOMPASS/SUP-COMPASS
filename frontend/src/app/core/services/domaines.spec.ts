import { TestBed } from '@angular/core/testing';
import { Domaines } from './domaines';

describe('Domaines', () => {
  let service: Domaines;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Domaines);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
