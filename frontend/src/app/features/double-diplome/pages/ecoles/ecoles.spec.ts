import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testProviders } from '../../../../../testing/test-providers';
import { Ecoles } from './ecoles';

describe('Ecoles', () => {
  let component: Ecoles;
  let fixture: ComponentFixture<Ecoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ecoles],
      providers: testProviders,
    }).compileComponents();

    fixture = TestBed.createComponent(Ecoles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
