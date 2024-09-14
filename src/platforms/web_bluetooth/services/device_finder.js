import Polar from '../devices/polar.js'

export default class DeviceFinder {

  static fromConnection(connection) {
    let klass

    klass = Polar.matchDevice(connection)

    if (klass) return new klass(connection)
  }

}
