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
  selector: 'app-select-tipo-usuario',
  imports: [CommonModule,MatDialogModule,MatPaginatorModule,MatSelectModule,MatFormFieldModule,FormsModule,ReactiveFormsModule],
  templateUrl: './select-tipo-usuario.component.html',
  styleUrl: './select-tipo-usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTipoUsuarioComponent implements OnInit {
  @Input() set tipoUsuarioPadre(valor: string) {
    this.datos.ecodTipoUsuario = valor
  }  

  @Output() tipoUsuarioSeleccionado = new EventEmitter<string>();
  public metodos: any = {eNumeroRegistros:10, tMetodoOrdenamiento:'tNombre', orden:'DESC' };
  public envio: any = {filtros:{}};
  public NuevoFormGroup: any = FormGroup;
  public datos: any = {};
  public TipoUsuario:any=[];

  constructor(
    private fb: FormBuilder,
    private generarService: GenerarService
  ) {}

  ngOnInit(): void {
  
    this.NuevoFormGroup = this.fb.group({ecodTipoUsuario: ['',]});
    
    this.envio.metodos=this.metodos;
    this.envio.urls="catalogo/tipousuario/comprementos";
    this.generarService.getRegistrosCompremento(this.envio).then((response:any)=>{
      this.TipoUsuario= response;
      this.NuevoFormGroup.patchValue({
        ecodTipoUsuario: this.datos.ecodTipoUsuario,
      })
    });
  }

  selectsa(){    
    this.tipoUsuarioSeleccionado.emit(this.NuevoFormGroup);
  }
}
