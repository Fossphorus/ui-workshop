import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonTitle,
  IonToolbar,
  MenuController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, personCircle, pricetags } from 'ionicons/icons';

interface WorkshopRoute {
  path: string;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-workshop-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonTitle,
    IonToolbar
  ],
  templateUrl: './workshop-nav.component.html',
  styleUrl: './workshop-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkshopNavComponent {
  private readonly menuController = inject(MenuController);

  readonly routes: WorkshopRoute[] = [
    {
      path: '/tags',
      label: 'Tag manager',
      description: 'Attach and remove tags from an object.',
      icon: 'pricetags'
    },
    {
      path: '/edit-user',
      label: 'Edit user',
      description: 'Username, tags, role, and notes.',
      icon: 'person-circle'
    },
    {
      path: '/edit-contact',
      label: 'Edit contact',
      description: 'Names, tags, phone numbers, and notes.',
      icon: 'person'
    }
  ];

  constructor() {
    addIcons({ person, personCircle, pricetags });
  }

  async close(): Promise<void> {
    await this.menuController.close('component-menu');
  }
}
