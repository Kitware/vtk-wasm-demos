// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import { conesViewerPropertiesFromQuery } from '@/components/ConesViewer/Properties';
import { geometryViewerPropertiesFromQuery } from '@/components/GeometryViewer/Properties';
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/ConesViewer',
    name: 'ConesViewer',
    component: () => import('@/components/ConesViewer/ConesViewer.vue'),
    props: function (route: any) {
      const result = conesViewerPropertiesFromQuery(route.query);
      console.debug("Opening ConesViewer with properties : ", result);
      return result;
    },
  },
  {
    path: '/GeometryViewer',
    name: 'GeometryViewer',
    component: () => import('@/components/GeometryViewer/GeometryViewer.vue'),
    props: function (route: any) {
      const result = geometryViewerPropertiesFromQuery(route.query);
      console.debug("Opening GeometryViewer with properties : ", result);
      return result;
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "FourOhFour",
    component: () => import('@/views/FourOhFour.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
