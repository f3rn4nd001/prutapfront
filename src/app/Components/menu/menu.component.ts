import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginService } from "../../Services/Login/login.service";
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  public datos: any = [];
  public menusub :any = [];
  public menu :any = [];
  public textoEncriptado:any='';

  constructor(
    private _LoginService:LoginService
  ){}

  ngOnInit(): void {
    const map = new Map();
    this.textoEncriptado = localStorage.getItem('Menu');
    //this.datos = JSON.parse(CryptoJS.AES.decrypt(this.textoEncriptado, environment.encPass).toString(CryptoJS.enc.Utf8));   
    
    this.datos = CryptoJS.AES.decrypt(this.textoEncriptado, environment.encPass).toString(CryptoJS.enc.Utf8);   
    
    /*this.datos.menus.forEach((menu: any) => {
      if (!map.has(menu.nombre)) {
        map.set(menu.nombre, true);
        this.menu.push({
          Menu: menu.nombre,
          Iconos: menu.icono
        });
      }
    
      menu.submenus.forEach((submenu: any) => {
        const keySubmenu = submenu.nombre + submenu.url; 
        if (!map.has(keySubmenu)) {
          map.set(keySubmenu, true);
          this.menusub.push({
            submenu: submenu.nombre,
            Menu: menu.nombre,
            url: submenu.url
          });
        }
      });
    });*/

    JSON.parse(this.datos).forEach((element:any) => {
      if(!map.has(element.Menu)){
        map.set(element.Menu, true);    // set any value to Map
        this.menu.push({
          Menu:element.Menu, 
          Iconos:element.Iconos
        });
      }
      if(!map.has(element.submenu )){ 
        map.set(element.submenu, true);    // set any value to Map
        this.menusub.push({
          submenu:element.submenu, 
          Menu:element.Menu,
          url:element.urlSubMenu
        });
      }
    })
  }

  btnLogout() {    
    let data :any = []
    localStorage.removeItem('logintoken');
    localStorage.removeItem('Menu');
    localStorage.removeItem('ecodCorreo');
    localStorage.removeItem('TipoUsuario');
    localStorage.removeItem('ecod');
    this._LoginService.postLogout(data).then((response:any)=>{})
    }

}
