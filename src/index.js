import Component from './component'

function install (Vue, _) {
  Vue.component('LineMetricsView', Component)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default Component
