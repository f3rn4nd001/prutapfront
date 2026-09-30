import { CanActivateFn } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { RouterModule, Routes } from '@angular/router';

export const canActivateGuard: CanActivateFn = (route, state) => {
  let Menu : any = [];
  let puerta = 0 ;
  let textoEncriptado:any='';
  textoEncriptado = localStorage.getItem('Menu');    
  Menu = CryptoJS.AES.decrypt(textoEncriptado, environment.encPass).toString(CryptoJS.enc.Utf8);
  if ((localStorage.getItem('logintoken') && (localStorage.getItem('ecodCorreo')) && (localStorage.getItem('Menu'))) ) {
      JSON.parse(Menu).forEach((element:any) => {
        if(element.urlSubMenu ==window.location.pathname || element.urlController == window.location.pathname ){        
            puerta = 1;     
        }
      }); 
  } 
  if (puerta==1) {
    return true;
  }
  else{
    return false;
  }
};
