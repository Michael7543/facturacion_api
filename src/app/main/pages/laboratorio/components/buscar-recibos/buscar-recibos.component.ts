import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResponseGenerico } from 'src/app/_dto/response-generico';
import { TokenDto } from 'src/app/_dto/token-dto';
import { TokenService } from 'src/app/_service/token.service';
import { BreadcrumbService } from 'src/app/_service/utils/app.breadcrumb.service';
import { FormUtil } from '../../formUtil/FormUtil';
import { ReciboCaja } from '../../model/reciboCaja';

@Component({
    selector: 'app-buscar-recibos',
    templateUrl: './buscar-recibos.component.html',
    styleUrls: ['./buscar-recibos.component.scss'],
})
export class BuscarRecibosComponent implements OnInit {
    @Input() reciboCaja: ReciboCaja; //Va reciboDTo
    @Output() reciboCajaFiltrados = new EventEmitter();
    //reciboCajaFiltrados: ReciboCaja; //va ReciboDto

    proceso: string = 'anular recibos caja';
    response: ResponseGenerico;
    token: TokenDto;
    buscarForm: FormGroup;
    formUtil: FormUtil;

    constructor(
        private breadcrumbService: BreadcrumbService,
        private formBuilder: FormBuilder,
        private tokenService: TokenService
    ) {
        {
            this.breadcrumbService.setItems([{ label: 'Anular Recibo Caja' }]);
        }
    }

    ngOnInit() {
        this.iniciarForms();
        this.formUtil = new FormUtil(this.buscarForm);
    }

    get f() {
        return this.buscarForm.controls;
    }

    iniciarForms() {
        this.buscarForm = this.formBuilder.group({
            //idEstadoComprobante: [null],
            NroReciboCaja: ['', [Validators.pattern(/^\d{3}-\d{3}-\d{5}$/)]],
            NombreCliente: ['', Validators.pattern('^[a-zA-ZÀ-ÿ ]*$')],
            Ruc: ['', [Validators.pattern('^[0-9]{1,13}$')]],
            Cedula: ['', [Validators.pattern('^[0-9]{1,10}$')]],
            fechaDesde: [''],
            fechaHasta: [''],
            //estadoCompr: [true, Validators.requiredTrue],
        });
        this.token = JSON.parse(this.tokenService.getResponseAuth());
        //this.f.idUsuarioEstComprob.setValue(this.token.id)
    }

    obtenerdaData() {}

    //! Necesito poner Dto = doc:ReciboCajaDto
    Buscar(doc) {
        const fechaDesde = this.buscarForm.value.fechaDesde;
        const fechaHasta = this.buscarForm.value.fechaDesde;
        console.log('filtrando info: ' + fechaDesde);
        console.log('filtrando info  hasta: ' + fechaHasta);

        /*  this.reciboCaja = this.reciboCaja.filter((recibo) => {
            const fechaRecibo = new Date(recibo.fecha);
            return fechaRecibo >= fechaDesde && fechaRecibo <= fechaHasta;
        }); */
        this.reciboCajaFiltrados.emit(doc);
    }

    onInputNroRecibo(event: any) {
        const input = event.target;
        const value = input.value.replace(/[^0-9]/g, '');

        const groups = [
            value.slice(0, 3),
            value.slice(3, 6),
            value.slice(6, 11),
        ].filter(Boolean);
        const formattedValue = groups.join('-');

        input.value = formattedValue;
        this.f.NroReciboCaja.setValue(formattedValue);

        const cursorPosition = input.selectionStart;
        input.setSelectionRange(cursorPosition, cursorPosition);
    }

    preventNumbers(event: KeyboardEvent) {
        this.formUtil.preventNumbers(event);
    }

    maxLengthNombre(event: Event) {
        this.formUtil.limitInputLength(event, 30, 'NombreCliente');
    }
    maxLengthCedula(event: Event) {
        this.formUtil.limitInputLength(event, 10, 'Cedula');
    }

    maxiLengthRuc(event: Event) {
        this.formUtil.limitInputLength(event, 13, 'Ruc');
    }
}
