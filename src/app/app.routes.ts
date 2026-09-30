import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Login/login/login.component';
import { loginRoutes } from './Components/Login/Routes/loginRoutes';
import { UsuarioRouting } from './Components/Catalogo/Usuario/Routers/UsuarioRouters';
import { ProductosRouting } from './Components/Catalogo/Productos/Routes/ProductosRouters';
import { PerfilesRouting } from './Components/Catalogo/Perfiles/Routes/PerfilesRoutes';
import {SistemasRouting} from './Components/Sistemas/AsignarPerminsos/Routers/SistemasRouting';
export const routes: Routes = [
    ...loginRoutes, ...UsuarioRouting, ...ProductosRouting,...PerfilesRouting,...SistemasRouting
];
