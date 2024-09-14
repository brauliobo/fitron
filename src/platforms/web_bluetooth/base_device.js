import { Observable } from 'rxjs'
import { interval } from 'rxjs'
import { switchMap, startWith } from 'rxjs/operators'

import log from '@/log'

export default class BaseDevice {

  constructor(connection) {
    this.connection = connection
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
    return this.observeNotifications('heart_rate', 'heart_rate_measurement', {
      handler: (sub, event) => {
        sub.next(event.target.value.getUint8(1))
      }
    })
  }

  observeNotifications(service, charac, {handler, init}) {
    return new Observable(async sub => {
      if (typeof(service) == 'string') service = await this.connection.getPrimaryService(service)
      if (typeof(charac)  == 'string') charac  = await service.getCharacteristic(charac)

      if (init) await init(service, charac)

      await charac.startNotifications()
      function handleNotifications(event) { handler(sub, event) }
      charac.addEventListener('characteristicvaluechanged', handleNotifications)

      return () => {
        charac.stopNotifications()
        charac.removeEventListener('characteristicvaluechanged', handleNotifications)
      }
    })
  }

  async fetchCharac(service, characteristic) {
    service = await this.connection.getPrimaryService(service)
    return await service.getCharacteristic(characteristic)
  }

}

