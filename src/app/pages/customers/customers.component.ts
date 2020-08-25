import { Component, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ConfirmationService } from "primeng/api";

import { UsersService } from "../../core/services/user/users.service";
import { AuthService } from "../../core/services/auth/auth.service";
import { environment } from "environments/environment";

import { Usuarios } from "../../core/interface/Usuarios";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

@Component({
  selector: 'app-promotions',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  private form: FormGroup;
  token: any = this.authService.getJwtToken();
  display: boolean = false;
  listcustomers: Usuarios[];
  customerEdit: Usuarios;

  clientes: Usuarios[];
  direccion: string;
  referencia: string;
  coordenadas: string;

  cols: any[];
  constructor(
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private user: UsersService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.clearState();

    let subs = this.user.usuarios().subscribe(
      (data: any) => {
        this.clientes = this.filtrarCliente(data);
        console.log(this.clientes);
      },
      (err: any) => {
        console.log(err);
        subs.unsubscribe();
      }
    );
  }

  filtrarCliente(lista: any){
    for(let i=0; i<environment.variables.nombreClientes.length; i++){
      for(let j=0; j<lista.length;j++){
        if(environment.variables.nombreClientes[i]['cedula'] === lista[j].idUsuarioreporta){
          this.getAddress(environment.variables.nombreClientes[i]['direccion']);
          lista[j].direccion=this.direccion;
        }
      }
    }
    return lista;
  }

  getAddress(address:any){
    const obj=JSON.parse(address);
    this.direccion=obj.direccion;
    this.referencia=obj.referencia;
    this.coordenadas=obj.coordenadas;
  }

  eliminarCustomers(cedula){
    this.confirmationService.confirm({
      message: "¿Est&aacute; seguro que desea eliminar al cliente?",
      accept: () =>{
        this.user.deleteUser(cedula).toPromise().then(result => {
          console.log('From delete: ', result);
        });
        console.log(cedula, "usuario eliminado");
      },
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      nombre: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      apellido: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      direccion: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
      telefono: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  clearState() {
    this.display = false;
    this.form.reset();
  }

}
