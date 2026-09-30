import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { AlertServerService } from '../../Alert/alert-server.service';
import { SpinerService } from "../../loadin/spiner.service";
@Injectable({
  providedIn: 'root'
})
export class GenerarService {
 
  constructor(
    private _service:AlertServerService,
    public _SpinerService:SpinerService
  ) { }

  
  private readonly CHAR_RANGE = 126 - 32 + 1; // m
  
  private shiftChar(char: string, shift: number): string {    
    const charCode = char.charCodeAt(0);
    const newCharCode = ((charCode - 32 + shift + this.CHAR_RANGE) % this.CHAR_RANGE) + 32;
    return String.fromCharCode(newCharCode);
  }

  shiftText(json: string, shift:number): string {   
    return json.split('').map(char => this.shiftChar(char, shift)).join('');
  }

  getRegistros(data:any){   
    let trasform : any = ''
    trasform = localStorage.getItem('ecodCorreo')
    let jsonHeader=JSON.stringify({token : localStorage.getItem('logintoken'),ecodCorreo : JSON.stringify(this.shiftText(trasform,-23))});
    let Hdas = '';  
    Hdas=this.shiftText(jsonHeader,23);
    let jsondata=JSON.stringify(data);
    let Ddas = '';  
    Ddas=this.shiftText(jsondata,23);
    var api = `${environment.direcurl}${data.urls}`;	
    this._SpinerService.llamarspiner();
    var tokencontroll=data.tokencontroll
    let json=JSON.stringify(data);
    return new Promise( ( resolve, reject ) => { 
      axios.post(api,{datos:Ddas,headers:Hdas,tokencontroll})
      .then(response => {        
       resolve( JSON.parse(this.shiftText(response.data,-23)));    
          this._SpinerService.detenerspiner();
          this._service.validaderrores(response);
      }).catch(error => {   
        this._SpinerService.detenerspiner();
        reject(error);
        if (error.response) {
          this._service.validaderrores(error.response);
      
        } else if (error.request) {
          this._service.validaderrores(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
    });
  }

  getRegistrosCompremento(data:any){    
    let trasform : any = ''
    trasform = localStorage.getItem('ecodCorreo')
    let jsonHeader=JSON.stringify({token : localStorage.getItem('logintoken'),ecodCorreo : JSON.stringify(this.shiftText(trasform,-23))});
    let Hdas = '';  
    Hdas=this.shiftText(jsonHeader,23);
    let jsondata=JSON.stringify(data);
    let Ddas = '';  
    Ddas=this.shiftText(jsondata,23);
    var api = `${environment.direcurl}${data.urls}`;	
    var tokencontroll=data.tokencontroll
    return new Promise( ( resolve, reject ) => { 
      axios.post(api,{datos:Ddas,headers:Hdas,tokencontroll})
      .then(response => {        
      resolve( JSON.parse(this.shiftText(response.data,-23)));    
          this._SpinerService.detenerspiner();
      }).catch(error => {   
        reject(error);
        if (error.response) {
          this._service.validaderrores(error.response);
        } else if (error.request) {
          this._service.validaderrores(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
    });
  }
  getDetalle(data:any){
    let trasform : any = ''
    trasform = localStorage.getItem('ecodCorreo')
    let jsonHeader=JSON.stringify({token : localStorage.getItem('logintoken'),ecodCorreo : JSON.stringify(this.shiftText(trasform,-23))});
    let Hdas = '';  
    Hdas=this.shiftText(jsonHeader,23);
    let jsondata=JSON.stringify(data);
    let Ddas = '';  
    Ddas=this.shiftText(jsondata,23);
    var api = `${environment.direcurl}${data.urls}`;	
    this._SpinerService.llamarspiner();
    let json=JSON.stringify(data.data);
		return new Promise( ( resolve, reject ) => { 
			axios.post(api,{datos:Ddas,headers:Hdas})
			.then(response => {    
        this._service.validaderrores(response);
        resolve(JSON.parse(this.shiftText(response.data,-23))
      );    
				  this._SpinerService.detenerspiner();
      }).catch((error) => {          
        this._SpinerService.detenerspiner();
        this._service.validaderrores(environment);
        reject(error);
      });
		});
  }
  
  postRegistrar(data:any){
    let trasform : any = ''
    trasform = localStorage.getItem('ecodCorreo')
    let jsonHeader=JSON.stringify({token : localStorage.getItem('logintoken'),ecodCorreo : JSON.stringify(this.shiftText(trasform,-23))});
   let Hdas = '';  
    Hdas=this.shiftText(jsonHeader,23);
    let jsondata=JSON.stringify(data);
    let Ddas = '';  
    Ddas=this.shiftText(jsondata,23);
    var api = `${environment.direcurl}${data.urls}`;	
    this._SpinerService.llamarspiner();
    var tokencontroll=data.tokencontroll    
    return new Promise( ( resolve, reject ) => { 
      axios.post(api,{datos:Ddas,headers:Hdas,tokencontroll})
      .then(response => {        
          this._SpinerService.detenerspiner();
          resolve( JSON.parse(this.shiftText(response.data,-23)));
          this._service.validaderrores(response);
      }).catch(error => {   
        this._SpinerService.detenerspiner();
        reject(error);
        if (error.response) {
          this._service.validaderrores(error.response);
      
        } else if (error.request) {
          this._service.validaderrores(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
    });
  }
}
