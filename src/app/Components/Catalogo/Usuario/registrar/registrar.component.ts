import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormArray,FormBuilder } from '@angular/forms';
import { GenerarService } from '@app/Services/Catalogo/Generar/generar.service';
import { AlertServerService } from 'src/app/Services/Alert/alert-server.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer  } from "@angular/platform-browser";
import { SelectTipoUsuarioComponent } from "../../../Plantillas/Select/select-tipo-usuario/select-tipo-usuario.component";
import {MatTooltipModule} from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import validateRfc from 'validate-rfc';
import { DetallesComponent } from '../detalles/detalles.component';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { SelectEstatusComponent } from '@app/Components/Plantillas/Select/select-estatus/select-estatus.component';

interface DatosUsuario {
  tNombre: string;
  tApellido: string;
  tCRUP?: string;
  tSexo?: string;
  nEdad?: number;
  nLada?:number;
  nTelefono?: number;
  fhNacimiento?: string;
  tRFC?: string;
  iUsuario?: string;
  tNotas?: string;
  ecodUsuario?:string
  ecodEstatus:string
  ecodTipoUsuario:string
}

@Component({
  selector: 'app-registrar',
  imports: [
    CommonModule,
    SelectEstatusComponent,
    SelectTipoUsuarioComponent,
    MatTooltipModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrarComponent {
  @Output() tipoUsuarioSeleccionado = new EventEmitter<number>();
  public datos: any = [];
  public ecodUsuario : string = ''
  public Menumenu: any[] =  [];
  public textoEncriptado:any='';
  public tokencontroll: string  = "";
  public envio: any = {};
  public datosUsuarios : any = '';
  public validadContras: boolean = true;
  public NuevoFormGroup: any = FormGroup;
  public data:any={};
  public Generar: any = FormGroup;
  previaualizacion:string ='';
  public Sexo:any=[{tNombre:"Masculino" },{ tNombre:"Femenino"}];
  controller:any[] = [];

  constructor(
    private generarService:GenerarService,
    private _serviceAlert: AlertServerService,
    private dialog: MatDialog,
    public router: Router,
    public sanitizer:DomSanitizer,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.valmenupag();
    this.NuevoFormGroup = this.fb.group({
      tNombre: this.fb.control('', Validators.required),
      tApellido: this.fb.control('',Validators.required),
      tCRUP: this.fb.control(''),
      tSexo: this.fb.control(''),
      nEdad: this.fb.control(null),
      nLada: this.fb.control(null),
      nTelefono: this.fb.control(null),
      fhNacimiento: this.fb.control(''),
      tRFC: this.fb.control(''),
      iUsuario: this.fb.control(''),
      tNotas: this.fb.control(''),
      ecodUsuario: this.fb.control(''),
      ecodEstatus: this.fb.control('',),
      ecodTipoUsuario: this.fb.control('')
    });
    this.Generar = new FormGroup({'formArray': new FormArray([])});
    this.annadirinputConcepto();   
  }

  valmenupag(){
    if (typeof window !== 'undefined' && localStorage) {
      this.ecodUsuario = localStorage.getItem('ecod') || '';        
      if (this.ecodUsuario) {this.getEditarRegistro();}
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
    this.envio.data=this.ecodUsuario
    this.envio.urls="catalogo/usuario/detalles";
    this.generarService.getDetalle(this.envio).then((response:any)=>{  
      this.datosUsuarios = {...response.sqlUsusario} as DatosUsuario;  
      this.datosUsuarios.mail = (response.sqlCorreo);  
      this.NuevoFormGroup.patchValue({
        tNombre: this.datosUsuarios.tNombre ,
        tApellido:this.datosUsuarios.tApellido,
        tCRUP : this.datosUsuarios.tCRUP,
        tRFC : this.datosUsuarios.tRFC,
        nEdad : this.datosUsuarios.nEdad,
        nTelefono : this.datosUsuarios.nTelefono,
        tSexo : this.datosUsuarios.tSexo,
        iUsuario : this.datosUsuarios.iUsuario,
        tNotas : this.datosUsuarios.tNotas,
        fhNacimiento : this.datosUsuarios.fhNacimiento,
        ecodUsuario : this.datosUsuarios.ecodUsuario,   
        ecodEstatus : this.datosUsuarios.ecodEstatus,
        ecodTipoUsuario : this.datosUsuarios.ecodTipoUsuario,
      });      
      if (this.datosUsuarios.mail.length != 0) {
        this.datosUsuarios.mail.forEach((icarcore:any) => {        
          if(icarcore.tCorreo != null){
            (this.Generar.controls['formArray'] as FormArray).push(new FormGroup({
              'ecodCorreo':new FormControl(icarcore.ecodCorreo),
              'Correo': new FormControl(icarcore.tCorreo),
            }))
          }
        });
        this.eliminarinputConcepto(0);
      }  
      this.datosUsuarios.mail = (response.sqlCorreo);   
      
    });
    localStorage.removeItem('ecod');   
  }
  
  manejarValidacion(esValida: boolean) {
    this.validadContras = esValida;
  }

  onTipoUsuarioSeleccionado($event:any){
    this.NuevoFormGroup.patchValue({
      ecodTipoUsuario: $event.value.ecodTipoUsuario,
    })
  }
  onEstatus($event:any){
    this.NuevoFormGroup.patchValue({
      ecodEstatus: $event.value.ecodEstatus,
    })
  }
  mayusculaRFC() {
    let cadena:any = this.NuevoFormGroup.value.tRFC;
    let mayusculas = cadena.toUpperCase();
    this.NuevoFormGroup.patchValue({tRFC:mayusculas});
	}

  mayusculaCURP() {
    let cadena:any = this.NuevoFormGroup.value.tCRUP;
    let mayusculas = cadena.toUpperCase();
	  this.NuevoFormGroup.patchValue({tCRUP:mayusculas});
	}
  
  digitoVerificadorCURP(curp17:any) {
    var diccionario  = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
      lngSuma      = 0.0,
      lngDigito    = 0.0;
    for(var i=0; i<17; i++)
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
    lngDigito = 10 - lngSuma % 10;
    if (lngDigito == 10) return 0;
    return lngDigito;
  }

  Imagen(event: any) {
    const Archivo = event.target.files[0];
    this.extraerBase64(Archivo).then((imagen:any)=>{
      this.previaualizacion= imagen.base            
    })
  }

  extraerBase64= async($event:any)=> new Promise((resolve, reject)=>{
    try{
      const undafeimg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(undafeimg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload=()=>{
        resolve({base:reader.result});
      };
      reader.onerror=error=>{
        resolve({base:null});
      };
    }catch(e){}
  })

  reConsulta(){
    window.location.href ='catalogo/usuario';
  }
  
  annadirinputConcepto(){
    (this.Generar.controls['formArray']).push(new FormGroup({
      'ecodCorreo': new FormControl(''),
      'Correo': new FormControl('',Validators.email ),
      'Contrasena': new FormControl(''),
    }));
  }

  eliminarinputConcepto(index: number) { 
    if (this.Generar.value.formArray.length == 1) {  
      this._serviceAlert.ErrorGuardar('Debe haber al menos 1 correo');
    }
    else{
      (this.Generar.controls['formArray']).removeAt(index);
    }
  }

  Guardar(){  
    if (this.validadContras != false) {
      let errorsMensaje=[];
      let bandera=0;
      let arrCorreo:any = [];
      if ((this.NuevoFormGroup.value.tNombre == null) || (this.NuevoFormGroup.value.tNombre == '') ) {
        errorsMensaje.push("<br>Nombre esta vacio");
        this.NuevoFormGroup.get('tNombre').markAsTouched();
      }
      if ((this.NuevoFormGroup.value.tApellido == null) || (this.NuevoFormGroup.value.tApellido == '') ) {
        errorsMensaje.push("<br>Apellido esta vacio");
        this.NuevoFormGroup.get('tApellido').markAsTouched();
      }
      if (this.NuevoFormGroup.value.tRFC) {
        const response = validateRfc(this.NuevoFormGroup.value.tRFC);        
        if (response.isValid == false) {errorsMensaje.push("<br>El RFC no es valido");}
        this.NuevoFormGroup.get('tRFC').markAsTouched();
      }
      if (this.NuevoFormGroup.value.tCRUP) {
        var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = this.NuevoFormGroup.value.tCRUP.match(re);
        if (validado) {if (validado[2] != this.digitoVerificadorCURP(validado[1])) {errorsMensaje.push("<br>La CRUP no es valido");}}
        else{
          errorsMensaje.push("<br>La CRUP no es valido");
          this.NuevoFormGroup.get('tCRUP').markAsTouched();
        }
      }  

      this.Generar.value.formArray.forEach((element:any) => {
        if (element.Correo != '' || element.ecodCorreo != '' ) {
          arrCorreo.push({
            tCorreo : element.Correo,
            tContrasena:element.Contrasena,
            ecodCorreo:element.ecodCorreo
          });
        }
      }); 
      
      if(errorsMensaje.length>0){
        errorsMensaje.unshift("Corrija los siguientes campos : ");
        this._serviceAlert.ErrorGuardar(errorsMensaje);
        bandera = 1;
      }
      if (bandera == 0) {
        this._serviceAlert.Guardar().then((response:any)=>{
          if (response == 1) {
            this.data.Usuario = this.NuevoFormGroup.value;
            this.data.Usuario.ecodUsuario = this.ecodUsuario;
            this.data.Usuario.iUsuario=this.previaualizacion;
            this.data.Usuario.arrCorreo = arrCorreo;
            this.data.tokencontroll = this.tokencontroll;              
            this.data.urls="catalogo/usuario/registrar";            
            this.generarService.postRegistrar(this.data).then((response:any)=>{
              this.envio.data=response
              this.envio.urls="catalogo/usuario/detalles";
              this.generarService.getDetalle(this.envio).then((response:any)=>{
                let dialogRef = this.dialog.open(DetallesComponent, {
                  data: {  titulo: "Detalle de usuario",Ususario:response.sqlUsusario,gmail:response.sqlCorreo}
                });  
                dialogRef.afterClosed().subscribe(result => { 
                  this.router.navigate(['catalogo/usuario']);      
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
