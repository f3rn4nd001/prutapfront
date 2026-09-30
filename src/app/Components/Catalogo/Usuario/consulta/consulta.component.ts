import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component,ViewChild,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from "ngx-spinner";
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort,Sort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { GenerarService } from '@app/Services/Catalogo/Generar/generar.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { DetallesComponent } from '../detalles/detalles.component';
import  pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';

pdfMake.vfs = pdfFonts.vfs;

interface Column {
  columnDef: string;
  header: string;
  colMovil?: number;
  cell: (element: any) => string;
}

import type { TDocumentDefinitions } from 'pdfmake/interfaces';

interface Usuario {
  ecodUsuario: string;
  tNombre: string;
  tRFC: string;
  tCRUP: string;
  estatus: string;
  fhCreacion:string;
}

@Component({
  selector: 'app-consulta',
  imports: [CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  
  templateUrl: '../../../Plantillas/Consulta/consulta.html',
  styleUrl: './consulta.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConsultaComponent implements OnInit {
  tituloConsulta="";
  dataSource: any = [];
  dataSource2: any = [];
  controller:any[] = [];
  public datos: any = [];
  public graficaA:any=[];
  public graficaB:any=[];
  public getdatos: Usuario[] = [];
  public mostrar = true;
  public filtroForm: any = FormGroup;
  public contenedor: any = {};
  public metodos: any = {eNumeroRegistros:100, tMetodoOrdenamiento:'ecodUsuario', orden:'DESC' };
  public envio: any = {};
  tokencontroll = "";
  public textoEncriptado:any='';
	public filtrodatas:any = [];

  botones=[{nombre:'Registrar',relURL:'/catalogo/usuario/registrar'}];

  MenuDesplegable:any=[
    {nombre:'Ver detalles', relURL:'catalogo/usuario'},
    {nombre:'N/A', relURL:'/catalogo/usuario/registrar'},
    {nombre:'N/A', relURL:'/catalogo/usuario/eliminar'},
  ];

  columns:Column[] = [
    { columnDef: 'E',         header: 'E',   colMovil:1,       cell: (element= this.dataSource.ecodUsuario) => `${element.ecodUsuario}`},
    { columnDef: 'ecodUsuario',  header: 'Folio',   colMovil:1,   cell: (element= this.dataSource.ecodUsuario) => `${element.ecodUsuario}`},
    { columnDef: 'tNombre',   header: 'Nombre',   colMovil:1,  cell: (element= this.dataSource.tNombre) => `${element.tNombre}`},
    { columnDef: 'tRFC',   header: 'RFC',   colMovil:1,  cell: (element= this.dataSource.tRFC) => `${element.tRFC}`},
    { columnDef: 'tCRUP',   header: 'CURP',   colMovil:1,  cell: (element= this.dataSource.tCRUP) => `${element.tCRUP}`},
    { columnDef: 'fhCreacion',   header: 'Fh creacion',   colMovil:1,  cell: (element= this.dataSource.fhCreacion) => `${element.fhCreacion}`},
    { columnDef: 'estatus',   header: 'Estatus',   colMovil:1,  cell: (element= this.dataSource.estatus) => `${element.estatus}`},
  ]

  columns2: Column[] = [
    { columnDef: 'E',         header: 'E',         cell: (element= this.dataSource2.ecodUsuario) => `${element.ecodUsuario}`},
    { columnDef: 'tNombre',   header: 'Nombre',    cell: (element= this.dataSource2.tNombre) => `${element.tNombre}`}, 
  ]
  
  displayedColumns = this.columns.map(c => c.columnDef);
  displayedColumns2 = this.columns2.map(c => c.columnDef);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
 
  constructor(public dialog: MatDialog, private generarService:GenerarService){}

  ngOnInit(): void {
    this.valmenupag();
    
    this.filtroForm = new FormGroup({
      'ecodUsuario': new FormControl('', []),
      'tNombre': new FormControl('', []),
      'tRFC': new FormControl('', []),
      'tCRUP': new FormControl('', []),
      'estatus': new FormControl('', []),
      'fhCreacion':new FormControl('',[]),
      'eNumeroRegistros': new FormControl('', []),
    });
   
    this.filtrodatas = [
      {Nombre : 'Folio',       filtroREl:'filtroForm.value.ecodUsuario',  formControlName:'ecodUsuario', tipos:'text'},  
      {Nombre : 'Nombre',   filtroREl:'filtroForm.value.tNombre',   formControlName:'tNombre',  tipos:'text'},  
      {Nombre : 'RFC',   filtroREl:'filtroForm.value.tRFC',   formControlName:'tRFC',  tipos:'text'},  
      {Nombre : 'CURP',   filtroREl:'filtroForm.value.tCRUP',   formControlName:'tCRUP',  tipos:'text'},  
    ]  
    this.getRegistros();
    this.getcomprementosestatus();
  }

  valmenupag(){
    if (typeof window !== 'undefined' && localStorage) {
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
    }
  }

  
  getcomprementosestatus(){
    this.envio.metodos=this.metodos;
    this.envio.urls="catalogo/estatus/comprementos";
    this.generarService.getRegistrosCompremento(this.envio).then((response:any)=>{     
      this.filtrodatas.push({
        Nombre:'Estatus',
        filtroREl:'filtroForm.value.estatus',
        formControlName:'estatus',
        tipos:'select',
        lista:response
      })  
    });
  }
  exportarAExcel(): void {
    const datos = this.getdatos;
    const encabezado = ['Nombre', 'RFC', 'CURP', 'Estatus', 'Fecha de Creación'];
    const filas = datos.map(usuario => [
      usuario.tNombre || '—',
      usuario.tRFC || '—',
      usuario.tCRUP || '—',
      usuario.estatus || '—',
      usuario.fhCreacion || '—'
    ]);
    const wsData = [encabezado, ...filas];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }

  generarPDF(): void {
    const datos = this.getdatos;
    const body = [
      ['Nombre', 'RFC', 'CURP', 'Estatus', 'Fecha de Creación']  // Encabezados
    ];
    for (const usuario of datos) {
      body.push([
        usuario.tNombre || '',
        usuario.tRFC || '',
        usuario.tCRUP || '',
        usuario.estatus || '',
        usuario.fhCreacion || ''
      ]);
    }
    const docDefinition: TDocumentDefinitions  = {
      content: [
        { text: 'Lista de Usuarios', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: body
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 10, 0]
        }
      }
    };
    pdfMake.createPdf(docDefinition).open(); 
  }

  getRegistros(){
    this.envio.metodos=this.metodos;
    this.envio.urls="catalogo/usuario";
    this.envio.tokencontroll=this.tokencontroll;    
    this.generarService.getRegistros(this.envio).then((response:any)=>{
      this.getdatos = (response);   
      this.dataSource= new MatTableDataSource<Usuario>(this.getdatos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource2= new MatTableDataSource<Usuario>(this.getdatos);
      this.dataSource2.paginator = this.paginator2;
    });
    
  }

  relparams(data:any){localStorage.setItem('ecod', data);}

  getDetalles(data:any){
    this.envio.data=data
    this.envio.urls="catalogo/usuario/detalles";
    this.generarService.getDetalle(this.envio).then((response:any)=>{      
      let dialogRef = this.dialog.open(DetallesComponent, {
        data: {titulo: "Detalle de usuario",Ususario:response.sqlUsusario,gmail:response.sqlCorreo}
      });
    })
  }

  filtro(){
  if (this.filtroForm.value.eNumeroRegistros == null || this.filtroForm.value.eNumeroRegistros == '' ) {this.metodos.eNumeroRegistros = 100}
    else{this.metodos.eNumeroRegistros=this.filtroForm.value.eNumeroRegistros}
    this.envio.metodos=this.metodos;
    this.envio.urls="catalogo/usuario";
    this.envio.filtros=this.filtroForm.value    
    this.generarService.getRegistros(this.envio).then((response:any)=>{
      this.getdatos = (response);    
      this.dataSource= new MatTableDataSource<Usuario>(this.getdatos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource2= new MatTableDataSource<Usuario>(this.getdatos);
      this.dataSource2.paginator = this.paginator2;
    });
  }

  mostrarfiltro(){this.mostrar = !this.mostrar;}


}
