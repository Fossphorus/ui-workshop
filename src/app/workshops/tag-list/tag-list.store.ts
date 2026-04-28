import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withState, patchState } from '@ngrx/signals';

import { TAG_SCENARIOS } from './tag.fixtures';
import { TagManagerMockService } from './tag-manager.mock-service';
import {
  getTagColor,
  ManagedObject,
  normalizeTagName,
  Tag,
  TAG_COLORS,
  TagColorName,
  TagScenarioId,
  TagSortMode
} from './tag.model';

interface TagListState {
  tags: Tag[];
  object: ManagedObject | null;
  scenarioId: TagScenarioId;
  loading: boolean;
  pickerOpen: boolean;
  createOpen: boolean;
  searchTerm: string;
  sortMode: TagSortMode;
  createName: string;
  createColor: TagColorName;
  saving: boolean;
  toastMessage: string;
  error: string;
}

const initialState: TagListState = {
  tags: [],
  object: null,
  scenarioId: 'few',
  loading: false,
  pickerOpen: false,
  createOpen: false,
  searchTerm: '',
  sortMode: 'name',
  createName: '',
  createColor: 'blue',
  saving: false,
  toastMessage: '',
  error: ''
};

export const TagListStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    scenarios: computed(() => TAG_SCENARIOS),
    colors: computed(() => TAG_COLORS),
    colorMap: computed(() => new Map(TAG_COLORS.map((color) => [color.name, color]))),
    assignedTags: computed(() => {
      const object = store.object();
      if (!object) {
        return [];
      }

      const assigned = new Set(object.tagIds);
      return store.tags().filter((tag) => assigned.has(tag.id));
    }),
    availableTags: computed(() => {
      const object = store.object();
      const assigned = new Set(object?.tagIds ?? []);
      const term = normalizeTagName(store.searchTerm());
      const tags = store.tags().filter((tag) => normalizeTagName(tag.name).includes(term));

      return [...tags].sort((left, right) => {
        if (store.sortMode() === 'color') {
          const colorDelta = getTagColor(left.color).order - getTagColor(right.color).order;
          if (colorDelta !== 0) {
            return colorDelta;
          }
        }

        return left.name.localeCompare(right.name);
      }).map((tag) => ({ tag, attached: assigned.has(tag.id) }));
    }),
    canCreate: computed(() => {
      const normalizedName = normalizeTagName(store.createName());
      return Boolean(normalizedName) && !store.saving();
    }),
    exactNameExists: computed(() => {
      const normalizedName = normalizeTagName(store.createName());
      return store.tags().some((tag) => normalizeTagName(tag.name) === normalizedName);
    })
  })),
  withMethods((store, service = inject(TagManagerMockService)) => ({
    async loadScenario(scenarioId = store.scenarioId()): Promise<void> {
      patchState(store, { scenarioId, loading: true, error: '', toastMessage: '' });

      try {
        const data = await service.loadScenario(scenarioId);
        patchState(store, { tags: data.tags, object: data.object, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: getErrorMessage(error) });
      }
    },
    openPicker(): void {
      patchState(store, { pickerOpen: true, createOpen: false, searchTerm: '', error: '' });
    },
    closePicker(): void {
      patchState(store, { pickerOpen: false, createOpen: false, error: '' });
    },
    setSearchTerm(searchTerm: string): void {
      patchState(store, { searchTerm, createName: store.createName() || searchTerm });
    },
    setSortMode(sortMode: TagSortMode): void {
      patchState(store, { sortMode });
    },
    openCreate(): void {
      patchState(store, {
        createOpen: true,
        createName: normalizeTagName(store.searchTerm()),
        createColor: 'blue',
        error: ''
      });
    },
    closeCreate(): void {
      patchState(store, { createOpen: false, error: '' });
    },
    setCreateName(createName: string): void {
      patchState(store, { createName });
    },
    setCreateColor(createColor: TagColorName): void {
      patchState(store, { createColor });
    },
    clearToast(): void {
      patchState(store, { toastMessage: '' });
    },
    async attachTag(tag: Tag): Promise<void> {
      const object = store.object();
      if (!object || object.tagIds.includes(tag.id)) {
        return;
      }

      patchState(store, { saving: true, error: '' });
      try {
        const updatedObject = await service.attachTag(tag.id);
        patchState(store, {
          object: updatedObject,
          saving: false,
          toastMessage: `"${tag.name}" added`
        });
      } catch (error) {
        patchState(store, { saving: false, error: getErrorMessage(error) });
      }
    },
    async detachTag(tag: Tag): Promise<void> {
      patchState(store, { saving: true, error: '' });
      try {
        const updatedObject = await service.detachTag(tag.id);
        patchState(store, {
          object: updatedObject,
          saving: false,
          toastMessage: `"${tag.name}" removed`
        });
      } catch (error) {
        patchState(store, { saving: false, error: getErrorMessage(error) });
      }
    },
    async createTag(): Promise<void> {
      const normalizedName = normalizeTagName(store.createName());
      if (!normalizedName) {
        return;
      }

      patchState(store, { saving: true, error: '' });
      try {
        const tag = await service.createTag(normalizedName, store.createColor());
        const tags = store.tags().some((item) => item.id === tag.id) ? store.tags() : [...store.tags(), tag];
        patchState(store, { tags });
        const updatedObject = await service.attachTag(tag.id);
        patchState(store, {
          object: updatedObject,
          saving: false,
          createOpen: false,
          createName: '',
          searchTerm: '',
          toastMessage: `"${tag.name}" added`
        });
      } catch (error) {
        patchState(store, { saving: false, error: getErrorMessage(error) });
      }
    }
  }))
);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}
