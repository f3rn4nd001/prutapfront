import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { ShiftTextService } from '@app/Services/cipher/shift-text.service';
import { environment } from '@env/environment';
import { GenerarService } from '@app/Services/Catalogo/Generar/generar.service';
import * as CryptoJS from 'crypto-js';
import { AutoUsuarioComponent } from "@plantillas/Autocomplete/auto-usuario/auto-usuario.component";
import { AlertServerService } from '@app/Services/Alert/alert-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarTransportista',
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatTreeModule,
    MatExpansionModule,
    AutoUsuarioComponent
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrarComponentTransportista {

private cipher= inject(ShiftTextService);
  private generarService = inject(GenerarService);
  private serviceAlert = inject(AlertServerService);
  private router=inject(Router);

  ecod = signal('');
  Nombre=signal('');
  tokencontroll = signal('');
  servicios=signal('');
  sqlUsusario = signal<any>({}); 
  menu = signal<any>([]); 
  submenu = signal<any>([]); 
  control = signal<any>([]); 
  dataSourceRutas = signal<any>([]);
  dataSource: any = [];
  public data:any={};

  public datosRegistrosRutas: any = {};
  public servicesencryp:any='';
  public textoEncriptado:any='';
  public datos: any = {};
  public envio: any = {};
  
 ngOnInit(): void {
    this.valmenupag();
  }

  valmenupag(){
    if (typeof window !== 'undefined' && localStorage) {
      this.servicesencryp = localStorage.getItem('Servicio');
      this.servicios.set(this.cipher.shiftText(this.servicesencryp,-23));
      this.ecod.set(localStorage.getItem('ecod') || '');        
      if (this.ecod()) {this.getRegistro();}
      this.textoEncriptado = localStorage.getItem('Menu');
      this.datos = CryptoJS.AES.decrypt(this.textoEncriptado, environment.encPass).toString(CryptoJS.enc.Utf8);        
      JSON.parse(this.datos).forEach((element:any) => {
        if(window.location.pathname == element.urlController){ 
          this.tokencontroll.set(element.Token);
        }
      });    
    }
  }

  onUsuario(event:any){    
    this.ecod.set(event.ecodUsuario);
    if (event.ecodUsuario) {
      this.getRegistro();
    }
    else{
      this.sqlUsusario.set({});
      this.Nombre.set('');
      this.dataSourceRutas.set([]);
      this.datosRegistrosRutas = {};
    }
  }
  reConsulta(){window.location.href ='catalogo/usuario';}

   async getRegistro(){
    this.envio.data=this.ecod();
    this.envio.urls="catalogo/usuario/detalles";
    try {
      await this.generarService.getDetalle(this.envio).then((response:any)=>{ 
        this.sqlUsusario.set(response.sqlUsusario); 
        this.Nombre.set(response.sqlUsusario.Nombre)
      });
      localStorage.removeItem('ecod');
      this.getRutas();
    } catch (error) {
    console.error("Error al obtener detalles:", error);
    }
  }
  
  async getRutas(){
    this.dataSourceRutas.set([]);
    this.datosRegistrosRutas = {};
    this.menu.set([]);
    this.submenu.set([]);
    this.control.set([]);
    const map = new Map();
    this.envio.urls="sistemas/rutas/detalles";
    try {
      await this.generarService.getRegistros(this.envio).then((response:any)=>{
      this.datosRegistrosRutas=response
        this.datosRegistrosRutas.forEach((element:any,i:any) => {
        if(!map.has(element.ecodMenu)){
          map.set(element.ecodMenu, true);
          this.menu().push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu
          });
        }
        if(!map.has(element.ecodSubmenu)){
          map.set(element.ecodSubmenu, true);
          this.submenu().push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu, 
            ecodSubmenu:element.ecodSubmenu, 
            tNombreSubMenu:element.tNombreSubMenu
          });
        }
        if(!map.has(`${element.ecodSubmenu}-${element.tNombreController}`)){
          map.set(`${element.ecodSubmenu}-${element.tNombreController}`, true);
          this.control().push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu, 
            ecodSubmenu:element.ecodSubmenu, 
            tNombreSubMenu:element.tNombreSubMenu,
            ecodController:element.ecodController,
            tNombreController:element.tNombreController
          });
        }
      })      
      let resultado: any[] = [];
      var contador = 0;
      this.menu().forEach((elementa:any,i:number) => {
        resultado.push({id:elementa.ecodMenu, tNombreMenu:elementa.tNombreMenu, Submenu: [], valor:false,mostrarSubmenu:false,check:false})
        this.submenu().forEach((elementb:any,j:any) => {
          if (elementb.ecodSubmenu != null || elementb.tNombreSubMenu != null) {
            if (elementa.ecodMenu == elementb.ecodMenu) {
              resultado[i]['Submenu'].push({id:elementb.ecodSubmenu,tNombreSubMenu:elementb.tNombreSubMenu,Controlador: [],valor:false,mostrarcontroler:false})
              this.control().forEach((elementc:any) => {
                if (elementa.ecodMenu == elementb.ecodMenu && elementb.ecodMenu == elementc.ecodMenu && elementb.ecodSubmenu == elementc.ecodSubmenu ) {
                  if (elementc.ecodController != null || elementc.tNombreController != null) {
                    resultado[i]['Submenu'][contador]['Controlador'].push({id:elementc.ecodController,tNombreController:elementc.tNombreController,valor:false})
                  }
                }
              })
              contador = contador + 1 
            }
          }
        })
        contador = 0   
      });     
      this.dataSourceRutas.set(resultado);
    });   
    this.getAsignacionPermisos();
    } catch (error) {
    console.error("Error al obtener detalles:", error);
    }
  }

  getAsignacionPermisos(){    
    const map = new Map();
    var menu:any=[]
    var submenu:any=[]
    var control:any=[]
    this.dataSource=[];
    this.envio.data=this.ecod()
    this.envio.urls="sistemas/permisos/detalles";
    this.generarService.getDetalle(this.envio).then((response:any)=>{  
      this.dataSource =response;       
      this.dataSource.forEach((element:any,i:any) => {
        if(!map.has(element.ecodMenu)){
          map.set(element.ecodMenu, true);   
          menu.push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu
          });
        }
        if(!map.has(`${element.ecodMenu}-${element.ecodSubmenu}`)){
          map.set(`${element.ecodMenu}-${element.ecodSubmenu}`, true);   
          submenu.push({
            ecodMenu:element.ecodMenu, 
            tNombreMenu:element.tNombreMenu, 
            ecodSubmenu:element.ecodSubmenu, 
            tNombreSubMenu:element.tNombreSubMenu
          });
        }
        if(!map.has(`${element.ecodSubmenu}-${element.tNombreController}`)){
          map.set(`${element.ecodSubmenu}-${element.tNombreController}`, true);   
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
     
      this.dataSourceRutas().forEach((elementarutasa:any) => {
        menu.forEach((elementa:any,i:number) => {
          if (elementa.ecodMenu==elementarutasa.id) {
            elementarutasa.valor=true
            elementarutasa.Submenu.forEach((elementarutasb:any) => {
              submenu.forEach((elementb:any) => {
                if (elementb.ecodSubmenu != null || elementb.tNombreSubMenu != null) {
                  if (elementa.ecodMenu == elementb.ecodMenu) {
                        
                    if (elementarutasb.id==elementb.ecodSubmenu) {
                      elementarutasb.valor=true
                      elementarutasb.Controlador.forEach((elementarutasc:any) => {
                        control.forEach((elementc:any) => {
                            console.log(elementarutasc.id);
                    
                          if (elementa.ecodMenu == elementb.ecodMenu && elementb.ecodMenu == elementc.ecodMenu && elementb.ecodSubmenu == elementc.ecodSubmenu ) {
                            if (elementc.ecodController != null || elementc.tNombreController != null) {  
                              if (elementarutasc.id == elementc.ecodController) {
                                elementarutasc.valor=true
                              }         
                            }
                          }        
                        })
                      });
                    }
                  }
                }   
              }); 
            });
          }
        })
      });
    })
  }

  mostrarsubmenu(i:number){this.dataSourceRutas()[i].mostrarSubmenu=!this.dataSourceRutas()[i].mostrarSubmenu}

  setAll(completed: boolean,i:number) {       
    this.dataSourceRutas().forEach((elementa:any,a:number) => {
      if (a==i) {
        elementa.valor = completed
        elementa.Submenu.forEach((elementb:any) => {
          elementb.valor = completed
          elementb.Controlador.forEach((elementc:any) => {
            elementc.valor = completed
          })
        })
      }
    })
  }
  
  setanSub(completed: boolean,i:number,j:number) {   
    if (completed == true) {
      this.dataSourceRutas().forEach((elementa:any,a:number) => {
        if (a==i) {
          elementa.valor = true
        }
      })
    }
    if (completed == false) {
      this.dataSourceRutas().forEach((elementa:any,a:number) => {
        if (a==i) {
          elementa.Submenu.forEach((elementb:any,b:number) => {
            if (b==j) {
              elementb.Controlador.forEach((elementc:any) => {
                elementc.valor = false
              })  
            }
          })
        }
      })
    } 
  }
  setanCont(completed:boolean,i:number,j:number,x:number){
    if (completed == true) {
      this.dataSourceRutas().forEach((elementa:any,a:number) => {
        if (a==i) {
          elementa.valor = true
          elementa.Submenu.forEach((elementb:any,b:number) => {
            if (b==j) {
              elementb.valor=true
            }
          })
        }
      })
    }
  }

  setanMenu(completed: boolean,i:any){  
    if (completed == false) {
      this.dataSourceRutas().forEach((elementa:any,a:number) => {
        if (a==i) {
          elementa.valor = false
          elementa.Submenu.forEach((elementb:any) => {
            elementb.valor = false
            elementb.Controlador.forEach((elementc:any) => {
              elementc.valor = false
            })
          })
        }
      })
    }
  }
  


  Guardar(){
    if (this.ecod()) {
      this.serviceAlert.Guardar().then((response:any)=>{
        if (response == 1) {
          let contaa = 0;
          let contab = 0;
          let arrRutas:any = [];
        this.dataSourceRutas().forEach((elementa:any,i:number) => {
            if (elementa.valor===true) {
              if (elementa.Submenu.length > 0) {
                elementa.Submenu.forEach((elementb:any) => {
                  if (elementb.valor===true ) {
                    if (elementb.Controlador.length > 0) {
                      elementb.Controlador.forEach((elementc:any) => {
                        if (elementc.valor==true) {
                          contab=contab+1;
                          contaa=contaa+1;
                          arrRutas.push({
                            ecodController:elementc.id,
                            ecodSubmenu:elementb.id,
                            ecodMenu:elementa.id
                          });
                        }
                      });
                      if(contaa == 0){
                        contab=contab+1
                        arrRutas.push({
                          ecodSubmenu:elementb.id,
                          ecodMenu:elementa.id
                        });
                      }
                      contaa = 0;
                    }
                    else{
                      contab=contab+1
                      arrRutas.push({
                        ecodSubmenu:elementb.id,
                        ecodMenu:elementa.id
                      });
                    }
                  }
                });
                if(contab == 0){
                  arrRutas.push({
                    ecodMenu:elementa.id
                  });
                }
                contab=0;
              }
              else{
                arrRutas.push({
                  ecodMenu:elementa.id
                });
              }
            }
          });
          this.data.Rutas = arrRutas;
          this.data.ecodUsuario = this.ecod();
          this.data.tokencontroll = this.tokencontroll();            
          this.data.urls="sistemas/permisos/registrar";
          this.generarService.postRegistrar(this.data).then((response:any)=>{
            window.location.href = "sistemas/permisos/registrar";
          })
        }
      })
    }
    else{
      this.serviceAlert.ErrorGuardar("Elija un usuario");
      
    }
  }
}
