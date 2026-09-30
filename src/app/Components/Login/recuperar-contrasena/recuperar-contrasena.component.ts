import { ChangeDetectionStrategy, Component, OnInit, Inject,ViewChild,  } from '@angular/core';
import { MatDialogModule,MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoginService } from 'src/app/Services/Login/login.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [
    CommonModule,MatDialogModule,MatPaginatorModule,
    ReactiveFormsModule,FormsModule,MatFormFieldModule,
    MatInputModule,MatButtonModule,
  ],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RecuperarContrasenaComponent {
  public title: string = "";
  public FormLogin: any = FormGroup;
  public envio: any = {};

  constructor(
    public Service:LoginService,
    public dialogRef: MatDialogRef<RecuperarContrasenaComponent>,
    public dialog: MatDialog,   
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.title = this.data.titulo;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  Login(){
    this.envio.email = this.FormLogin.value.email;    
    this.Service.postCorreo(this.envio).then((response:any)=>{
      this.onNoClick();
    });
  }

  ngOnInit(): void {
    this.FormLogin = new FormGroup({
      'email': new FormControl('', [Validators.required,Validators.email]),
    });
  }

 
}
