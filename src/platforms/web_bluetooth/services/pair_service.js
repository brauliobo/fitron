import Polar from '../devices/polar.js'

export default class PairService {

  constructor() {
  }

  async pair() {
    return await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: Polar.services,
    })
  }

}
