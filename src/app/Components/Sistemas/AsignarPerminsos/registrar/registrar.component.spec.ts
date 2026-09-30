import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarComponentTransportista } from './registrar.component';

describe('RegistrarComponentTransportista', () => {
  let component: RegistrarComponentTransportista;
  let fixture: ComponentFixture<RegistrarComponentTransportista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarComponentTransportista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarComponentTransportista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
