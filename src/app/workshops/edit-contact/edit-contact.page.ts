import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonNote,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, menu } from 'ionicons/icons';

import { WorkshopNavComponent } from '../../workshop-nav/workshop-nav.component';
import { TagListComponent } from '../tag-list/tag-list.component';
import { TagManagerMockService } from '../tag-list/tag-manager.mock-service';
import { TagListStore } from '../tag-list/tag-list.store';
import { EditContactStore } from './edit-contact.store';

@Component({
  selector: 'app-edit-contact-page',
  standalone: true,
  imports: [
    FormsModule,
    WorkshopNavComponent,
    TagListComponent,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonNote,
    IonText,
    IonTextarea,
    IonTitle,
    IonToast,
    IonToolbar
  ],
  providers: [EditContactStore, TagManagerMockService, TagListStore],
  templateUrl: './edit-contact.page.html',
  styleUrl: './edit-contact.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditContactPage implements OnInit {
  readonly contactStore = inject(EditContactStore);
  readonly tagStore = inject(TagListStore);

  constructor() {
    addIcons({ add, close, menu });
  }

  ngOnInit(): void {
    void this.tagStore.loadScenario('few');
  }
}
