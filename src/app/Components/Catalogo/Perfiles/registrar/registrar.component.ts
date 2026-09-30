import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { GenerarService } from '@app/Services/Catalogo/Generar/generar.service';
import { AlertServerService } from 'src/app/Services/Alert/alert-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DetallesComponent } from '../detalles/detalles.component';

interface Datos {
  tNombre: string;
}

@Component({
  selector: 'app-registrar',
  imports: [
    CommonModule,
    MatTooltipModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    
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
      this.envio.urls="catalogo/perfiles/detalles";
      this.generarService.getDetalle(this.envio).then((response:any)=>{        
        this.gatdatos = {...response.sqlPerfiles} as Datos;  
        this.NuevoFormGroup.patchValue({
          tNombre: this.gatdatos.tNombre,
        });
      });
      localStorage.removeItem('ecod');   
    }

     manejarValidacion(esValida: boolean) {
        this.validadContras = esValida;
      }
      
      reConsulta(){
        window.location.href ='catalogo/perfiles';
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
          
          if ((this.NuevoFormGroup.value.tNombre == null) || (this.NuevoFormGroup.value.tNombre == '') ) {
            errorsMensaje.push("<br>Nombre esta vacio");
            this.NuevoFormGroup.get('tNombre').markAsTouched();
          }
        
          if(errorsMensaje.length>0){
            errorsMensaje.unshift("Corrija los siguientes campos : ");
            this._serviceAlert.ErrorGuardar(errorsMensaje);
            bandera = 1;
          }
          if (bandera == 0) {
              this._serviceAlert.Guardar().then((response:any)=>{
                if (response == 1) {  
                  this.data.Perfiles = this.NuevoFormGroup.value;
                  this.data.Perfiles.ecodTipoUsuario = this.ecod;
                  this.data.tokencontroll = this.tokencontroll;              
                  this.data.urls="catalogo/perfiles/registrar";                          
                  this.generarService.postRegistrar(this.data).then((response:any)=>{                
                    this.envio.data=response
                    this.envio.urls="catalogo/perfiles/detalles";
                    this.generarService.getDetalle(this.envio).then((response:any)=>{
                      let dialogRef = this.dialog.open(DetallesComponent, {
                        data: {  titulo: "Detalle de perfiles",Perfiles:response.sqlPerfiles}
                      });  
                      dialogRef.afterClosed().subscribe(result => { 
                        this.router.navigate(['catalogo/perfiles']);      
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

