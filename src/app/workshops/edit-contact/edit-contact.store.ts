import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface ContactPhoneNumber {
  id: string;
  value: string;
}

interface EditContactState {
  firstName: string;
  lastName: string;
  phoneNumbers: ContactPhoneNumber[];
  notes: string;
  savedMessage: string;
}

const initialState: EditContactState = {
  firstName: 'Grace',
  lastName: 'Hopper',
  phoneNumbers: [
    { id: 'phone-mobile', value: '555-0142' },
    { id: 'phone-office', value: '555-0188' }
  ],
  notes: 'Prefers concise implementation updates by phone.',
  savedMessage: ''
};

export const EditContactStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    canSave: computed(() => Boolean(store.firstName().trim()) || Boolean(store.lastName().trim()))
  })),
  withMethods((store) => ({
    setFirstName(firstName: string): void {
      patchState(store, { firstName, savedMessage: '' });
    },
    setLastName(lastName: string): void {
      patchState(store, { lastName, savedMessage: '' });
    },
    setNotes(notes: string): void {
      patchState(store, { notes, savedMessage: '' });
    },
    addPhoneNumber(): void {
      patchState(store, {
        phoneNumbers: [...store.phoneNumbers(), { id: `phone-${Date.now()}`, value: '' }],
        savedMessage: ''
      });
    },
    updatePhoneNumber(id: string, value: string): void {
      patchState(store, {
        phoneNumbers: store.phoneNumbers().map((phoneNumber) =>
          phoneNumber.id === id ? { ...phoneNumber, value } : phoneNumber
        ),
        savedMessage: ''
      });
    },
    removePhoneNumber(id: string): void {
      patchState(store, {
        phoneNumbers: store.phoneNumbers().filter((phoneNumber) => phoneNumber.id !== id),
        savedMessage: ''
      });
    },
    save(): void {
      if (!store.canSave()) {
        return;
      }

      patchState(store, {
        firstName: store.firstName().trim(),
        lastName: store.lastName().trim(),
        phoneNumbers: store.phoneNumbers()
          .map((phoneNumber) => ({ ...phoneNumber, value: phoneNumber.value.trim() }))
          .filter((phoneNumber) => phoneNumber.value),
        savedMessage: 'Contact saved'
      });
    },
    clearSavedMessage(): void {
      patchState(store, { savedMessage: '' });
    }
  }))
);
