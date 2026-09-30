import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { GenerarService } from 'src/app/Services/Catalogo/Generar/generar.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select-estatus',
  imports: [CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './select-estatus.component.html',
  styleUrl: './select-estatus.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectEstatusComponent {
  @Input() set estatusPadre(valor: string) {
    this.datos.ecodEstatus = valor
  }  

  @Output() estatusSeleccionado = new EventEmitter<string>();
  public metodos: any = {eNumeroRegistros:10, tMetodoOrdenamiento:'ecodEstatus', orden:'DESC' };
  public envio: any = {filtros:{}};
  public NuevoFormGroup: any = FormGroup;
  public datos: any = {};
  public Estatus:any=[];
  
  constructor(
    private fb: FormBuilder,
    private generarService: GenerarService
  ) {}

  ngOnInit(): void {
  
    this.NuevoFormGroup = this.fb.group({ecodEstatus: ['',]});
    
    this.envio.metodos=this.metodos;
    this.envio.urls="catalogo/estatus/comprementos";
    this.generarService.getRegistrosCompremento(this.envio).then((response:any)=>{
      this.Estatus= response;
      this.NuevoFormGroup.patchValue({
        ecodEstatus: this.datos.ecodEstatus,
      })
    });
  }

  selectsa(){    
    this.estatusSeleccionado.emit(this.NuevoFormGroup);
  }
}

