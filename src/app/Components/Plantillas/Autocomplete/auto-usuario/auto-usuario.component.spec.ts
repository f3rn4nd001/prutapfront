import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoUsuarioComponent } from './auto-usuario.component';

describe('AutoUsuarioComponent', () => {
  let component: AutoUsuarioComponent;
  let fixture: ComponentFixture<AutoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
