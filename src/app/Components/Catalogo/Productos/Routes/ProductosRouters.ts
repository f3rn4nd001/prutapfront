import { ModuleWithProviders } from "@angular/core";
import { Routes,RouterModule  } from "@angular/router";

import { canActivateGuard } from "@app/Services/activate/can-activate.guard";
export const ProductosRouting: Routes = [
    {path:'catalogo/productos', loadComponent: () => import('../consulta/consulta.component').then(m => m.ConsultaComponent), canActivate: [canActivateGuard]},
    {path:'catalogo/productos/registrar', loadComponent: () => import('../registrar/registrar.component').then(m => m.RegistrarComponent), canActivate: [canActivateGuard]},
    {path:'catalogo/productos/eliminar', loadComponent: () => import('../eliminar/eliminar.component').then(m => m.EliminarComponent), canActivate: [canActivateGuard]},
    
];
