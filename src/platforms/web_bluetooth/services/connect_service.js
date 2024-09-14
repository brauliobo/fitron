import log from '@/log'
import DeviceFinder from '../services/device_finder.js'

export default class ConnectService {

  constructor() {
  }

  async connect(pairedDevice, maxRetries = 3, delay = 1000) {
    return new Promise(async resolve => { 
      let retries = 0
      while (retries < maxRetries) {
        try {
          let connection = await pairedDevice.gatt.connect()
          log.debug('ConnectService: got connection', connection)
          let device = DeviceFinder.fromConnection(connection)
          log.debug('ConnectService: got device', device)
          return resolve(device)
        } catch (error) {
          retries++
          if (retries < maxRetries) {
            log.debug(`ConnectService: retrying connection in ${delay / 1000} seconds...`)
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }
    })
  }
}

