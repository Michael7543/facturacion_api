import {Routes} from '@angular/router';

import {AuthGuard} from "../../../../_guards/auth.guard";

import {EntidadComponent} from "../components/entidad/entidad.component";
import {BancosComponent} from "../components/bancos/bancos.component";
import {ConceptoLiquidacionComponent} from "../components/concepto-liquidacion/concepto-liquidacion.component";
import {CretencionComponent} from "../components/cretencion/cretencion.component";
import { CentroCostosComponent } from '../components/centro-costos/centro-costos.component';
import { EstadoFacturaComponent } from '../components/estado-factura/estado-factura.component';
import { FormaPagoComponent } from '../components/forma-pago/forma-pago.component';
import { ConceptoComponent } from '../components/concepto/concepto.component';


export const RUTA_ENTIDAD: Routes = [

    {
        path: 'entidad',
        component: EntidadComponent,
        canActivate: [AuthGuard],
    },

    {
        path: 'bancos',
        component: BancosComponent,
        canActivate: [AuthGuard],
    },

    {
        path: 'centroCostos',
        component: CentroCostosComponent,
        canActivate: [AuthGuard],
    },

    {
        path: 'conceptoLiquidacion',
        component: ConceptoLiquidacionComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'cretencion',
        component: CretencionComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'estadoFact',
        component: EstadoFacturaComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'formapago',
        component: FormaPagoComponent,
        canActivate: [AuthGuard],
    },
    
    {
        path: 'conceptos',
        component: ConceptoComponent,
        canActivate: [AuthGuard],
    }
 


];
