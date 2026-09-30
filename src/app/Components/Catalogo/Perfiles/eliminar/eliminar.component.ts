import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { GenerarService } from '@app/Services/Catalogo/Generar/generar.service';
import { AlertServerService } from 'src/app/Services/Alert/alert-server.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-eliminar',
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatInputModule
  ],
  templateUrl: './eliminar.component.html',
  styleUrl: './eliminar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EliminarComponent {
  public textoEncriptado:any='';
  public Menumenu: any =  [];
  public tokencontroll: string  = "";
  public ecod : any=''
  public envio: any = {};
  public validadContras: boolean = true;
  public datos: any = {};
  public FormGroup: any = FormGroup;
  public getsql : any={};
  public data:any={};
  controller:any[] = [];
 
  constructor(
    private _serviceAlert: AlertServerService,
    public router: Router,
    private generarService:GenerarService,
    private cdr: ChangeDetectorRef
  ){}
  
  ngOnInit(): void {
    this.valmenupag();
    this.FormGroup = new FormGroup({
      'mEliminacion':new FormControl(''),
    });
  }

   valmenupag(){
      if (typeof window !== 'undefined' && localStorage) {
        this.ecod = localStorage.getItem('ecod') || '';        
        if (this.ecod) {this.getRegistro();}
        else{this.reConsulta();}
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
  
    reConsulta(){
      window.location.href ='catalogo/perfiles';
    }
    manejarValidacion(esValida: boolean) {
      this.validadContras = esValida;
    }
    getRegistro(){
      this.envio.data=this.ecod
      this.envio.urls="catalogo/perfiles/detalles";
      this.generarService.getDetalle(this.envio).then((response:any)=>{  
        this.getsql=response.sqlPerfiles;
        console.log(response);
        
        this.cdr.detectChanges(); 
      })
      localStorage.removeItem('ecod');
    }

    Guardar(){
      if (this.validadContras != false) {
        let bandera=0;
        if (bandera == 0) {
          this._serviceAlert.Guardar().then((response:any)=>{
            if (response == 1) {
              this.data.formGroup = this.FormGroup.value;
              this.data.ecod = this.ecod;
              this.data.tokencontroll = this.tokencontroll;            
              this.data.urls="catalogo/perfiles/eliminar";
              this.generarService.postRegistrar(this.data).then((response:any)=>{
                setTimeout(() => {
                  window.location.href ='catalogo/perfiles';            
                }, 5000);     
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
