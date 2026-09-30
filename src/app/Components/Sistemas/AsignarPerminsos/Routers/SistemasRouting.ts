import { ModuleWithProviders } from "@angular/core";
import { Routes,RouterModule  } from "@angular/router";
import { RegistrarComponentTransportista } from "../registrar/registrar.component";
import { canActivateGuard } from "@app/Services/activate/can-activate.guard";
export const SistemasRouting: Routes = [
    {path:'sistemas/permisos/registrar', loadComponent: () => import('../registrar/registrar.component').then(m => m.RegistrarComponentTransportista), },

];



