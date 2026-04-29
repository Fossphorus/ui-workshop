import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonText, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';

import { TagListComponent } from '../tag-list/tag-list.component';
import { TagManagerMockService } from '../tag-list/tag-manager.mock-service';
import { TagListStore } from '../tag-list/tag-list.store';
import { ContactPhoneNumber } from './edit-contact.store';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule, TagListComponent, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonText, IonTextarea],
  providers: [TagManagerMockService, TagListStore],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent implements OnInit {
  private readonly tagStore = inject(TagListStore);

  @Input({ required: true }) firstName = '';
  @Input({ required: true }) lastName = '';
  @Input({ required: true }) phoneNumbers: ContactPhoneNumber[] = [];
  @Input({ required: true }) notes = '';
  @Input() canSave = false;
  @Input() showCancel = false;
  @Input() saveLabel = 'Save contact';

  @Output() firstNameChange = new EventEmitter<string>();
  @Output() lastNameChange = new EventEmitter<string>();
  @Output() notesChange = new EventEmitter<string>();
  @Output() addPhoneNumber = new EventEmitter<void>();
  @Output() updatePhoneNumber = new EventEmitter<{ id: string; value: string }>();
  @Output() removePhoneNumber = new EventEmitter<string>();
  @Output() saveContact = new EventEmitter<void>();
  @Output() cancelContact = new EventEmitter<void>();

  constructor() {
    addIcons({ add, close });
  }

  ngOnInit(): void {
    void this.tagStore.loadScenario('few');
  }
}
