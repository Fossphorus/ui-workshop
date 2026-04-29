import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { ContactPhoneNumber } from '../edit-contact/edit-contact.store';

export interface JobSiteContact {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumbers: ContactPhoneNumber[];
  notes: string;
}

interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

interface DraftContact {
  firstName: string;
  lastName: string;
  phoneNumbers: ContactPhoneNumber[];
  notes: string;
}

interface EditJobSiteState {
  address: Address;
  notes: string;
  contacts: JobSiteContact[];
  associatedContactIds: string[];
  contactPickerOpen: boolean;
  addContactOpen: boolean;
  contactSearch: string;
  draftContact: DraftContact;
  savedMessage: string;
}

const initialContacts: JobSiteContact[] = [
  {
    id: 'contact-grace',
    firstName: 'Grace',
    lastName: 'Hopper',
    phoneNumbers: [{ id: 'grace-mobile', value: '555-0142' }],
    notes: 'Prefers concise implementation updates by phone.'
  },
  {
    id: 'contact-katherine',
    firstName: 'Katherine',
    lastName: 'Johnson',
    phoneNumbers: [{ id: 'katherine-mobile', value: '555-0168' }],
    notes: 'Primary scheduling contact.'
  },
  {
    id: 'contact-margaret',
    firstName: 'Margaret',
    lastName: 'Hamilton',
    phoneNumbers: [{ id: 'margaret-mobile', value: '555-0191' }],
    notes: 'Escalation contact for field coordination.'
  },
  {
    id: 'contact-ada',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phoneNumbers: [{ id: 'ada-mobile', value: '555-0129' }],
    notes: ''
  }
];

const emptyDraftContact: DraftContact = {
  firstName: '',
  lastName: '',
  phoneNumbers: [],
  notes: ''
};

const initialState: EditJobSiteState = {
  address: {
    address1: '121 Commerce Way',
    address2: 'Suite 400',
    city: 'Austin',
    state: 'TX',
    zip: '78701'
  },
  notes: 'Coordinate access through the front desk before dispatch.',
  contacts: initialContacts,
  associatedContactIds: ['contact-grace', 'contact-katherine'],
  contactPickerOpen: false,
  addContactOpen: false,
  contactSearch: '',
  draftContact: emptyDraftContact,
  savedMessage: ''
};

function contactFullName(contact: JobSiteContact): string {
  return `${contact.firstName} ${contact.lastName}`.trim();
}

export const EditJobSiteStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    associatedContacts: computed(() =>
      store.associatedContactIds()
        .map((id) => store.contacts().find((contact) => contact.id === id))
        .filter((contact): contact is JobSiteContact => Boolean(contact))
    ),
    filteredContacts: computed(() => {
      const search = store.contactSearch().trim().toLowerCase();

      return store.contacts()
        .filter((contact) => !search || contactFullName(contact).toLowerCase().includes(search))
        .sort((left, right) => contactFullName(left).localeCompare(contactFullName(right)));
    }),
    canSave: computed(() => Boolean(store.address().address1.trim()) && Boolean(store.address().city.trim())),
    canCreateContact: computed(
      () => Boolean(store.draftContact().firstName.trim()) || Boolean(store.draftContact().lastName.trim())
    )
  })),
  withMethods((store) => ({
    setAddressField(field: keyof Address, value: string): void {
      patchState(store, {
        address: { ...store.address(), [field]: value },
        savedMessage: ''
      });
    },
    setNotes(notes: string): void {
      patchState(store, { notes, savedMessage: '' });
    },
    openContactPicker(): void {
      patchState(store, { contactPickerOpen: true, contactSearch: '' });
    },
    closeContactPicker(): void {
      patchState(store, { contactPickerOpen: false, contactSearch: '' });
    },
    setContactSearch(contactSearch: string): void {
      patchState(store, { contactSearch });
    },
    isContactAssociated(contactId: string): boolean {
      return store.associatedContactIds().includes(contactId);
    },
    addAssociatedContact(contactId: string): void {
      if (store.associatedContactIds().includes(contactId)) {
        return;
      }

      patchState(store, {
        associatedContactIds: [...store.associatedContactIds(), contactId],
        contactPickerOpen: false,
        contactSearch: '',
        savedMessage: 'Contact added'
      });
    },
    removeAssociatedContact(contactId: string): void {
      patchState(store, {
        associatedContactIds: store.associatedContactIds().filter((id) => id !== contactId),
        savedMessage: ''
      });
    },
    openAddContact(): void {
      patchState(store, { addContactOpen: true, draftContact: { ...emptyDraftContact } });
    },
    closeAddContact(): void {
      patchState(store, { addContactOpen: false, draftContact: { ...emptyDraftContact } });
    },
    setDraftContactField(field: 'firstName' | 'lastName' | 'notes', value: string): void {
      patchState(store, {
        draftContact: { ...store.draftContact(), [field]: value }
      });
    },
    addDraftPhoneNumber(): void {
      patchState(store, {
        draftContact: {
          ...store.draftContact(),
          phoneNumbers: [...store.draftContact().phoneNumbers, { id: `draft-phone-${Date.now()}`, value: '' }]
        }
      });
    },
    updateDraftPhoneNumber(id: string, value: string): void {
      patchState(store, {
        draftContact: {
          ...store.draftContact(),
          phoneNumbers: store.draftContact().phoneNumbers.map((phoneNumber) =>
            phoneNumber.id === id ? { ...phoneNumber, value } : phoneNumber
          )
        }
      });
    },
    removeDraftPhoneNumber(id: string): void {
      patchState(store, {
        draftContact: {
          ...store.draftContact(),
          phoneNumbers: store.draftContact().phoneNumbers.filter((phoneNumber) => phoneNumber.id !== id)
        }
      });
    },
    createContact(): void {
      if (!store.canCreateContact()) {
        return;
      }

      const firstName = store.draftContact().firstName.trim();
      const lastName = store.draftContact().lastName.trim();
      const phoneNumbers = store.draftContact().phoneNumbers
        .map((phoneNumber) => ({ ...phoneNumber, value: phoneNumber.value.trim() }))
        .filter((phoneNumber) => phoneNumber.value);
      const notes = store.draftContact().notes.trim();
      const id = `contact-${Date.now()}`;
      const contact: JobSiteContact = { id, firstName, lastName, phoneNumbers, notes };

      patchState(store, {
        contacts: [...store.contacts(), contact],
        associatedContactIds: [...store.associatedContactIds(), id],
        addContactOpen: false,
        contactPickerOpen: false,
        draftContact: { ...emptyDraftContact },
        savedMessage: 'Contact added'
      });
    },
    save(): void {
      if (!store.canSave()) {
        return;
      }

      patchState(store, {
        address: {
          address1: store.address().address1.trim(),
          address2: store.address().address2.trim(),
          city: store.address().city.trim(),
          state: store.address().state.trim(),
          zip: store.address().zip.trim()
        },
        notes: store.notes().trim(),
        savedMessage: 'Job site saved'
      });
    },
    cancel(): void {
      patchState(store, {
        address: { ...initialState.address },
        notes: initialState.notes,
        associatedContactIds: [...initialState.associatedContactIds],
        savedMessage: 'Changes canceled'
      });
    },
    clearSavedMessage(): void {
      patchState(store, { savedMessage: '' });
    }
  }))
);
