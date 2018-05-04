import View from './components/view'
import Link from './components/link'

export let _MIP

export function install (MIP) {
  if (install.installed && _MIP === MIP) return
  install.installed = true

  _MIP = MIP

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  MIP.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        MIP.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  Object.defineProperty(MIP.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(MIP.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  MIP.component('MipView', View);
  MIP.component('MipLink', Link)

  const strats = MIP.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
