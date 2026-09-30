import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
  providedIn: 'root'
})
export class SpinerService {

  constructor(
    private spinerService:NgxSpinnerService
  ) { }
  
  llamarspiner(){
    this.spinerService.show();
  }
  detenerspiner(){
    setTimeout(() => {
      this.spinerService.hide();
    }, 100);
  }

}
