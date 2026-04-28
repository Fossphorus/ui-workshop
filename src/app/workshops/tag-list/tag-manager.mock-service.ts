import { Injectable } from '@angular/core';

import { getTagFixture } from './tag.fixtures';
import { ManagedObject, normalizeTagName, Tag, TagColorName, TagScenarioId } from './tag.model';

export interface TagWorkshopData {
  tags: Tag[];
  object: ManagedObject;
}

@Injectable()
export class TagManagerMockService {
  private tags: Tag[] = [];
  private object: ManagedObject = { id: '', name: '', tagIds: [] };
  private scenarioId: TagScenarioId = 'few';

  async loadScenario(scenarioId: TagScenarioId): Promise<TagWorkshopData> {
    this.scenarioId = scenarioId;
    const fixture = getTagFixture(scenarioId);
    this.tags = fixture.tags.map((tag) => ({ ...tag }));
    this.object = { ...fixture.object, tagIds: [...fixture.object.tagIds] };

    if (scenarioId === 'loading') {
      await this.delay(700);
    } else {
      await this.delay(120);
    }

    return this.snapshot();
  }

  async attachTag(tagId: string): Promise<ManagedObject> {
    await this.delay(180);
    if (this.scenarioId === 'attachError') {
      throw new Error('Unable to attach tag right now.');
    }

    if (!this.object.tagIds.includes(tagId)) {
      this.object = { ...this.object, tagIds: [...this.object.tagIds, tagId] };
    }

    return { ...this.object, tagIds: [...this.object.tagIds] };
  }

  async detachTag(tagId: string): Promise<ManagedObject> {
    await this.delay(160);
    if (this.scenarioId === 'detachError') {
      throw new Error('Unable to detach tag right now.');
    }

    this.object = {
      ...this.object,
      tagIds: this.object.tagIds.filter((id) => id !== tagId)
    };

    return { ...this.object, tagIds: [...this.object.tagIds] };
  }

  async createTag(name: string, color: TagColorName): Promise<Tag> {
    await this.delay(220);
    if (this.scenarioId === 'createError') {
      throw new Error('Unable to create tag right now.');
    }

    const normalizedName = normalizeTagName(name);
    const existing = this.tags.find((tag) => normalizeTagName(tag.name) === normalizedName);
    if (existing) {
      return existing;
    }

    const tag: Tag = {
      id: `tag-${normalizedName.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || Date.now()}`,
      name: normalizedName,
      color
    };

    this.tags = [...this.tags, tag];
    return tag;
  }

  private snapshot(): TagWorkshopData {
    return {
      tags: this.tags.map((tag) => ({ ...tag })),
      object: { ...this.object, tagIds: [...this.object.tagIds] }
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
