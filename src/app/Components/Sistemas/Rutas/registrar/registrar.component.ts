import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AlertServerService } from 'src/app/Services/Alert/alert-server.service';
import { GenerarService } from 'src/app/Services/Catalogo/Generar/generar.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/app/environments/environment';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registrarTransportista',
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css'
})
export class RegistrarTransportistaComponent {
public ecodRelMenuSubmenuController : any=''
  public Generar: any = FormGroup;
  public datosRegistros: any = {};
  public Menumenu: any =  [];
  public textoEncriptado:any='';  
  tokencontroll = "";
 
  ecodctlMenu:any = new FormControl('',[]);
  ecodctlSubMenu:any = new FormControl('',[]);
  ecodctlControllers:any = new FormControl('',[]);
  public filteredStatesSubMenu : Observable<any[]> | undefined;
  public filteredStatesControllers : Observable<any[]> | undefined;
  public filteredStatesMenu : Observable<any[]> | undefined;
  public envio: any = {filtros:{}};
  public data:any={};

  constructor(
    private _serviceAlert: AlertServerService,
    private _GenerarService:GenerarService,
  ){}
  private readonly CHAR_RANGE = 126 - 32 + 1; 
  
  private shiftChar(char: string, shift: number): string {    
    const charCode = char.charCodeAt(0);
    const newCharCode = ((charCode - 32 + shift + this.CHAR_RANGE) % this.CHAR_RANGE) + 32;
    return String.fromCharCode(newCharCode);
  }
  
  shiftText(json: string, shift:number): string {   
    return json.split('').map(char => this.shiftChar(char, shift)).join('');
  }

  ngOnInit(): void {
    this.Generar = new FormGroup({'formArray': new FormArray([])});
    this.textoEncriptado = localStorage.getItem('Menu');
    this.Menumenu = CryptoJS.AES.decrypt(this.textoEncriptado, environment.encPass).toString(CryptoJS.enc.Utf8);       
    JSON.parse(this.Menumenu).forEach((element:any) => {
      if(window.location.pathname === element.urlController){ 
        this.tokencontroll= element.Token  
      }
    });
    this.getRegistros(); 
   
  }

  anadirArrformArray(){
    (this.Generar.controls['formArray']).push(new FormGroup({
      'ecodMenu': new FormControl(''),
      'Submenu': new FormArray([]),
      'mostrarSubmenu':new FormControl(false),
    }));
  }
  
  eliminarArrformArray(index: number) {  
    if (this.Generar.value.formArray.length == 1) {  
      this._serviceAlert.ErrorGuardar('Debe haber 1 concepto al menos');
    }
    else{
      (this.Generar.controls['formArray']).removeAt(index);
    }
  }

  eliminarArrSubmenu(i: number,j:number) {  
    this.Generar.controls['formArray'].controls[i].controls['Submenu'].removeAt(j);
  }
  eliminarArrControlador(i:number,j:number,x:number){
    this.Generar.controls['formArray'].controls[i].controls['Submenu'].controls[j].controls['Controlador'].removeAt(x);

  }
  mostrarSubmenu(i:any){
    this.Generar.value.formArray[i].mostrarSubmenu=!this.Generar.value.formArray[i].mostrarSubmenu   
  }
  
  mostrarControlador(i:any, j:any){
    this.Generar.controls['formArray'].controls[i].controls['Submenu'].controls[j].value.mostrarControlador=!this.Generar.controls['formArray'].controls[i].controls['Submenu'].controls[j].value.mostrarControlador;    
  }

  addSubmenuArr(i:any){    
    (this.Generar.controls['formArray'].controls[i].controls['Submenu'].controls).push(new FormGroup({
      'ecodSubmenu': new FormControl(''),
      'Controlador': new FormArray([]),
      'mostrarControlador':new FormControl(false),
    }))  
  }

  addControladorArr(i:any,j:any){  
    (this.Generar.controls['formArray'].controls[i].controls['Submenu'].controls[j].controls['Controlador'].controls).push(new FormGroup({
      'ecodController': new FormControl(''),
    }))    
  }
  
  getRegistros(){
    const map = new Map();
    this.envio.urls="sistemas/rutas";
    this.envio.tokencontroll=this.tokencontroll;
    this._GenerarService.getRegistros(this.envio).then((response:any)=>{
      
      this.datosRegistros=response
      var menu:any=[]
      var submenu:any=[]
      var control:any=[]
      
      this.datosRegistros.forEach((element:any,i:any) => {
        if(!map.has(element.ecodMenu)){
          map.set(element.ecodMenu, true);    
          menu.push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu
          });
        }
        if(!map.has(element.ecodSubmenu)){
          map.set(element.ecodSubmenu, true);   
          submenu.push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu, 
            ecodSubmenu:element.ecodSubmenu, 
            tNombreSubMenu:element.tNombreSubMenu
          });
        }
        if(element.tNombreController){
          control.push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu, 
            ecodSubmenu:element.ecodSubmenu, 
            tNombreSubMenu:element.tNombreSubMenu,
            ecodController:element.ecodController,
            tNombreController:element.tNombreController
          });
        }
      })
      var contador = 0;
      menu.forEach((elementa:any,i:number) => {
        (this.Generar.controls['formArray']).push(new FormGroup({
          'ecodMenu': new FormControl({'ecodMenu': elementa.ecodMenu,'tNombre':elementa.tNombreMenu}),
          'Submenu': new FormArray([]),
          'mostrarSubmenu':new FormControl(false),
        }));
        submenu.forEach((elementb:any,) => {
          if (elementb.ecodSubmenu != null || elementb.tNombreSubMenu != null) {
            if (elementa.ecodMenu == elementb.ecodMenu) {
              (this.Generar.controls['formArray'].controls[i].controls['Submenu'].controls).push(new FormGroup({
                'ecodSubmenu': new FormControl({'ecodSubmenu': elementb.ecodSubmenu,'tNombre':elementb.tNombreSubMenu}),
                'Controlador': new FormArray([]),
                'mostrarControlador':new FormControl(false),
              })) 
              control.forEach((elementc:any) => {
                if (elementa.ecodMenu == elementb.ecodMenu && elementb.ecodMenu == elementc.ecodMenu && elementb.ecodSubmenu == elementc.ecodSubmenu ) {
                  if (elementc.ecodController != null || elementc.tNombreController != null) {
                     (this.Generar.controls['formArray'].controls[i].controls['Submenu'].controls[contador].controls['Controlador'].controls).push(new FormGroup({
                      'ecodController': new FormControl({'ecodControler': elementc.ecodController,'tNombre':elementc.tNombreController}),
                    })) 
                  }
                }
              }) 
              contador = contador + 1
            }
          }
        });
        contador = 0            
      });
    }).catch((error)=>{});
  }
  
 
  reConsulta(){
    window.location.href ='sistemas/rutas';
  }

  Guardar(){
      let errorsMensaje:any=[];
      let bandera=0;
      let arrRutas:any = [];
      (this.Generar).controls['formArray'].controls.forEach((forma:any, i: number) => {
        if (forma.controls['Submenu'].controls.length > 0) {
          forma.controls['Submenu'].controls.forEach((formb:any, j: number) => {
            if (formb.controls['Controlador'].controls.length > 0) {
              formb.controls['Controlador'].controls.forEach((formc:any, x: number) => {
                if ((formc.get('ecodController').value.ecodControler && formb.get('ecodSubmenu').value.ecodSubmenu) && forma.get('ecodMenu').value.ecodMenu) {
                  arrRutas.push({
                    ecodController : formc.get('ecodController').value.ecodControler,
                    ecodSubmenu:formb.get('ecodSubmenu').value.ecodSubmenu,
                    ecodMenu:forma.get('ecodMenu').value.ecodMenu
                  });
                }
                else{
                  if (!formc.get('ecodController').value.ecodControler) {
                    errorsMensaje.push(`No puede dejar el campos Controlador vacio ${i} ${j} ${x} <br/>`);
                  }
                  if (!formb.get('ecodSubmenu').value.ecodSubmenu) {
                    errorsMensaje.push(`No puede dejar el campo Sub menu vacio ${i} ${j}  <br/>`);
                  }if (!  forma.get('ecodMenu').value.ecodMenu) {
                    errorsMensaje.push(`No puede dejar el campos Menu vacio ${i} <br/>`);
                  }
                }
              })
            }
            else{
              if (formb.get('ecodSubmenu').value.ecodSubmenu && forma.get('ecodMenu').value.ecodMenu) {
                arrRutas.push({
                  ecodSubmenu:formb.get('ecodSubmenu').value.ecodSubmenu,
                  ecodMenu:forma.get('ecodMenu').value.ecodMenu
                });
              }
              else{
                if (!formb.get('ecodSubmenu').value.ecodSubmenu) {
                  errorsMensaje.push(`No puede dejar el campo Sub menu vacio ${i} ${j}  <br/>`);
                }if (!forma.get('ecodMenu').value.ecodMenu) {
                  errorsMensaje.push(`No puede dejar el campos Menu vacio ${i} <br/>`);
                }
              }
            }
          })
        }
        else{
          if (forma.get('ecodMenu').value.ecodMenu) {
            arrRutas.push({
              ecodMenu:forma.get('ecodMenu').value.ecodMenu
            });
          }
          else{
            if (!forma.get('ecodMenu').value.ecodMenu) {
              errorsMensaje.push(`No puede dejar el campos Menu vacio de la pocicion ${i} <br/>` );
            }
          }
        }
      })
      if(errorsMensaje.length>0){
        this._serviceAlert.ErrorGuardar(errorsMensaje);
        bandera = 1;
      }      
      if (bandera == 0) {
        this._serviceAlert.Guardar().then((response:any)=>{
          if (response == 1) {
            this.data.rutas = arrRutas;
            this.data.tokencontroll = this.tokencontroll;            
            this.data.urls="sistemas/rutas/registrar";
            this._GenerarService.postRegistrar(this.data).then((response:any)=>{
             this.reConsulta();      
            })
          
          }
        })
      }
    
  }


  displayStatesMenu(data: any): string {return data.tNombre ? data.tNombre : data;}
  displayStatesSubMenu(data: any): string {return data.tNombre ? data.tNombre : data;}
  displayStatesControllers(data: any): string {return data.tNombre ? data.tNombre : data;}

  filtrarMenu(event:any,i:any){
    try {   
      if (event != '' && typeof event === 'string') {
        this.envio.urls="catalogo/menu/comprementos";
        this.envio.filtros.tNombre=event
        this._GenerarService.getRegistrosCompremento(this.envio).then((response:any)=>{           
          this.filteredStatesMenu = this.ecodctlMenu.valueChanges.pipe(startWith(''),map((state: any) => state ? () => { } : response));
        })
      }                 
    } 
    catch (e) {
      console.error('Error al filtrar', e);
    }
  }
 
  filtrarSubMenu(event:any,i:any){
    try {   
      if (event != '' && typeof event === 'string') {
        this.envio.urls="catalogo/submenu/comprementos";
        this.envio.filtros.tNombre=event
        this._GenerarService.getRegistrosCompremento(this.envio).then((response:any)=>{ 
          this.filteredStatesSubMenu = this.ecodctlSubMenu.valueChanges.pipe(startWith(''),map((state: any) => state ? () => { } : response));
        })
      }                 
    } catch (e) {
      console.error('Error al filtrar', e);
    }
  }

  filtrarControllers(event:any,i:any){
    try {   
      if (event != '' && typeof event === 'string') {
        this.envio.urls="catalogo/controllers/comprementos";
        this.envio.filtros.tNombre=event
        this._GenerarService.getRegistrosCompremento(this.envio).then((response:any)=>{ 
        this.filteredStatesControllers = this.ecodctlControllers.valueChanges.pipe(startWith(''),map((state: any) => state ? () => { } : response));
        })
      }                 
    } 
    catch (e) {
      console.error('Error al filtrar', e);
    }
  }
}
