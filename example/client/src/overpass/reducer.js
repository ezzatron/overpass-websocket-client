import {Map} from 'immutable'

import * as actions from './actions'

const init = Map({
  isConnected: false,
  isError: false,
  contexts: Map({}),
  notification: null
})

export default function reducer (state = init, action) {
  const {payload} = action

  switch (action.type) {
    case actions.OVERPASS_CONNECT:
      return state.merge({isConnected: true, isError: false})

    case actions.OVERPASS_DISCONNECT:
      return state.merge({isConnected: false, isError: !!payload})

    case actions.OVERPASS_CONTEXT_READY:
      if (state.hasIn(['contexts', payload.contextId])) {
        return state.setIn(['contexts', payload.contextId, 'isReady'], true)
      }

      return state.setIn(['contexts', payload.contextId], Map({isReady: true, isError: false}))

    case actions.OVERPASS_CONTEXT_ERROR:
      if (state.hasIn(['contexts', payload.contextId])) {
        return state.setIn(['contexts', payload.contextId, 'isReady'], false)
      }

      return state.setIn(['contexts', payload.contextId], Map({isReady: false, isError: true}))

    case actions.OVERPASS_NOTIFICATION:
      return state.set('notification', payload)
  }

  return state
}
