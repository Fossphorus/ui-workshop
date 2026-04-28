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
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menu } from 'ionicons/icons';

import { WorkshopNavComponent } from '../../workshop-nav/workshop-nav.component';
import { TagListComponent } from '../tag-list/tag-list.component';
import { TagManagerMockService } from '../tag-list/tag-manager.mock-service';
import { TagListStore } from '../tag-list/tag-list.store';
import { EditUserStore, UserRole } from './edit-user.store';

@Component({
  selector: 'app-edit-user-page',
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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToast,
    IonToolbar
  ],
  providers: [EditUserStore, TagManagerMockService, TagListStore],
  templateUrl: './edit-user.page.html',
  styleUrl: './edit-user.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserPage implements OnInit {
  readonly userStore = inject(EditUserStore);
  readonly tagStore = inject(TagListStore);

  constructor() {
    addIcons({ menu });
  }

  ngOnInit(): void {
    void this.tagStore.loadScenario('few');
  }

  setRole(role: string): void {
    this.userStore.setRole(role as UserRole);
  }
}
