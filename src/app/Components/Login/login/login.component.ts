import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginRoutingModule } from './login-routing.module';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import { LoginService } from "../../../Services/Login/login.service";
import { RecuperarContrasenaComponent } from '../recuperar-contrasena/recuperar-contrasena.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, LoginRoutingModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoginComponent {
  public FormLogin: any = FormGroup;
  public data:any={};
  public textoEncriptado!: string;

  constructor(
    private service:LoginService,
    public router: Router,
    public dialog: MatDialog
  ){

  }
  ngOnInit():void{ 
    this.FormLogin = new FormGroup({
      'email': new FormControl('', [Validators.required,Validators.email]),
      'password': new FormControl('', [Validators.required,Validators.minLength(4)])
    });
  }
  private readonly CHAR_RANGE = 126 - 32 + 1; // m
 
  private shiftChar(char: string, shift: number): string {    
    const charCode = char.charCodeAt(0);
    const newCharCode = ((charCode - 32 + shift + this.CHAR_RANGE) % this.CHAR_RANGE) + 32;
    return String.fromCharCode(newCharCode);
  }

  shiftText(json: string, shift:number): string {   
    return json.split('').map(char => this.shiftChar(char, shift)).join('');
  }

  ModalContrasena(){
    let dialogRef = this.dialog.open(RecuperarContrasenaComponent, {
      data: {  titulo: "Recuperoar contraseña"}
    });  
  }

  Login(){
    this.FormLogin.status="INVALID";
    this.data.email=this.FormLogin.email
    this.data.password = this.FormLogin.password;
    localStorage.removeItem('logintoken');
    localStorage.removeItem('Menu');
    localStorage.removeItem('ecodCorreo');
    localStorage.removeItem('TipoUsuario');
    localStorage.removeItem('ecod');
    this.service.poslogin(this.data).then((response:any)=>{
      if (response.token && response.Menu) {        
        var menu = JSON.stringify(response.Menu)
        this.textoEncriptado = CryptoJS.AES.encrypt(menu, environment.encPass).toString();
        let gdas = '';  
        gdas=this.shiftText(response.ecodCorreo,23)
        let gdas2 = '';  
        gdas2=this.shiftText(response.TipoUsuario,23)
        localStorage.setItem('Menu', this.textoEncriptado);
        localStorage.setItem('logintoken', JSON.stringify(response.token));
        localStorage.setItem('ecodCorreo', (gdas));
        localStorage.setItem('TipoUsuario', (gdas2));
        window.location.href = "/login";
      }
    });
  }
}
