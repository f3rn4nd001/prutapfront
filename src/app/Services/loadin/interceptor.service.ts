import { Injectable } from '@angular/core';
import { HttpInterceptor,HttpRequest,HttpHandler,HttpEvent  } from "@angular/common/http";
import { Observable, finalize } from 'rxjs';
import { SpinerService } from './spiner.service';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private SpinnerService:SpinerService
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.SpinnerService.llamarspiner();
    return next.handle(req).pipe(
      finalize(()=> this.SpinnerService.detenerspiner())
    )
  }
}
