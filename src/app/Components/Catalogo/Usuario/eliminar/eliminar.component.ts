import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormArray,FormBuilder } from '@angular/forms';
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
    MatInputModule],
  templateUrl: './eliminar.component.html',
  styleUrl: './eliminar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EliminarComponent {
  public textoEncriptado:any='';
  public Menumenu: any =  [];
  public tokencontroll: string  = "";
  public ecodUsuario : any=''
  public envio: any = {};
  public validadContras: boolean = true;
  public datos: any = {};
  public FormGroup: any = FormGroup;
  public sqlUsusario : any={};
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
      'mEliminacion':new FormControl('', Validators.required),
    });
  }
  
  valmenupag(){
    if (typeof window !== 'undefined' && localStorage) {
      this.ecodUsuario = localStorage.getItem('ecod') || '';        
      if (this.ecodUsuario) {this.getRegistro();}
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

  getRegistro(){
    this.envio.data=this.ecodUsuario
    this.envio.urls="catalogo/usuario/detalles";
    this.generarService.getDetalle(this.envio).then((response:any)=>{  
      this.sqlUsusario=response.sqlUsusario;
      this.cdr.detectChanges(); 
    })
    localStorage.removeItem('ecod');
  }

  reConsulta(){
    window.location.href ='catalogo/usuario';
  }
  manejarValidacion(esValida: boolean) {
    this.validadContras = esValida;
  }

  Guardar(){
    if (this.validadContras != false) {
      let bandera=0;
      if (bandera == 0) {
        this._serviceAlert.Guardar().then((response:any)=>{
          if (response == 1) {
            this.data.formGroup = this.FormGroup.value;
            this.data.ecod = this.ecodUsuario;
            this.data.tokencontroll = this.tokencontroll;            
            this.data.urls="catalogo/usuario/eliminar";
            this.generarService.postRegistrar(this.data).then((response:any)=>{
              setTimeout(() => {
                window.location.href ='catalogo/usuario';            
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
