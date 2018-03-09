import Component from './component'

function install (Vue, _) {
  Vue.component('LineMetricsView', Component)
}

export default Component
export { install }
