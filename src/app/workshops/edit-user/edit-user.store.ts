import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export type UserRole = 'admin' | 'tech';

interface EditUserState {
  username: string;
  role: UserRole;
  notes: string;
  savedMessage: string;
}

const initialState: EditUserState = {
  username: 'ada.lovelace',
  role: 'admin',
  notes: 'Primary technical contact for implementation planning.',
  savedMessage: ''
};

export const EditUserStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    roles: computed<UserRole[]>(() => ['admin', 'tech']),
    canSave: computed(() => Boolean(store.username().trim()))
  })),
  withMethods((store) => ({
    setUsername(username: string): void {
      patchState(store, { username, savedMessage: '' });
    },
    setRole(role: UserRole): void {
      patchState(store, { role, savedMessage: '' });
    },
    setNotes(notes: string): void {
      patchState(store, { notes, savedMessage: '' });
    },
    save(): void {
      if (!store.username().trim()) {
        return;
      }

      patchState(store, {
        username: store.username().trim(),
        savedMessage: 'User saved'
      });
    },
    clearSavedMessage(): void {
      patchState(store, { savedMessage: '' });
    }
  }))
);
