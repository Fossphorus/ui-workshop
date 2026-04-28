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
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, create, menu, pricetag, trash } from 'ionicons/icons';

import { WorkshopNavComponent } from '../../workshop-nav/workshop-nav.component';
import { TagManagerMockService } from './tag-manager.mock-service';
import { getTagColor, TagColorName } from './tag.model';
import { TagManagerStore } from './tag-manager.store';

@Component({
  selector: 'app-tag-list-page',
  standalone: true,
  imports: [
    FormsModule,
    WorkshopNavComponent,
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
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
  ],
  providers: [TagManagerMockService, TagManagerStore],
  templateUrl: './tag-list.page.html',
  styleUrl: './tag-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListPage implements OnInit {
  readonly store = inject(TagManagerStore);

  constructor() {
    addIcons({ add, close, create, menu, pricetag, trash });
  }

  ngOnInit(): void {
    void this.store.loadTags();
  }

  tagStyle(colorName: TagColorName): Record<string, string> {
    const color = getTagColor(colorName);
    return {
      '--tag-bg': color.value,
      '--tag-fg': color.text === 'light' ? '#ffffff' : '#15171a',
      '--tag-border': colorName === 'white' ? '#d1d5db' : color.value
    };
  }
}
