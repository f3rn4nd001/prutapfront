import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectEstatusComponent } from '@app/Components/Plantillas/Select/select-estatus/select-estatus.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { GenerarService } from '@app/Services/Catalogo/Generar/generar.service';
import { AlertServerService } from 'src/app/Services/Alert/alert-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetallesComponent } from '../detalles/detalles.component';

interface Datos {
  tNombre: string;
  nPrecio: number;
  ecodEstatus?:string
}

@Component({
  selector: 'app-registrar',
  imports: [
    CommonModule,
    SelectEstatusComponent,
    MatTooltipModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrarComponent {
  public datos: any = [];
  public ecod : string = ''
  public Menumenu: any[] =  [];
  public textoEncriptado:any='';
  public tokencontroll: string  = "";
  public controller:any[] = [];
  public envio: any = {};
  public validadContras: boolean = true;
  public NuevoFormGroup: any = FormGroup;
  public data:any={};
  public enviofiltro: any = {filtros:{}};
  public gatdatos : any = '';

  public statesSubjectTMarca: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredMarca: Observable<any[]> =this.statesSubjectTMarca.asObservable();
  ecodctlMarca =new FormControl();
 
  
  constructor(
    private generarService:GenerarService,
    private _serviceAlert: AlertServerService,
    private dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder
  ){}
  
  ngOnInit(): void {
    this.valmenupag();
    this.NuevoFormGroup = this.fb.group({
      tNombre: this.fb.control('', Validators.required),
      nPrecio: this.fb.control<number | null>(null,[Validators.max(999)]),
      ecodEstatus: this.fb.control('',),
    });
  }
  
  valmenupag(){
    if (typeof window !== 'undefined' && localStorage) {
      this.ecod = localStorage.getItem('ecod') || '';        
      if (this.ecod) {this.getEditarRegistro();}
      this.textoEncriptado = localStorage.getItem('Menu');
        this.datos = CryptoJS.AES.decrypt(this.textoEncriptado, environment.encPass).toString(CryptoJS.enc.Utf8);       
        JSON.parse(this.datos).forEach((element:any) => {
        if(window.location.pathname === element.urlController)
          {
          this.tokencontroll= element.Token
          this.controller.push({
            urlController:element.urlController,
            Nombres:element.Controller
          })
        }
      }); 
    }
  }
    
  getEditarRegistro(){
    this.envio.data=this.ecod
    this.envio.urls="catalogo/productos/detalles";
    this.generarService.getDetalle(this.envio).then((response:any)=>{        
      this.gatdatos = {...response.sqlProducto} as Datos;  
      this.NuevoFormGroup.patchValue({
        tNombre: this.gatdatos.tNombre,
        nPrecio: this.gatdatos.nPrecio,
        ecodEstatus : this.gatdatos.ecodEstatus,
      });
      this.ecodctlMarca.setValue({tNombre: this.gatdatos['Marca'], ecodMarca: this.gatdatos['ecodMarca']});
    });
    localStorage.removeItem('ecod');   
  }

  _filterStatesMarca(event: any){
    this.enviofiltro = {filtros:{}};
    try {   
      this.enviofiltro.metodos= {eNumeroRegistros:5, tMetodoOrdenamiento:'tNombre', orden:'ASC' };
      this.enviofiltro.urls="catalogo/marca/comprementos";
      this.enviofiltro.filtros.tNombre=event
      if (event != '' && typeof event === 'string') {
        this.generarService.getRegistrosCompremento(this.enviofiltro).then((response:any)=>{   
          this.statesSubjectTMarca.next(response);  
        })  
      }
    } catch (e) {
      console.error('Error al filtrar', e);
    }
  }

  

  displayMarca(data: any): string {return data.tNombre ? data.tNombre : data;}
  
  manejarValidacion(esValida: boolean) {
    this.validadContras = esValida;
  }
  
  reConsulta(){
    window.location.href ='catalogo/productos';
  }

  onEstatus($event:any){
    this.NuevoFormGroup.patchValue({
      ecodEstatus: $event.value.ecodEstatus,
    })
  }

  Guardar(){  
    if (this.validadContras != false) {
      let errorsMensaje=[];
      let bandera=0;
      
      if (this.ecodctlMarca.value?.ecodMarca==undefined) {
        errorsMensaje.push("<br>Seleccionar algo en el campo marca");
        this.ecodctlMarca.markAsTouched();
      } 
     
      
      if ((this.NuevoFormGroup.value.tNombre == null) || (this.NuevoFormGroup.value.tNombre == '') ) {
        errorsMensaje.push("<br>Nombre esta vacio");
        this.NuevoFormGroup.get('tNombre').markAsTouched();
      }

      
      if ((this.NuevoFormGroup.value.nPrecio == null) || (this.NuevoFormGroup.value.nPrecio == '') || (this.NuevoFormGroup.value.nPrecio.toString().length > 3)) {
        errorsMensaje.push("<br>error con el precio ");
        this.NuevoFormGroup.get('nPrecio').markAsTouched();
      }

      if(errorsMensaje.length>0){
        errorsMensaje.unshift("Corrija los siguientes campos : ");
        this._serviceAlert.ErrorGuardar(errorsMensaje);
        bandera = 1;
      }
      if (bandera == 0) {
          this._serviceAlert.Guardar().then((response:any)=>{
            if (response == 1) {  
              this.data.Producto = this.NuevoFormGroup.value;
              this.data.Producto.ecodProductos = this.ecod;
              this.data.Producto.Marca = this.ecodctlMarca.value;
              this.data.tokencontroll = this.tokencontroll;              
              this.data.urls="catalogo/productos/registrar";                          
              this.generarService.postRegistrar(this.data).then((response:any)=>{                
                this.envio.data=response
                this.envio.urls="catalogo/productos/detalles";
                this.generarService.getDetalle(this.envio).then((response:any)=>{
                  let dialogRef = this.dialog.open(DetallesComponent, {
                    data: {  titulo: "Detalle de producto",Producto:response.sqlProducto}
                  });  
                  dialogRef.afterClosed().subscribe(result => { 
                    this.router.navigate(['catalogo/productos']);      
                  });
                })            
              }); 
            }
          });
        }
    }
    else{
      this._serviceAlert.ErrorGuardar("Valide su contraseña");
    }
  }
}
