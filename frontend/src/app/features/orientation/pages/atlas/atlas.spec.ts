import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../../../testing/test-providers';
import { Atlas } from './atlas';

describe('Atlas', () => {
  let component: Atlas;
  let fixture: ComponentFixture<Atlas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Atlas],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(Atlas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
