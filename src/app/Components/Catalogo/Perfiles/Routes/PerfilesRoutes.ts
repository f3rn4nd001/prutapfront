import { ModuleWithProviders } from "@angular/core";
import { Routes,RouterModule  } from "@angular/router";

import { canActivateGuard } from "@app/Services/activate/can-activate.guard";
export const PerfilesRouting: Routes = [
    {path:'catalogo/perfiles', loadComponent: () => import('../consulta/consulta.component').then(m => m.ConsultaComponent), canActivate: [canActivateGuard]},
    {path:'catalogo/perfiles/registrar', loadComponent: () => import('../registrar/registrar.component').then(m => m.RegistrarComponent), canActivate: [canActivateGuard]},
    {path:'catalogo/perfiles/eliminar', loadComponent: () => import('../eliminar/eliminar.component').then(m => m.EliminarComponent), canActivate: [canActivateGuard]},
    
];
