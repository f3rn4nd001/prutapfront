import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import {AlertServerService} from '../Alert/alert-server.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  postRegistrar() {
    throw new Error('Method not implemented.');
  }

  private readonly CHAR_RANGE = 126 - 32 + 1; // m
  constructor(
    private service:AlertServerService
  ) { }

  private shiftChar(char: string, shift: number): string {    
    const charCode = char.charCodeAt(0);
    const newCharCode = ((charCode - 32 + shift + this.CHAR_RANGE) % this.CHAR_RANGE) + 32;
    return String.fromCharCode(newCharCode);
  }

  shiftText(json: string, shift:number): string {   
    return json.split('').map(char => this.shiftChar(char, shift)).join('');
  }
  poslogin(data:any){
   let json=JSON.stringify(data);
    let gdas = '';  
    gdas=this.shiftText(json,23);
  	var api = `${environment.direcurl}api/Login`;	
		return new Promise( ( resolve, reject ) => { 
			axios.post(api,{datos:gdas,haders:"Ox_mSak@t~r}uh_GoerfQly_=EM$4iIYk#v4oFguL)TY2b0~O["})
			.then(response => {        
          this.service.validaderrores(response);
          resolve( JSON.parse(this.shiftText(response.data,-23))
        );   
			}).catch((error) => {
        reject(error);
        if (error.response) {
          this.service.validaderrores(error.response);          
        } else if (error.request) {
          this.service.validaderrores(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
		});
	}
  
  postLogout(data:any){
    var api = `${environment.direcurl}api/Login/postLogout`;	
    let json=JSON.stringify(data);
		return new Promise( ( resolve, reject ) => { 
			axios.post(api,{datos:json,headers:{ 
        token : localStorage.getItem('logintoken'),
        ecodCorreo : localStorage.getItem('ecodCorreo')
      }})
			.then(response => {        
					resolve(response.data);   
			}).catch((error) => {          
        reject(error);
      });
		});
  }
  
  postValidadContrasena(data:any){
    let trasform : any = ''
    trasform = localStorage.getItem('ecodCorreo')
    let jsonHeader=JSON.stringify({token : localStorage.getItem('logintoken'),ecodCorreo : JSON.stringify(this.shiftText(trasform,-23))});
    let Hdas = '';  
    Hdas=this.shiftText(jsonHeader,23);
    let jsondata=JSON.stringify(data);
    let Ddas = '';  
    Ddas=this.shiftText(jsondata,23);
    var api = `${environment.direcurl}api/Login/postValidadContrasena`;	
    let json=JSON.stringify(data);
		return new Promise( ( resolve, reject ) => { 
			axios.post(api,{datos:Ddas,headers:Hdas})
			.then(response => {        
        resolve( JSON.parse(this.shiftText(response.data,-23)));
			}).catch((error) => { 
        this.service.validaderrores(error.response);
        reject(error);
      });
		});
  }
  
  postCorreo(data:any){
    let json=JSON.stringify(data);
    let gdas = '';  
    gdas=this.shiftText(json,23);
    var api = `${environment.direcurl}api/Login/recucontra`;	
		return new Promise( ( resolve, reject ) => { 
			axios.post(api,{datos:gdas,haders:"Ox_mSak@t~r}uh_GoerfQly_=EM$4iIYk#v4oFguL)TY2b0~O["})
			.then(response => {        
          this.service.validaderrores(response);
          resolve( JSON.parse(this.shiftText(response.data,-23))
        );   
			}).catch((error) => {
        reject(error);
        if (error.response) {
          this.service.validaderrores(error.response);          
        } else if (error.request) {
          this.service.validaderrores(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
		});
	}
}
