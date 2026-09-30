import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEstatusComponent } from './select-estatus.component';

describe('SelectEstatusComponent', () => {
  let component: SelectEstatusComponent;
  let fixture: ComponentFixture<SelectEstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectEstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectEstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
