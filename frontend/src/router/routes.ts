import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'voc', component: () => import('pages/VocPage.vue') },
      { path: 'doc', component: () => import('pages/DocPage.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  /*
  {
    path: '/login',
    component: () => import('layouts/LoginMainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },
  */

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
