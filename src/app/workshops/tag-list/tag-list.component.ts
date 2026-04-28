import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  IonModal,
  IonNote,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, alertCircle, close, pricetag } from 'ionicons/icons';

import { getTagColor, Tag, TagColorName } from './tag.model';
import { TagListStore } from './tag-list.store';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    FormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonNote,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonSkeletonText,
    IonSpinner,
    IonText,
    IonTitle,
    IonToast,
    IonToolbar
  ],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListComponent {
  readonly store = inject(TagListStore);

  constructor() {
    addIcons({ add, alertCircle, close, pricetag });
  }

  tagStyle(tag: Tag): Record<string, string> {
    const color = getTagColor(tag.color);
    return {
      '--tag-bg': color.value,
      '--tag-fg': color.text === 'light' ? '#ffffff' : '#15171a',
      '--tag-border': tag.color === 'white' ? '#d1d5db' : color.value
    };
  }

  colorStyle(colorName: TagColorName): Record<string, string> {
    const color = getTagColor(colorName);
    return {
      '--swatch-bg': color.value,
      '--swatch-border': colorName === 'white' ? '#cbd5e1' : color.value
    };
  }
}
