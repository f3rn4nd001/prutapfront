import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTipoUsuarioComponent } from './select-tipo-usuario.component';

describe('SelectTipoUsuarioComponent', () => {
  let component: SelectTipoUsuarioComponent;
  let fixture: ComponentFixture<SelectTipoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTipoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTipoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
