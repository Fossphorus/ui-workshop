import { TestBed } from '@angular/core/testing';

import { EditUserStore } from './edit-user.store';

describe('EditUserStore', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [EditUserStore]
    });

    return TestBed.inject(EditUserStore);
  }

  it('requires a non-empty username before saving', () => {
    const store = setup();

    store.setUsername('   ');
    store.save();

    expect(store.canSave()).toBeFalse();
    expect(store.savedMessage()).toBe('');
  });

  it('trims the username when saving', () => {
    const store = setup();

    store.setUsername('  grace.hopper  ');
    store.save();

    expect(store.username()).toBe('grace.hopper');
    expect(store.savedMessage()).toBe('User saved');
  });
});
