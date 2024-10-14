import { TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';

describe('HomeComponent Test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent],
    }).compileComponents();
  });
  it('should create the component', () => {
    const fixture = TestBed.createComponent(AdminComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
