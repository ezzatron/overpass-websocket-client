import OverpassConnectionManager from './connection-manager'

export default class OverpassConnectionManagerFactory {
  constructor ({overpassConnection, window, logger}) {
    this._overpassConnection = overpassConnection
    this._logger = logger
    this._window = window
  }

  manager (options = {}) {
    return new OverpassConnectionManager({
      url: options.url,
      overpassConnection: this._overpassConnection,
      delayFn: options.delayFn || this._delayFn,
      window: this._window,
      CBOR: options.CBOR,
      TextDecoder: options.TextDecoder,
      TextEncoder: options.TextEncoder,
      logger: this._logger,
      log: options.log
    })
  }

  _delayFn (disconnects) {
    return Math.min(Math.pow(2, disconnects - 1) * 1000, 32000)
  }
}
