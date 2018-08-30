
export default [
  { path: '/', redirect: '/dashboard' },

  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: 'redirect', name: 'redirect', component: () => import('pages/Redirect') }
    ],
    meta: {
      requiresAuth: true,
      requiresREAL: false
    }
  },

  {
    path: '/',
    component: () => import('layouts/real'),
    children: [
      { path: 'dashboard', name: 'realdashboard', component: () => import('pages/RDashboard') },
      { path: 'list/:type', name: 'rlist', component: () => import('pages/RList') },
      { path: 'series/:seriesid', name: 'series', component: () => import('pages/RSeries') },
      { path: 'series/:seriesid/lesson/:lessonid', name: 'lesson', component: () => import('pages/RLesson') },
      { path: 'series/:seriesid/lesson/:lessonid/research', name: 'research', component: () => import('pages/RResearch') },
      { path: 'series/:seriesid/lesson/:lessonid/guide', name: 'guide', component: () => import('pages/RGuide') },
      { path: 'series/:seriesid/lesson/:lessonid/review', name: 'review', component: () => import('pages/RReview') },
      { path: 'series/:seriesid/lesson/:lessonid/devo/:devoid', name: 'devo', component: () => import('pages/RDevo') },
      { path: 'settings', name: 'rsettings', component: () => import('pages/Settings') }
    ],
    meta: {
      requiresAuth: true,
      requiresREAL: true
    }
  },

  {
    path: '/login',
    component: () => import('layouts/default'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Login') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
