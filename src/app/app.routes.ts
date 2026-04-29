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
  },
  {
    path: 'edit-user',
    loadComponent: () =>
      import('./workshops/edit-user/edit-user.page').then((m) => m.EditUserPage)
  },
  {
    path: 'edit-contact',
    loadComponent: () =>
      import('./workshops/edit-contact/edit-contact.page').then((m) => m.EditContactPage)
  },
  {
    path: 'edit-job-site',
    loadComponent: () =>
      import('./workshops/edit-job-site/edit-job-site.page').then((m) => m.EditJobSitePage)
  }
];
