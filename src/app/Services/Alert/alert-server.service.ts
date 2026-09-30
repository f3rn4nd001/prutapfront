import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AlertServerService {

  
  private readonly CHAR_RANGE = 126 - 32 + 1;
  private alertify: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      import('alertifyjs').then(mod => {
        this.alertify = mod.default;
      });
    }
  }

  private shiftChar(char: string, shift: number): string {    
    const charCode = char.charCodeAt(0);
    const newCharCode = ((charCode - 32 + shift + this.CHAR_RANGE) % this.CHAR_RANGE) + 32;
    return String.fromCharCode(newCharCode);
  }

  shiftText(json: string, shift:number): string {   
    return json.split('').map(char => this.shiftChar(char, shift)).join('');
  }

  validaderrores(value:any){
    if (!this.alertify) return;

    if(value.status==500){
      this.alertify.alert().setting({
        'closable':false,
        'resizable':false,
        'title':`Error desde la parte del servidor.` ,
        'message':"Hay un problema en el servidor. "
      }).show();
    }

    if(value.status==0){
      this.alertify.alert().setting({
        'closable':false,
        'resizable':false,
        'title':`Error del servidor.` ,
        'message':`No se pudo encontrar el servidor. <br>Notifique a su proveedor y regrese luego de dar un largo paseo `
      }).show();
    }

    if(value.status==404){
      this.alertify.alert().setting({
        'closable':false,
        'resizable':false,
        'title':`Error 404 del servidor.` ,
        'message':`NO se pudo encontrar el servidor. <br>No se pudo encontrar la url deceada`
      }).show();
    }

    if (value.status==200) {
      this.alertify.set('notifier','position', 'top-right');
      this.alertify.success("Todo se ha procesado de forma correcta")
    }
    if (value.status==202) {
      const mensaje =JSON.parse(this.shiftText(value.data,-23));
      this.alertify.set('notifier','position', 'top-center');
      this.alertify.warning("" + mensaje.mensaje,8 )
    }
    if(value.status==400){
      this.alertify.alert().setting({
        'closable':false,
        'resizable':false,
        'title':`Algo ha ido mal con la petición.` ,
        'message':" Si recibes este error, prueba a refrescar la página o actualizar tu navegador."
      }).show();
    }
    
    if(value.status==401){
      const mensaje =JSON.parse(this.shiftText(value.data,-23));
      this.alertify.set('notifier','position', 'top-center');
      this.alertify.error('Algo ha ido mal con la petición : ' +mensaje.mensaje );
      if (mensaje.mensaje == "Token invalido, Inicie sesion nuevamente" || mensaje.mensaje == "Usuario invalido, Inicie sesion nuevamente" || mensaje.mensaje == "Usuario invalido, No cuenta con los permisos") {
        setTimeout(function(){       
        localStorage.removeItem('logintoken');
        localStorage.removeItem('Menu');
        localStorage.removeItem('ecodCorreo');
        localStorage.removeItem('TipoUsuario');
        localStorage.removeItem('ecod');
        window.location.href = "/login";
        }, 2000);
      }
     
      }
    if (value.status==422) {
      this.alertify.error("No pudo procesar las instrucciones contenidas")
    }
    if(value.status==503){
      this.alertify.alert().setting({
        'closable':false,
        'resizable':false,
        'title':`El servidor no está disponible en ese momento.` ,
        'message':"Prueba de nuevo en unos minutos."
      }).show();
    }
    if (value.status==429) {
      this.alertify.error("Intentelo nuevmente en un minuto");
    }
    
  }
  ErrorGuardar(value:any){
    this.alertify.alert().setting({
      'closable':false,
      'resizable':false,
      'title':`Por favor corriga los siguientes errores.` ,
      'message':`${value}`
    }).show();
  }
  
  async Guardar(){
     return await new Promise( ( resolve, reject ) => { 
      this.alertify.confirm("Guardar","¿Deseas guardar la información?",
        () => resolve(1),
        () => resolve(0)
      );
    });
  }
}
