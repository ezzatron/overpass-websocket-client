import {EventEmitter} from 'events'

export default class OverpassConnectionManager extends EventEmitter {
  constructor ({url, overpassConnect, delayFn, window}) {
    super()

    this._url = url
    this._overpassConnect = overpassConnect
    this._delayFn = delayFn
    this._window = window

    this._isStarted = false

    this._onOpen = () => {
      console.log('Caught open event')

      this._closeCount = 0
      this.emit('connection', this._connection)
    }

    this._onClose = () => {
      console.log('Caught close event')

      this._disconnect()

      if (!this._window.navigator.onLine) return this._connectWhenOnline()

      ++this._closeCount
      const delay = this._delayFn(this._closeCount)

      console.log('Reconnecting in ' + delay)

      this._reconnectTimeout =
        this._window.setTimeout(this._reconnect, delay)
    }

    this._onOnline = () => {
      console.log('Caught online event')

      this._window.removeEventListener('online', this._onOnline)
      this._connect()
    }

    this._reconnect = () => {
      console.log('Reconnecting')

      delete this._reconnectTimeout
      this._connectWhenOnline()
    }
  }

  start () {
    if (this._isStarted) return

    console.log('Starting')

    this._isStarted = true
    this._closeCount = 0
    this._connectWhenOnline()
  }

  stop () {
    if (!this._isStarted) return

    console.log('Stopping')

    this._isStarted = false

    if (this._reconnectTimeout) {
      console.log('Clearing reconnect timeout')

      this._window.clearTimeout(this._reconnectTimeout)
      delete this._reconnectTimeout
    }

    this._window.removeEventListener('online', this._onOnline)
    this._disconnect()
  }

  _connectWhenOnline () {
    if (this._window.navigator.onLine) return this._connect()

    console.log('Connecting on next online event')

    this._window.addEventListener('online', this._onOnline)
  }

  _connect () {
    console.log('Connecting')

    this._connection = this._overpassConnect(this._url)

    this._connection.once('open', this._onOpen)
    this._connection.once('close', this._onClose)
  }

  _disconnect () {
    if (!this._connection) return

    console.log('Disconnecting')

    this._connection.removeListener('open', this._onOpen)
    this._connection.removeListener('close', this._onClose)

    delete this._connection
  }
}
