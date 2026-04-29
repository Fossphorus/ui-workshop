import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menu } from 'ionicons/icons';

import { WorkshopNavComponent } from '../../workshop-nav/workshop-nav.component';
import { ContactFormComponent } from './contact-form.component';
import { EditContactStore } from './edit-contact.store';

@Component({
  selector: 'app-edit-contact-page',
  standalone: true,
  imports: [
    WorkshopNavComponent,
    ContactFormComponent,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonTitle,
    IonToast,
    IonToolbar
  ],
  providers: [EditContactStore],
  templateUrl: './edit-contact.page.html',
  styleUrl: './edit-contact.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditContactPage {
  readonly contactStore = inject(EditContactStore);

  constructor() {
    addIcons({ menu });
  }
}
