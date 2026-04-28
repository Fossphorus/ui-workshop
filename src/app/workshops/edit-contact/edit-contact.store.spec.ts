import { TestBed } from '@angular/core/testing';

import { EditContactStore } from './edit-contact.store';

describe('EditContactStore', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [EditContactStore]
    });

    return TestBed.inject(EditContactStore);
  }

  it('adds and removes phone numbers', () => {
    const store = setup();

    store.addPhoneNumber();
    const added = store.phoneNumbers().at(-1);
    expect(added).toBeDefined();

    store.updatePhoneNumber(added!.id, '555-0199');
    expect(store.phoneNumbers().at(-1)?.value).toBe('555-0199');

    store.removePhoneNumber(added!.id);
    expect(store.phoneNumbers().some((phoneNumber) => phoneNumber.id === added!.id)).toBeFalse();
  });

  it('requires a first or last name before saving', () => {
    const store = setup();

    store.setFirstName(' ');
    store.setLastName(' ');
    store.save();

    expect(store.canSave()).toBeFalse();
    expect(store.savedMessage()).toBe('');
  });
});
