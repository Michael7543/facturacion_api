import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { BreadcrumbService } from 'src/app/_service/utils/app.breadcrumb.service';
import { ConsultasService } from '../../services/consultas.service';
import { ClienteDto } from '../../model/ClienteDto';
import { AppService } from 'src/app/_service/app.service';
import { severities } from 'src/app/_enums/constDomain';
import { CretencionService } from '../../services/cretencion.service';
import { CretencionDto } from '../../model/CretencionDto';
import { ConceptoDto } from '../../model/ConceptoDto';
import { ConceptoService } from '../../services/concepto.service';
import { ReciboCajaService } from '../../services/reciboCaja.service';

@Component({
    selector: 'app-recibo-caja',
    templateUrl: './recibo-caja.component.html',
    styleUrls: ['./recibo-caja.component.scss'],
})
export class ReciboCajaComponent implements OnInit {
    displayModal: boolean = false;

    editar: boolean;
    modal: boolean;
    modalBuscar: boolean;
    modalBusTabl: boolean;
    modal4: boolean;
    modal1: boolean; //Visibilidad de un modal
    busquedaForm: FormGroup;

    maxLengthR: number = 13;
    maxLengthC: number = 10;

    constructor(
        private breadcrumbService: BreadcrumbService,
        public appService: AppService,
        private formBuilder: FormBuilder,
        private reciboCaja: ReciboCajaService,
        //Busqueda
        private consultaService: ConsultasService,
        //Conceptos
        private conceptosService: ConceptoService
    ) {
        {
            this.buscarForm = this.formBuilder.group({
                codRcaja: ['', [Validators.required]], // Agrega las validaciones que necesites
                // Otros campos del formulario
            });
            this.breadcrumbService.setItems([{ label: 'Recibo Caja ' }]);
        }
    }

    ngOnInit() {
        this.llenarListConceptos();
        this.clienteSelect = new ClienteDto();
    }

    get f() {
        return this.buscarForm.controls;
    }

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
        this.limpiarLista();
        this.modal = false;
    }

    cerrarmodal1() {
        this.modal1 = false;
    }

    modalOpen() {
        //this.displayAnulacioModal.onDisplayForm()
        this.displayModal = true;
        console.log('abrir modal desde tabla');
    }

    closeModal() {
        this.displayModal = false;
        console.log('cerrando modal');
    }

    //BUSQUEDA
    selectedOption: string = '';
    data: string = '';

    loading: boolean = false;
    listCliente: ClienteDto[] = [];
    listCretencion: CretencionDto[] = [];
    tipoCliente: number;
    cedulaBusqueda: string;
    nombreBusqueda: string;
    apellidoBusqueda: string;
    nombres: string;
    formCliente: FormGroup;

    iniciarFormCliente() {
        this.formCliente = this.formBuilder.group({
            cedula: new FormControl(''),
            nombre: new FormControl(''),
            direccion: new FormControl(''),
            telefono: new FormControl(''),
            correo: new FormControl(''),
        });
    }

    async llenarListCliente() {
        this.nombres =
            this.nombreBusqueda == null
                ? this.apellidoBusqueda == null
                    ? '0'
                    : this.apellidoBusqueda
                : this.nombreBusqueda;

        await this.consultaService
            .getByIdParametro(
                this.cedulaBusqueda == null ? '0' : this.cedulaBusqueda,
                this.nombres,
                this.tipoCliente
            )
            .subscribe({
                next: (data) => {
                    this.listCliente = data.listado;
                    this.loading = false;
                },
                complete: () => {
                    this.appService.msgInfoDetail(
                        severities.INFO,
                        'INFO',
                        'Datos Cargados exitosamente'
                    );
                    this.loading = false;
                },
                error: (error) => {
                    this.appService.msgInfoDetail(
                        severities.ERROR,
                        'ERROR',
                        error.error
                    );
                    this.loading = false;
                },
            });
        this.modalBusTabl = true;
    }

    registrarNuevo() {
        // this.cretencion = new CretencionDto();
        // this.iniciarForm();
        this.modal = true;
        this.clienteSelect = new ClienteDto();
        this.tipoCliente = 2;
        this.listCliente = [];
    }

    clienteSelect: ClienteDto;

    busquedaCliente() {
        if (this.tipoCliente == 0) {
            this.modalBuscar = false;
        } else {
            this.modalBuscar = true;
        }
        this.cedulaBusqueda = null;
        this.nombreBusqueda = null;
        this.apellidoBusqueda = null;
    }

    cargarCliente(clienteSelectDto: ClienteDto) {
        this.clienteSelect = clienteSelectDto;
        this.modalBusTabl = false;
        this.modalBuscar = false;
    }

    //  NUMERO DE RECIBO CAJA
    buscarForm: FormGroup;

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
        this.f.codRcaja.setValue(formattedValue);

        const cursorPosition = input.selectionStart;
        input.setSelectionRange(cursorPosition, cursorPosition);
    }
    // CONCEPTOS

    @Input() listConceptos: ConceptoDto[];
    conceptos: ConceptoDto;

    selectedRecord: any;
    idConcepto: string = '';
    nombreConcepto: string = '';
    valorConcepto: number = 0;

    loadData(event) {
        this.loading = true;
        setTimeout(() => {
            this.conceptosService.getAll().subscribe((res) => {
                this.listConceptos = res;
                console.log('LLAMADA');
                console.log(this.listConceptos);
                this.loading = false;
            });
        }, 1000);
    }

    async llenarListConceptos() {
        await this.conceptosService.getAll().subscribe({
            next: (data) => {
                this.listConceptos = data.listado;
                console.log('CORRECTO');
                console.log(this.listConceptos);
            },
        });
    }

    showAttributes(record: any) {
        this.selectedRecord = record;

        // Actualiza las variables con los valores del registro seleccionado
        this.idConcepto = this.selectedRecord.codigoConcepto;
        this.nombreConcepto = this.selectedRecord.nombreConcepto;
        this.valorConcepto = this.selectedRecord.valorConcepto;
    }

    // LISTAR CONCEPTOS

    conceptosList: { nombre: string; valor: number; cantidad: number }[] = [];
    cantidadTemporal: number = 1;

    addToConceptosList() {
        if (
            this.cantidadTemporal !== 0 &&
            this.cantidadTemporal !== null &&
            this.nombreConcepto.trim() !== '' &&
            this.valorConcepto !== 0
        ) {
            const totalConcepto = this.Total(
                this.valorConcepto,
                this.cantidadTemporal
            );

            const nuevoConcepto = {
                nombre: this.nombreConcepto,
                valor: this.valorConcepto,
                cantidad: this.cantidadTemporal,
                total: totalConcepto,
            };

            this.conceptosList.push(nuevoConcepto);

            // Limpiar las variables para futuras entradas
            this.nombreConcepto = '';
            this.valorConcepto = 0;
            this.cantidadTemporal = 1;
            this.modal1 = false;

            this.calcularTotalesTotales(); // Llama al método para recalcular los totales generales
        }
    }

    Total(valor: number, cantidad: number): number {
        if (cantidad !== 0) {
            return valor * cantidad;
        } else {
            return valor;
        }
    }

    // ELIMINAR CONCEPTOS
    limpiarLista() {
        this.conceptosList = [];
        this.subtotalTotal = 0;
        this.ivaTotal = 0;
        this.totalTotal = 0;
    }

    eliminarConcepto(concepto: any) {
        const index = this.conceptosList.indexOf(concepto);
        if (index !== -1) {
            this.conceptosList.splice(index, 1);
        }
        this.calcularTotalesTotales(); // Recalcula los totales generales
    }

    // TOTAL IVA SUBTOTAL
    subtotalTotal: number = 0;
    ivaTotal: number = 0;
    totalTotal: number = 0;

    calcularTotalesTotales() {
        this.subtotalTotal = this.conceptosList.reduce(
            (sum, concepto) =>
                sum + this.Total(concepto.valor, concepto.cantidad),
            0
        );
        this.ivaTotal = this.subtotalTotal * 0.12; // Calcula el 12% del subtotal total como IVA total
        this.totalTotal = this.subtotalTotal + this.ivaTotal;
    }

    // EDITAR CONCEPTOS

    conceptoEditando: any = null;
    cantidadEditando: number = 0;

    iniciarEdicionCantidad(concepto: any) {
        this.editar = true;
        this.conceptoEditando = concepto;
        this.cantidadEditando = concepto.cantidad;
    }

    guardarEdicionCantidad() {
        if (this.conceptoEditando) {
            this.conceptoEditando.cantidad = this.cantidadEditando;
            this.calcularTotalesTotales(); // Recalcula los totales generales
            this.conceptoEditando = null; // Limpia la edición
            this.cantidadEditando = 0;
            this.editar = false;
        }
    }

    editarmodal() {
        this.editar = false;
    }

    // GUARDAR

    guardarDatos() {
        if (
            this.subtotalTotal === 0 ||
            this.ivaTotal === 0 ||
            this.totalTotal === 0
        ) {
            console.log('Algunos campos no se han llenado correctamente.');
            return;
        }

        // Prepara los datos a enviar
        const datosAGuardar = {
            carreraConsumidorRc: 'Null',

            codRcaja: this.buscarForm.get('codRcaja').value, // Obtén el valor del campo codRcaja del formulario
            correoConsumidorRc: this.clienteSelect.correo,
            direccionConsumidorRc: this.clienteSelect.direccion,
            fechaRcaja: new Date().toISOString(), // Obtén la fecha actual en formato ISO
            idEstadoRc: 1,

            idCajaRc: 0,
            idReciboCaja: 0,
            idTipoConsumidorRc: 0,
            idUsuarioRc: 0,
            nroPagosRc: 0,

            observacionRc: '',

            ivaRc: this.ivaTotal,
            nombreConsumidorRc: this.clienteSelect.nombre,
            rucConsumidorRc: this.clienteSelect.cedula,
            subtotalRc: this.subtotalTotal,
            telfConsumidorRc: this.clienteSelect.telefono,
            totalRc: this.totalTotal,
        };

        // Llama al método del servicio para guardar los datos
        this.reciboCaja.saveObject(datosAGuardar).subscribe(
            (respuesta) => {
                console.log('Datos guardados exitosamente:', respuesta);
                // Puedes mostrar un mensaje de éxito u otras acciones aquí
            },
            (error) => {
                console.error('Error al guardar los datos:', error);
                // Puedes mostrar un mensaje de error u otras acciones de manejo de errores aquí
            }
        );

        this.limpiarLista();
        this.modal = false;
    }
}
