

import { warn } from './warn'
import Regexp from 'path-to-regexp'

const regexpCompileCache = Object.create(null)

export function fillParams (path, params, routeMsg) {
  try {
    const filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = Regexp.compile(path))
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `missing param for ${routeMsg}: ${e.message}`)
    }
    return ''
  }
}
