import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
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
  IonToolbar,
  MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  alertCircle,
  checkmarkCircle,
  close,
  menu,
  pricetag,
  search,
  swapVertical
} from 'ionicons/icons';

import { TagManagerMockService } from './tag-manager.mock-service';
import { getTagColor, Tag, TagColorName } from './tag.model';
import { TagListStore } from './tag-list.store';

@Component({
  selector: 'app-tag-list-page',
  standalone: true,
  imports: [
    FormsModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuButton,
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
  providers: [TagManagerMockService, TagListStore],
  templateUrl: './tag-list.page.html',
  styleUrl: './tag-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagListPage implements OnInit {
  readonly store = inject(TagListStore);
  private readonly menuController = inject(MenuController);

  constructor() {
    addIcons({ add, alertCircle, checkmarkCircle, close, menu, pricetag, search, swapVertical });
  }

  ngOnInit(): void {
    void this.store.loadScenario();
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

  colorLabel(colorName: TagColorName): string {
    return getTagColor(colorName).label;
  }

  async selectScenario(scenarioId: string): Promise<void> {
    await this.store.loadScenario(scenarioId as never);
    await this.menuController.close('scenario-menu');
  }
}
