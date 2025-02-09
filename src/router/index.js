import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PdfPreview',
      component: () => import('../views/PdfPreviewView.vue'),
    },
  ],
})

export default router
