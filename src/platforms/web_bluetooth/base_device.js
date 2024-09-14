import { Observable } from 'rxjs'

export default class BaseDevice {

  constructor(connection) {
    this.connection = connection
  }

  serviceHeartRate() {
    return this.watchNotifications('heart_rate', 'heart_rate_measurement', (sub, event) => {
      const value     = event.target.value
      const heartRate = value.getUint8(1)
      sub.next(heartRate)
    })
  }

  watchNotifications(service, characteristic, handler) {
    return new Observable(async sub => {
      service        = await this.connection.getPrimaryService(service)
      characteristic = await service.getCharacteristic(characteristic)

      await characteristic.startNotifications()
      function handleNotifications(event) { handler(sub, event) }
      characteristic.addEventListener('characteristicvaluechanged', handleNotifications)

      return () => {
        characteristic.stopNotifications()
        characteristic.removeEventListener('characteristicvaluechanged', handleNotifications)
      }
    })
  }

}

