import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../pages/DashboardPage.vue'),
  },
  {
    path: '/admin',
    component: () => import('../pages/AdminDashboardPage.vue'),
  },
  {
    path: '/admin/apps/nieuw',
    component: () => import('../pages/AdminAppFormPage.vue'),
  },
  {
    path: '/admin/apps/:id',
    component: () => import('../pages/AdminAppFormPage.vue'),
  },
  {
    path: '/apps/:id/notes',
    component: () => import('../pages/NotesPage.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
