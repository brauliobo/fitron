import { Observable } from 'rxjs'
import { interval } from 'rxjs'
import { switchMap, startWith } from 'rxjs/operators'

import log from '@/log'
import Mutex from './mutex'

export default class BaseDevice {

  constructor(connection) {
    this.connection = connection
    this.services   = {}
    this.characs    = {}
    this.observes   = {}
    this.mutex      = new Mutex
  }

  name() {
    return this.connection.device.name
  }

  disconnect() {
    this.connection.disconnect()
  }

  onDisconnect(handler) {
    this.connection.device.addEventListener('gattserverdisconnected', handler)
  }

  async getBatteryLevel() {
    const charac = await this.fetchCharac('battery_service', 'battery_level')
    const bl     = await charac.readValue()
    return bl.getUint8(0)
  }

  observeBatteryLevel(intsecs = 60) {
    return interval(intsecs * 1000).pipe(
      startWith(this.getBatteryLevel()),
      switchMap(v => this.getBatteryLevel())
    )
  }

  observeHeartRate() {
    return this.observes.hrm ||= this.observeNotifications('heart_rate', 'heart_rate_measurement', {
      handler: (sub, event) => {
        sub.next(event.target.value.getUint8(1))
      }
    })
  }

  observeNotifications(service, charac, {handler, init}) {
    return new Observable(async sub => {
      charac = await this.fetchCharac(service, charac)

      if (init) await init()

      await charac.startNotifications()
      function handleNotifications(event) { handler(sub, event) }
      charac.addEventListener('characteristicvaluechanged', handleNotifications)

      return () => {
        if (charac.isNotifying) charac.stopNotifications()
        charac.removeEventListener('characteristicvaluechanged', handleNotifications)
      }
    })
  }

  async fetchService(service) {
    return this.services[service] ||= await this.connection.getPrimaryService(service)
  }

  async fetchCharac(service, charac) {
    return this.characs[charac] ||= await (await this.fetchService(service)).getCharacteristic(charac)
  }

}

