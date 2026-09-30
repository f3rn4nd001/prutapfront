import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GenerarService } from '@app/Services/Catalogo/Generar/generar.service';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auto-usuario',
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ],
  standalone:true,
  templateUrl: './auto-usuario.component.html',
  styleUrl: './auto-usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoUsuarioComponent {
  @Input() set usuarioPadre(valor: string) {    
   this.ecodctl.setValue(valor)
  }
  title = ''
  @Input() set catTipoUsuarioPadre(valor: string) {    
    this.title = valor
  }

  estatus = ''
  @Input() set estatusPadre(valor: string) {    
    this.estatus = valor
  }

  @Output() usuarioSeleccionado = new EventEmitter<any>();
  public metodos: any = {eNumeroRegistros:7};
  public envio: any = {filtros:{}};
  ecodctl =new FormControl('');
  private generarService = inject(GenerarService);
  
  public statesSubjectT: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filtered: Observable<any[]> =this.statesSubjectT.asObservable();
  
  constructor() {
    this.ecodctl.valueChanges
    .pipe(
      debounceTime(800),
      distinctUntilChanged()     
    )
    .subscribe((value) => {
      this._filterStates(value); 
    });
  }

  display(data: any): string {return data.Nombre ? data.Nombre : data;}

  _filterStates(event: any){
    this.envio = {filtros:{}};
    try {   
      this.envio.metodos= this.metodos;
      this.envio.urls="catalogo/usuario/comprementos";
      this.envio.filtros.tNombre=event
      this.envio.filtros.TipoUsuario = this.title
      this.envio.filtros.estatus = this.estatus
      if (event != '' && typeof event === 'string') {
       this.generarService.getRegistrosCompremento(this.envio).then((response:any)=>{   
          this.statesSubjectT.next(response);  
        })  
      }
    } catch (e) {
      console.error('Error al filtrar', e);
    }
  }
  
  selectsa(){    
   this.usuarioSeleccionado.emit(this.ecodctl.value);
  }

  reset() {
    this.ecodctl.setValue(''); 
    this.statesSubjectT.next([]); 
  }
}
