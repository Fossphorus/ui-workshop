import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { TagManagerMockService } from './tag-manager.mock-service';
import { getTagColor, normalizeTagName, Tag, TAG_COLORS, TagColorName, TagSortMode } from './tag.model';

interface TagManagerState {
  tags: Tag[];
  loading: boolean;
  searchTerm: string;
  sortMode: TagSortMode;
  editorOpen: boolean;
  editingTagId: string | null;
  editorName: string;
  editorColor: TagColorName;
  deleteConfirmOpen: boolean;
  saving: boolean;
  toastMessage: string;
  error: string;
}

const initialState: TagManagerState = {
  tags: [],
  loading: false,
  searchTerm: '',
  sortMode: 'name',
  editorOpen: false,
  editingTagId: null,
  editorName: '',
  editorColor: 'blue',
  deleteConfirmOpen: false,
  saving: false,
  toastMessage: '',
  error: ''
};

export const TagManagerStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    colors: computed(() => TAG_COLORS),
    visibleTags: computed(() => {
      const term = normalizeTagName(store.searchTerm());
      const filteredTags = store.tags().filter((tag) => normalizeTagName(tag.name).includes(term));

      return [...filteredTags].sort((left, right) => {
        if (store.sortMode() === 'color') {
          const colorDelta = getTagColor(left.color).order - getTagColor(right.color).order;
          if (colorDelta !== 0) {
            return colorDelta;
          }
        }

        return left.name.localeCompare(right.name);
      });
    }),
    editingTag: computed(() => store.tags().find((tag) => tag.id === store.editingTagId()) ?? null),
    editorTitle: computed(() => (store.editingTagId() ? 'Edit tag' : 'Add tag')),
    canSave: computed(() => Boolean(normalizeTagName(store.editorName())) && !store.saving())
  })),
  withMethods((store, service = inject(TagManagerMockService)) => ({
    async loadTags(): Promise<void> {
      patchState(store, { loading: true, error: '', toastMessage: '' });
      try {
        const tags = await service.loadTags();
        patchState(store, { tags, loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: getErrorMessage(error) });
      }
    },
    setSearchTerm(searchTerm: string): void {
      patchState(store, { searchTerm });
    },
    setSortMode(sortMode: TagSortMode): void {
      patchState(store, { sortMode });
    },
    openCreate(): void {
      patchState(store, {
        editorOpen: true,
        editingTagId: null,
        editorName: '',
        editorColor: 'blue',
        error: ''
      });
    },
    openEdit(tag: Tag): void {
      patchState(store, {
        editorOpen: true,
        editingTagId: tag.id,
        editorName: tag.name,
        editorColor: tag.color,
        error: ''
      });
    },
    closeEditor(): void {
      patchState(store, { editorOpen: false, deleteConfirmOpen: false, error: '' });
    },
    setEditorName(editorName: string): void {
      patchState(store, { editorName });
    },
    setEditorColor(editorColor: TagColorName): void {
      patchState(store, { editorColor });
    },
    clearToast(): void {
      patchState(store, { toastMessage: '' });
    },
    openDeleteConfirm(): void {
      if (!store.editingTagId()) {
        return;
      }

      patchState(store, { deleteConfirmOpen: true });
    },
    closeDeleteConfirm(): void {
      patchState(store, { deleteConfirmOpen: false });
    },
    async saveTag(): Promise<void> {
      const name = normalizeTagName(store.editorName());
      if (!name) {
        return;
      }

      patchState(store, { saving: true, error: '' });
      try {
        const editingTagId = store.editingTagId();
        if (editingTagId) {
          const updatedTag = await service.updateTag(editingTagId, name, store.editorColor());
          patchState(store, {
            tags: store.tags().map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)),
            saving: false,
            editorOpen: false,
            toastMessage: `"${updatedTag.name}" updated`
          });
          return;
        }

        const createdTag = await service.createTag(name, store.editorColor());
        const tags = store.tags().some((tag) => tag.id === createdTag.id)
          ? store.tags()
          : [...store.tags(), createdTag];
        patchState(store, {
          tags,
          saving: false,
          editorOpen: false,
          toastMessage: `"${createdTag.name}" added`
        });
      } catch (error) {
        patchState(store, { saving: false, error: getErrorMessage(error) });
      }
    },
    async deleteTag(tag: Tag): Promise<void> {
      patchState(store, { saving: true, error: '' });
      try {
        await service.deleteTag(tag.id);
        patchState(store, {
          tags: store.tags().filter((item) => item.id !== tag.id),
          saving: false,
          editorOpen: false,
          deleteConfirmOpen: false,
          toastMessage: `"${tag.name}" deleted`
        });
      } catch (error) {
        patchState(store, { saving: false, error: getErrorMessage(error) });
      }
    },
    async deleteEditingTag(): Promise<void> {
      const tag = store.tags().find((item) => item.id === store.editingTagId());
      if (!tag) {
        patchState(store, { deleteConfirmOpen: false });
        return;
      }

      patchState(store, { saving: true, error: '' });
      try {
        await service.deleteTag(tag.id);
        patchState(store, {
          tags: store.tags().filter((item) => item.id !== tag.id),
          saving: false,
          editorOpen: false,
          deleteConfirmOpen: false,
          toastMessage: `"${tag.name}" deleted`
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
