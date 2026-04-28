import { TestBed } from '@angular/core/testing';

import { TagManagerMockService } from './tag-manager.mock-service';
import { TagListStore } from './tag-list.store';

describe('TagListStore', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [TagManagerMockService, TagListStore]
    });

    return TestBed.inject(TagListStore);
  }

  it('loads assigned tags from the selected scenario', async () => {
    const store = setup();

    await store.loadScenario('few');

    expect(store.assignedTags().map((tag) => tag.name)).toEqual(['priority', 'research', 'trial']);
  });

  it('normalizes created tag names before saving and attaches the tag', async () => {
    const store = setup();
    await store.loadScenario('empty');

    store.openPicker();
    store.openCreate();
    store.setCreateName('  VIP Account  ');
    store.setCreateColor('orange');
    await store.createTag();

    expect(store.assignedTags().map((tag) => tag.name)).toContain('vip account');
    expect(store.toastMessage()).toBe('"vip account" added');
  });

  it('keeps already attached tags visible but disabled in the picker model', async () => {
    const store = setup();

    await store.loadScenario('few');

    const priority = store.availableTags().find((item) => item.tag.name === 'priority');
    expect(priority?.attached).toBeTrue();
  });
});
