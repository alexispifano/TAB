import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.css']
})
export class CopyrightComponent implements OnInit {
  copyright:string = "Todos los derechos reservado TAB"
  empresa:string= "The Akaris Box";
  hoy:any = new Date();
  constructor() { }

  ngOnInit() {
  }

}