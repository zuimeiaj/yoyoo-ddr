/**
 * @type {}
 */
export default [
  {
    path: '/',
    component: () => import('@/examples/vseditor'),
  },
  {
    path: '/twowaybind',
    component: () => import('@/examples/twowaybind'),
  },
  {
    path: '/restrict',
    component: () => import('@/examples/restrict'),
  },
]
