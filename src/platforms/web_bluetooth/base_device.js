import { Observable } from 'rxjs'
import { interval } from 'rxjs'
import { switchMap, startWith } from 'rxjs/operators'

export default class BaseDevice {

  constructor(connection) {
    this.connection = connection
  }

  async getBatteryLevel() {
    const charac = await this.fetchCharac('battery_service', 'battery_level')
    const bl     = await charac.readValue()
    return bl.getUint8(0)
  }

  observeBatteryLevel(intsecs = 5) {
    return interval(intsecs * 1000).pipe(
      startWith(this.getBatteryLevel()),
      switchMap(v => this.getBatteryLevel())
    )
  }

  observeHeartRate() {
    return this.observeNotifications('heart_rate', 'heart_rate_measurement', (sub, event) => {
      sub.next(event.target.value.getUint8(1))
    })
  }

  observeNotifications(service, characteristic, handler) {
    return new Observable(async sub => {
      const charac = await this.fetchCharac(service, characteristic)

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

