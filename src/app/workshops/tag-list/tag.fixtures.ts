import { ManagedObject, Tag, TagScenario, TagScenarioId } from './tag.model';

export const TAG_SCENARIOS: TagScenario[] = [
  { id: 'empty', label: 'No tags', description: 'Object has no attached tags.' },
  { id: 'few', label: 'Few tags', description: 'A compact row with several tags.' },
  { id: 'manyWrapping', label: 'Many wrapping', description: 'Enough attached tags to wrap vertically.' },
  { id: 'longNames', label: 'Long names', description: 'Tags with long names that must truncate.' },
  { id: 'allAttached', label: 'All attached', description: 'Every global tag is already attached.' },
  { id: 'manyGlobal', label: 'Many global', description: 'A large picker list with only a few attached.' },
  { id: 'loading', label: 'Loading', description: 'Initial tag fetch is still pending.' },
  { id: 'createError', label: 'Create error', description: 'Creating a tag returns a service error.' },
  { id: 'attachError', label: 'Attach error', description: 'Attaching a tag returns a service error.' },
  { id: 'detachError', label: 'Detach error', description: 'Detaching a tag returns a service error.' }
];

const baseTags: Tag[] = [
  { id: 'tag-billing', name: 'billing', color: 'blue' },
  { id: 'tag-priority', name: 'priority', color: 'red' },
  { id: 'tag-research', name: 'research', color: 'purple' },
  { id: 'tag-trial', name: 'trial', color: 'green' },
  { id: 'tag-follow-up', name: 'follow up', color: 'orange' },
  { id: 'tag-customer-success', name: 'customer success', color: 'pink' },
  { id: 'tag-compliance', name: 'compliance', color: 'black' },
  { id: 'tag-fiscal-year-planning', name: 'fiscal year planning', color: 'brown' },
  { id: 'tag-contract-renewal', name: 'contract renewal window', color: 'yellow' },
  { id: 'tag-needs-review', name: 'needs review', color: 'darkGrey' },
  { id: 'tag-quiet-account', name: 'quiet account', color: 'lightGrey' },
  { id: 'tag-white-glove', name: 'white glove', color: 'white' }
];

const expandedTags: Tag[] = [
  ...baseTags,
  { id: 'tag-at-risk', name: 'at risk', color: 'red' },
  { id: 'tag-mobile-beta', name: 'mobile beta', color: 'blue' },
  { id: 'tag-data-import', name: 'data import', color: 'green' },
  { id: 'tag-executive-sponsor', name: 'executive sponsor', color: 'purple' },
  { id: 'tag-new-logo', name: 'new logo', color: 'orange' },
  { id: 'tag-partner', name: 'partner', color: 'pink' },
  { id: 'tag-security', name: 'security', color: 'black' },
  { id: 'tag-implementation', name: 'implementation', color: 'brown' },
  { id: 'tag-qbr', name: 'qbr', color: 'yellow' },
  { id: 'tag-low-touch', name: 'low touch', color: 'darkGrey' },
  { id: 'tag-self-service', name: 'self service', color: 'lightGrey' },
  { id: 'tag-referenceable', name: 'referenceable', color: 'white' }
];

export interface TagFixture {
  tags: Tag[];
  object: ManagedObject;
}

export function getTagFixture(scenarioId: TagScenarioId): TagFixture {
  const tagIdsByScenario: Record<TagScenarioId, string[]> = {
    empty: [],
    few: ['tag-priority', 'tag-trial', 'tag-research'],
    manyWrapping: [
      'tag-billing',
      'tag-priority',
      'tag-research',
      'tag-trial',
      'tag-follow-up',
      'tag-customer-success',
      'tag-compliance',
      'tag-contract-renewal',
      'tag-needs-review'
    ],
    longNames: [
      'tag-fiscal-year-planning',
      'tag-contract-renewal',
      'tag-customer-success',
      'tag-white-glove'
    ],
    allAttached: baseTags.map((tag) => tag.id),
    manyGlobal: ['tag-billing', 'tag-priority', 'tag-at-risk'],
    loading: [],
    createError: ['tag-billing'],
    attachError: ['tag-billing'],
    detachError: ['tag-priority', 'tag-trial']
  };

  const tags = scenarioId === 'manyGlobal' ? expandedTags : baseTags;

  return {
    tags,
    object: {
      id: 'user-ada',
      name: 'Ada Lovelace',
      tagIds: tagIdsByScenario[scenarioId]
    }
  };
}
