import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTransportistaComponent } from './consulta.component';

describe('ConsultaTransportistaComponent', () => {
  let component: ConsultaTransportistaComponent;
  let fixture: ComponentFixture<ConsultaTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaTransportistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
