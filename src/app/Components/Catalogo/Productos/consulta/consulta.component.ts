import { ChangeDetectionStrategy, Component,ViewChild,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import  pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxSpinnerModule } from 'ngx-spinner';
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

pdfMake.vfs = pdfFonts.vfs;

interface Column {
  columnDef: string;
  header: string;
  colMovil?: number;
  cell: (element: any) => string;
}

interface Producto {
  ecodProductos: string;
  tNombre: string;
  nPrecio: string;
  estatus: string;
  fhCreacion:string;
}

@Component({
  selector: 'app-consulta',
  imports: [
    CommonModule,
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
export class ConsultaComponent {
  tituloConsulta="";
  dataSource: any = [];
  dataSource2: any = [];
  controller:any[] = [];
  public datos: any = [];
  public graficaA:any=[];
  public graficaB:any=[];
  public getdatos: Producto[] = [];
  public mostrar = true;
  public filtroForm: any = FormGroup;
  public contenedor: any = {};
  public metodos: any = {eNumeroRegistros:100, tMetodoOrdenamiento:'ecodProductos', orden:'DESC' };
  public envio: any = {};
  tokencontroll = "";
  public textoEncriptado:any='';
	public filtrodatas:any = [];
  graficoInactivo:any = 0;
  graficoActivo:any=0;
  botones=[{nombre:'Registrar',relURL:'/catalogo/productos/registrar'}];

  MenuDesplegable:any=[
    {nombre:'Ver detalles', relURL:'catalogo/productos'},
    {nombre:'N/A', relURL:'/catalogo/productos/registrar'},
    {nombre:'N/A', relURL:'/catalogo/productos/eliminar'},
  ];

  columns:Column[] = [
    { columnDef: 'E',         header: 'E',   colMovil:1,       cell: (element= this.dataSource.ecodProductos) => `${element.ecodProductos}`},
    { columnDef: 'ecodProductos',  header: 'Folio',   colMovil:1,   cell: (element= this.dataSource.ecodProductos) => `${element.ecodProductos}`},
    { columnDef: 'tNombre',   header: 'Nombre',   colMovil:1,  cell: (element= this.dataSource.tNombre) => `${element.tNombre}`},
    { columnDef: 'nPrecio',   header: 'Precio',   colMovil:1,  cell: (element= this.dataSource.nPrecio) => `${element.nPrecio}`},
    { columnDef: 'fhCreacion',   header: 'Fh creacion',   colMovil:1,  cell: (element= this.dataSource.fhCreacion) => `${element.fhCreacion}`},
    { columnDef: 'estatus',   header: 'Estatus',   colMovil:1,  cell: (element= this.dataSource.estatus) => `${element.estatus}`},
  ]

  columns2: Column[] = [
    { columnDef: 'E',         header: 'E',         cell: (element= this.dataSource2.ecodProductos) => `${element.ecodProductos}`},
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
      'ecodProductos': new FormControl('', []),
      'tNombre': new FormControl('', []),
      'nPrecio': new FormControl('', []),
      'estatus': new FormControl('', []),
      'fhCreacion':new FormControl('',[]),
      'eNumeroRegistros': new FormControl('', []),
    });
   
    this.filtrodatas = [
      {Nombre : 'Folio',       filtroREl:'filtroForm.value.ecodProductos',  formControlName:'ecodProductos', tipos:'text'},  
      {Nombre : 'Nombre',   filtroREl:'filtroForm.value.tNombre',   formControlName:'tNombre',  tipos:'text'},  
      {Nombre : 'Precio',   filtroREl:'filtroForm.value.nPrecio',   formControlName:'nPrecio',  tipos:'number'},  
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
    const encabezado = ['Nombre', 'Precio', 'Estatus', 'Fecha de Creación'];
    const filas = datos.map(Productos => [
      Productos.tNombre || '—',
      Productos.nPrecio || '—',
      Productos.estatus || '—',
      Productos.fhCreacion || '—'
    ]);
    const wsData = [encabezado, ...filas];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'Productos.xlsx');
  }
 generarPDF(): void {
    const datos = this.getdatos;
    const body = [
      ['Nombre', 'Precio', 'Estatus', 'Fecha de Creación']  // Encabezados
    ];
    for (const Producto of datos) {
      body.push([
        Producto.tNombre || '',
        Producto.nPrecio || '',
        Producto.estatus || '',
        Producto.fhCreacion || ''
      ]);
    }
    const docDefinition: TDocumentDefinitions  = {
      content: [
        { text: 'Lista de Productos', style: 'header' },
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
    this.envio.urls="catalogo/productos";
    this.envio.tokencontroll=this.tokencontroll;    
    this.generarService.getRegistros(this.envio).then((response:any)=>{
      this.getdatos = (response);   
      let Inactivo = 0;
      let Activo=0
      this.getdatos.forEach((element:any) => {
        if (element.estatus == 'Activo') {
          Activo ++; 
        }
        if (element.estatus != 'Activo') {
          Inactivo ++; 
        }
      }) 
      let resultpend = 0;
      let resultermin = 0;
      resultpend=(Inactivo / this.getdatos.length)*100;
      this.graficoInactivo=resultpend.toFixed(2);
      resultermin=(Activo / this.getdatos.length)*100;
      this.graficoActivo = resultermin.toFixed(2);
      
      this.graficaA = [
        {vc:this.graficoActivo, color:'#4caf50', inicio :0, title:'Activos'},
        {vc:this.graficoInactivo, color:'#e10404 ', inicio :this.graficoActivo}
      ]
      this.dataSource= new MatTableDataSource<Producto>(this.getdatos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource2= new MatTableDataSource<Producto>(this.getdatos);
      this.dataSource2.paginator = this.paginator2;
    }); 
  }

  relparams(data:any){localStorage.setItem('ecod', data);}

  getDetalles(data:any){
    this.envio.data=data
    this.envio.urls="catalogo/productos/detalles";
    this.generarService.getDetalle(this.envio).then((response:any)=>{      
      let dialogRef = this.dialog.open(DetallesComponent, {
        data: {titulo: "Detalle de producto", Producto:response.sqlProducto}
      });
    })
  }

  filtro(){
  if (this.filtroForm.value.eNumeroRegistros == null || this.filtroForm.value.eNumeroRegistros == '' ) {this.metodos.eNumeroRegistros = 100}
    else{this.metodos.eNumeroRegistros=this.filtroForm.value.eNumeroRegistros}
    this.envio.metodos=this.metodos;
    this.envio.urls="catalogo/productos";
    this.envio.filtros=this.filtroForm.value    
    this.generarService.getRegistros(this.envio).then((response:any)=>{
      this.getdatos = (response);    
      this.dataSource= new MatTableDataSource<Producto>(this.getdatos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource2= new MatTableDataSource<Producto>(this.getdatos);
      this.dataSource2.paginator = this.paginator2;
    });
  }
  
  mostrarfiltro(){this.mostrar = !this.mostrar;}
}

