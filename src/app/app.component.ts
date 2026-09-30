import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./Components/menu/menu.component";
import { CommonModule } from '@angular/common';
import {BnNgIdleService} from "bn-ng-idle";
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MenuComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = '';
  public logintoken : any = '';
  public Menu : any = '';
  public ecodCorreo : any = '';

  constructor(
    private bnIdle: BnNgIdleService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    this.getToken();
    this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
      this.removeToken();
    });
  }
  }

  getToken(){
    if (typeof window !== 'undefined' && localStorage) {
    this.logintoken = localStorage.getItem('logintoken');
    this.Menu = localStorage.getItem('Menu');
    this.ecodCorreo = localStorage.getItem('ecodCorreo');
    }
  }

  removeToken(){
    if (typeof window !== 'undefined' && localStorage) {
    localStorage.removeItem('logintoken');
    localStorage.removeItem('Menu');
    localStorage.removeItem('ecodCorreo');
    localStorage.removeItem('TipoUsuario');
    localStorage.removeItem('ecod');
    window.location.href = "/login";
    }
  }
}

