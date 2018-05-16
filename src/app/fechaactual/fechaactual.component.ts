import {Component } from '@angular/core';

@Component({
    selector: 'app-fechaactual',
    templateUrl: './fechaactual.component.html',
    styleUrls: ['./fechaactual.component.css']
})

export class FechaactualComponent {
    hoy = new Date();
}