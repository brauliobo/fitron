import H10 from './polar/h10.js'

export default class Polar {

  static services = H10.services

  static matchDevice(connection) {
    if (connection.device.name.includes('Polar H10')) return H10
  }

}
