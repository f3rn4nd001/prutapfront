import { ModuleWithProviders } from "@angular/core";
import { Routes,RouterModule  } from "@angular/router";
import { ConsultaComponent } from "../consulta/consulta.component";
import { RegistrarComponent } from "../registrar/registrar.component";
import { canActivateGuard } from "@app/Services/activate/can-activate.guard";
export const UsuarioRouting: Routes = [
    {path:'catalogo/usuario', loadComponent: () => import('../consulta/consulta.component').then(m => m.ConsultaComponent), canActivate: [canActivateGuard]},
    {path:'catalogo/usuario/registrar', loadComponent: () => import('../registrar/registrar.component').then(m => m.RegistrarComponent), canActivate: [canActivateGuard]},
    {path:'catalogo/usuario/eliminar', loadComponent: () => import('../eliminar/eliminar.component').then(m => m.EliminarComponent), canActivate: [canActivateGuard]}
];


