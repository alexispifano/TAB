import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] //Es un array, puedes meter más estilos css aunque en casi todos los casos es recomendado solo poner el por defecto
})
export class AppComponent {
  destino:string = 'Universo';
}
