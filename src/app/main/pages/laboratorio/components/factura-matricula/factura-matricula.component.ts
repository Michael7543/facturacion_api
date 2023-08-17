import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BreadcrumbService } from 'src/app/_service/utils/app.breadcrumb.service';
import { ListFormaPagoComponent } from '../list-forma-pago/list-forma-pago.component';
import { AppService } from 'src/app/_service/app.service';
import { ConsultasService } from '../../services/consultas.service';
import { CretencionService } from '../../services/cretencion.service';
import { ClienteDto } from '../../model/ClienteDto';
import { CretencionDto } from '../../model/CretencionDto';
import { severities } from 'src/app/_enums/constDomain';

@Component({
  selector: 'app-factura-matricula',
  templateUrl: './factura-matricula.component.html',
  styleUrls: ['./factura-matricula.component.css']
})
export class FacturaMatriculaComponent implements OnInit {
  modal: boolean;
  cedula: string;
  modal2: boolean;
  modal3: boolean;
  modal1: boolean; //Visibilidad de un modal
  busquedaForm: FormGroup;
  modallista: boolean;
  modalBuscar: boolean;
  displayModal: boolean = false;
  modalBusTabl: boolean;
  maxLengthR: number = 13;
  maxLengthC: number = 10;



  constructor(private breadcrumbService: BreadcrumbService,
    public appService: AppService,
    private formBuilder: FormBuilder,
    //Busqueda
    private consultaService: ConsultasService,
    private cretencionService: CretencionService,) {
    {
        this.breadcrumbService.setItems([{ label: 'Recibo Caja ' }]);
    }
}

  ngOnInit():void {
    //this.iniciarForms();
  }

  /*   iniciarForms() {
    this.formFacturaLaboratorio = this.formBuilder.group({
        factura_no: new FormControl(
            '',
            Validators.compose([Validators.required])
        ),
        nombrecl: new FormControl(
            '',
            Validators.compose([Validators.required])
        ),
        estado: new FormControl(
            true,
            Validators.compose([Validators.requiredTrue])
        ),
        ruc: new FormControl(
          '',
          Validators.compose([Validators.required])
      ),
      cedula: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)])
      ),
    });

    this.token = JSON.parse(this.tokenService.getResponseAuth());
    //  this.f.idFormaPago.setValue(this.token.id)
} */



  onInput(event: any) {
    const input = event.target;
    const value = input.value;
  
    // Remover caracteres no numéricos excepto el símbolo "-"
    const numericValue = value.replace(/[^\d-]/g, '');
    input.value = numericValue;
  }
//Abrir el modal
abrirmodal() {
  this.modal = true;
}
abrirmodal1() {
  this.modal1 = true;
}
abrirmodal2() {
  this.modal2 = true;
}
abrirmodal3() {
  this.modal3 = true;
}
abrirmodalista() {
  this.modallista = true;
}

    //Cerrar el modal y restablecer el formulario
  
  cerrarmodal1() {
      this.modal1 = false;
  }

//Cerrar el modal y restablecer el formulario
cerrar() {
  // this.f.estadoCentroCosto.disable();
  // this.setearForm();

  this.modal = false;
  this.modal1 = false;
  this.modal2 = false;
  this.modal3 = false;
  this.modallista = false;
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
  data: string = ''


  buscarU(): void {
      switch (this.selectedOption) {
        case "Cliente":
          this.data = "Cliente";
          break;
        case "Empleado EPN":
          this.data = "Empleado";
          break;
        default:
          this.data = ""; // Valor por defecto si ninguna opción está seleccionada
          break;
      }
      this.modalBuscar = true;
      console.log(this.data);
    }

    loading: boolean= false;
    listCliente:ClienteDto[]=[];
    listCretencion:CretencionDto[]=[];
    tipoCliente:number;
    cedulaBusqueda: string;
    nombreBusqueda: string;
    apellidoBusqueda:string
    nombres:string;
    formCliente:FormGroup

    iniciarFormCliente(){
      this.formCliente= this.formBuilder.group({
          cedula: new FormControl('',),
          nombre:new FormControl('',),
          direccion:new FormControl('',),
          telefono:new FormControl('',),
          correo:new FormControl('',),
      });
  }

  async llenarListCliente() {

      this.nombres = this.nombreBusqueda == null ? (this.apellidoBusqueda == null ? '0' : this.apellidoBusqueda) : this.nombreBusqueda;

      await this.consultaService.getByIdParametro(this.cedulaBusqueda == null ? '0' : this.cedulaBusqueda, this.nombres, this.tipoCliente).subscribe({
              next: data => {
                  this.listCliente = data.listado
                  this.loading = false;
              },
              complete: () => {
                  this.appService.msgInfoDetail(severities.INFO, 'INFO', 'Datos Cargados exitosamente')
                  this.loading = false;
              },
              error: error => {
                  this.appService.msgInfoDetail(severities.ERROR, 'ERROR', error.error)
                  this.loading = false;
              }
          }
      );
      this.modalBusTabl=true;
  }

  registrarNuevo() {
      // this.cretencion = new CretencionDto();
      // this.iniciarForm();
      this.modal=true
      this.clienteSelect= new ClienteDto();
      this.tipoCliente= 2;
      this.listCliente= [];
  }

  clienteSelect:ClienteDto;

  busquedaCliente(){

    if(this.tipoCliente==0){
        this.modalBuscar= false;
    }else{
        this.modalBuscar= true;
    }
      this.cedulaBusqueda= null;
      this.nombreBusqueda= null;
      this.apellidoBusqueda= null;
  }

  cargarCliente(clienteSelectDto: ClienteDto ){
    this.clienteSelect= clienteSelectDto;
    this.modalBusTabl= false;
    this.modalBuscar=false;

  }

  


}
