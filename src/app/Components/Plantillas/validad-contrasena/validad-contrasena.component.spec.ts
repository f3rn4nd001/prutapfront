import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ValidadContrasenaComponent', () => {
  let fixture: ComponentFixture<ValidadContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidadContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidadContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
