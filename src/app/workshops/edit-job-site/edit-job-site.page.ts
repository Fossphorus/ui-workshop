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
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonSearchbar,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, menu, personAdd } from 'ionicons/icons';

import { WorkshopNavComponent } from '../../workshop-nav/workshop-nav.component';
import { ContactFormComponent } from '../edit-contact/contact-form.component';
import { TagListComponent } from '../tag-list/tag-list.component';
import { TagManagerMockService } from '../tag-list/tag-manager.mock-service';
import { TagListStore } from '../tag-list/tag-list.store';
import { EditJobSiteStore } from './edit-job-site.store';

@Component({
  selector: 'app-edit-job-site-page',
  standalone: true,
  imports: [
    FormsModule,
    WorkshopNavComponent,
    TagListComponent,
    ContactFormComponent,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonModal,
    IonNote,
    IonSearchbar,
    IonText,
    IonTextarea,
    IonTitle,
    IonToast,
    IonToolbar
  ],
  providers: [EditJobSiteStore, TagManagerMockService, TagListStore],
  templateUrl: './edit-job-site.page.html',
  styleUrl: './edit-job-site.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditJobSitePage implements OnInit {
  readonly jobSiteStore = inject(EditJobSiteStore);
  readonly tagStore = inject(TagListStore);

  constructor() {
    addIcons({ add, close, menu, personAdd });
  }

  ngOnInit(): void {
    void this.tagStore.loadScenario('few');
  }
}
