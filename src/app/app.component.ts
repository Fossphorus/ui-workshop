import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonApp } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, RouterOutlet],
  template: '<ion-app><router-outlet /></ion-app>',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ui-workshop';
}
