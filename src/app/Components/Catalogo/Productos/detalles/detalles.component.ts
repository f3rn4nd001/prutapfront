import { ChangeDetectionStrategy, Component, OnInit, Inject,ViewChild } from '@angular/core';
import {MatDialogModule,MatDialog,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort,MatSortModule,Sort} from '@angular/material/sort';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detalles',
  imports: [CommonModule,MatDialogModule,MatPaginatorModule,MatSortModule,MatTableModule],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetallesComponent {
  public title: string = "";
  public Producto:any;
  
  constructor( 
    public dialogRef: MatDialogRef<DetallesComponent>,   
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.title = this.data.titulo;
    this.Producto =this.data.Producto; 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
