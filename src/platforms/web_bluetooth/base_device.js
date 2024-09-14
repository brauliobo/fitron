import { Observable } from 'rxjs'

export default class BaseDevice {

  constructor(connection) {
    this.connection = connection
  }

  async getBatteryLevel() {
    const charac = await this.fetchCharac('battery_service', 'battery_level')
    const bl   = await charac.readValue()
    return bl.getUint8(0)
  }

  observeHeartRate() {
    return this.watchNotifications('heart_rate', 'heart_rate_measurement', (sub, event) => {
      sub.next(event.target.value.getUint8(1))
    })
  }

  watchNotifications(service, characteristic, handler) {
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

