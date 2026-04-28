import { TestBed } from '@angular/core/testing';

import { TagManagerMockService } from './tag-manager.mock-service';
import { TagManagerStore } from './tag-manager.store';

describe('TagManagerStore', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [TagManagerMockService, TagManagerStore]
    });

    return TestBed.inject(TagManagerStore);
  }

  it('loads global tags without object context', async () => {
    const store = setup();

    await store.loadTags();

    expect(store.visibleTags().length).toBeGreaterThan(0);
    expect(store.visibleTags().map((tag) => tag.name)).toContain('billing');
  });

  it('creates, edits, and deletes tags', async () => {
    const store = setup();
    await store.loadTags();

    store.openCreate();
    store.setEditorName('  Escalation  ');
    store.setEditorColor('red');
    await store.saveTag();

    const created = store.visibleTags().find((tag) => tag.name === 'escalation');
    expect(created).toBeDefined();

    store.openEdit(created!);
    store.setEditorName('critical escalation');
    store.setEditorColor('orange');
    await store.saveTag();

    const updated = store.visibleTags().find((tag) => tag.name === 'critical escalation');
    expect(updated?.color).toBe('orange');

    await store.deleteTag(updated!);
    expect(store.visibleTags().some((tag) => tag.id === updated!.id)).toBeFalse();
  });

  it('filters by name and sorts by color', async () => {
    const store = setup();
    await store.loadTags();

    store.setSearchTerm('bill');
    expect(store.visibleTags().map((tag) => tag.name)).toEqual(['billing']);

    store.setSearchTerm('');
    store.setSortMode('color');
    expect(store.visibleTags()[0].color).toBe('red');
  });
});
