import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component,Output,OnInit, EventEmitter  } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from "src/app/Services/Login/login.service";
@Component({
  selector: 'app-validad-contrasena',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatAutocompleteModule,MatIconModule],
  templateUrl: './validad-contrasena.component.html',
  styleUrl: './validad-contrasena.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidadContrasenaComponent implements OnInit {
  public ContraformGroup: any = FormGroup;
  hide = true;
  public log : any={} 
  public contenedor: any = {};
  private readonly CHAR_RANGE = 126 - 32 + 1; // m
  
  @Output() contraseñaValida = new EventEmitter<boolean>();
  ngOnInit(): void {
    this.ContraformGroup = new FormGroup({'Contrasena': new FormControl('', Validators.required)});
  }
  constructor(
    private service:LoginService
  ){}
  private shiftChar(char: string, shift: number): string {
    const charCode = char.charCodeAt(0);
    const newCharCode = ((charCode - 32 + shift + this.CHAR_RANGE) % this.CHAR_RANGE) + 32;
    return String.fromCharCode(newCharCode);
  }

  shiftText(json: string, shift: number): string {
    return json
      .split('')
      .map((char) => this.shiftChar(char, shift))
      .join('');
  }

  validadContrasena(params:any): void {
    this.log.contrasena = params
    let trasform : any = ''
    trasform = localStorage.getItem('ecodCorreo')
    this.log.ecodCorreo = JSON.stringify(this.shiftText(trasform,-23));
    this.service.postValidadContrasena(this.log).then((response:any)=>{
        this.contraseñaValida.emit(response);
    })   
  }
}
