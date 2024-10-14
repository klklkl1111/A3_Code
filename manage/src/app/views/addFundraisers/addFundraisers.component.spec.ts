import { TestBed } from '@angular/core/testing';
import { AddFundraisersComponent } from './addFundraisers.component';

describe('HomeComponent Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFundraisersComponent],
    }).compileComponents();
  });
  it('should create the component', () => {
    const fixture = TestBed.createComponent(AddFundraisersComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
