import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Atlas } from './atlas';

describe('Atlas', () => {
  let component: Atlas;
  let fixture: ComponentFixture<Atlas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Atlas],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Atlas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
