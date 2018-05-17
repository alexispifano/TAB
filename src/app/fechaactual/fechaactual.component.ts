import {Component } from '@angular/core';

@Component({
    selector: 'app-fechaactual',
    template: `
    <p>Barcelona, {{ hoy | date: 'd/M/y H:m'}}</p>
    `,
    styleUrls: ['./fechaactual.component.css']
})

export class FechaactualComponent {
    hoy = new Date();
}