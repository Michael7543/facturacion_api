import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BreadcrumbService } from 'src/app/_service/utils/app.breadcrumb.service';

@Component({
    selector: 'app-recibo-caja',
    templateUrl: './recibo-caja.component.html',
    styleUrls: ['./recibo-caja.component.scss'],
})
export class ReciboCajaComponent implements OnInit {
    modal: boolean;
    modal1: boolean; //Visibilidad de un modal
    busquedaForm: FormGroup;

    maxLengthR: number = 13;
    maxLengthC: number = 10;

    constructor(private breadcrumbService: BreadcrumbService) {
        {
            this.breadcrumbService.setItems([{ label: 'Recibo Caja ' }]);
        }
    }

    ngOnInit() {}

    cancelar() {
        // this.setearForm();
        this.modal = false;
    }

    onInputR(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        if (value.length > this.maxLengthR) {
            inputElement.value = value.slice(0, this.maxLengthR); // Truncar el valor a la longitud máxima
            this.busquedaForm.controls['Cantidad'].setValue(inputElement.value); // Actualizar el valor del formulario
        }
    }

    onInputC(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        const value = inputElement.value;
        if (value.length > this.maxLengthC) {
            inputElement.value = value.slice(0, this.maxLengthC); // Truncar el valor a la longitud máxima
            this.busquedaForm.controls['Cantidad'].setValue(inputElement.value); // Actualizar el valor del formulario
        }
    }

    //Abrir el modal
    abrirmodal() {
        this.modal = true;
    }
    abrirmodal1() {
        this.modal1 = true;
    }
    //Cerrar el modal y restablecer el formulario
    cerrar() {
        // this.f.estadoCentroCosto.disable();
        // this.setearForm();

        this.modal = false;
        this.modal1 = false;
    }
}
