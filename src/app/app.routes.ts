import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tags'
  },
  {
    path: 'tags',
    loadComponent: () =>
      import('./workshops/tag-list/tag-list.page').then((m) => m.TagListPage)
  }
];
