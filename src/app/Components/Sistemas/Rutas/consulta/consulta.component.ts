import { Component, OnInit,Injectable, inject } from '@angular/core';
import { GenerarService } from "@Services/Catalogo/Generar/generar.service";
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/app/environments/environment';
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject} from 'rxjs';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface FoodNode {
  tNombre: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-consultatransportista',
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.css',
})
export class ConsultaTransportistaComponent {
public datos: any = [];
  tokencontroll = "";
  tituloConsulta="";
  controller:any[] = [];
  botones=[{nombre:'Registrar',relURL:'/sistemas/rutas/registrar'}];
  public metodos: any = {tMetodoOrdenamiento:'ecodRelMenuSubmenuController', orden:'DESC' };
  public envio: any = {};
  public textoEncriptado:any='';
  dataSource2: any = [];
   dataSourceControllers: any =[];

  private generarService = inject(GenerarService);
  ngOnInit(): void {
    this.textoEncriptado = localStorage.getItem('Menu');
    this.datos = CryptoJS.AES.decrypt(this.textoEncriptado, environment.encPass).toString(CryptoJS.enc.Utf8);       
    JSON.parse(this.datos).forEach((element:any) => {
      if(window.location.pathname == element.urlSubMenu){ 
        this.tokencontroll= element.Token
        this.tituloConsulta = element.submenu;        
        this.controller.push({
          urlController:element.urlController,
          Nombres:element.Controller
        })
      }
    });
    this.getRegistros();
      
  }

  groupBy(arr:any,exp:any) {
    return arr.reduce((acc:any, i:any) => {
        acc[exp(i)] ? acc[exp(i)].push(i) : acc[exp(i)] = [i];
        return acc;
    }, {});
  }

  getRegistros(){
    const map = new Map();
    var menu:any=[]
    var submenu:any=[]
    var control:any=[]
    var menuw:any={}
    this.envio.metodos=this.metodos;
    this.envio.urls="sistemas/rutas";
    this.envio.tokencontroll=this.tokencontroll;
    this.generarService.getRegistros(this.envio).then((response:any)=>{
      this.dataSource2 = response;      
      this.dataSource2.forEach((element:any,i:any) => {
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
        if(element.tNombreController ){
            
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
      var dataSourceMenu:any=[]
      
      menu.forEach((elementa:any,i:number) => {
         dataSourceMenu.push({'tNombre':elementa.tNombreMenu,children: [],valor:false})
        submenu.forEach((elementb:any,j:any) => {
          if (elementb.ecodSubmenu != null || elementb.tNombreSubMenu != null) {
            if (elementa.ecodMenu == elementb.ecodMenu) {
              dataSourceMenu[i]['children'].push({'tNombre':elementb.tNombreSubMenu,children: [],valor:false})
              control.forEach((elementc:any) => {
                if (elementa.ecodMenu == elementb.ecodMenu && elementb.ecodMenu == elementc.ecodMenu && elementb.ecodSubmenu == elementc.ecodSubmenu ) {
                  if (elementc.ecodController != null || elementc.tNombreController != null) {
                    dataSourceMenu[i]['children'][contador]['children'].push({'tNombre':elementc.tNombreController})
                }
                }
              })
              contador = contador + 1  

            }
          }
        })
        contador = 0   
     });
      this.dataSourceControllers=dataSourceMenu        
    }).catch((error)=>{});
  }
  
  mostrarfiltro(i:any){
    this.dataSourceControllers.forEach((element:any) => {
      element.valor = false
      element['children'].forEach((elementb:any) => {
       elementb.valor  = false
      });
     });

  this.dataSourceControllers[i]['valor']=!this.dataSourceControllers[i]['valor'];
}

  mostrarfiltrob(i:any,b:any){
    this.dataSourceControllers.forEach((element:any) => {
      element['children'].forEach((elementb:any) => {
       elementb.valor  = false
      });
     });
    this.dataSourceControllers[i]['children'][b]['valor']=! this.dataSourceControllers[i]['children'][b]['valor'];
    }
}
