import { watch } from 'vue'
import { Subject } from 'rxjs'
import { sqrt, mean } from 'mathjs'

export default class RMSSDCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    this.device = device
    this.opts = opts
    this.pulsesNumber = opts.rrIntervals
    this.maxRRIntervals = maxRRIntervals

    this.subscription = null
    this.data = []
    this.rmssdValue = 0

    this.rmssdSubject = new Subject()

    this.init()

    watch(
      () => this.opts.rrIntervals,
      (newVal) => this.updatePulsesNumber(newVal),
      { immediate: true }
    )
  }

  init() {
    if (this.device && this.device.observeRRInterval) {
      this.subscription = this.device
        .observeRRInterval()
        .subscribe((rri) => this.handleRrInterval(rri))
    }
  }

  handleRrInterval(rri) {
    if (this.validateRrInterval(rri)) {
      this.addRrInterval(rri)
      this.calculateRmssd()
    }
  }

  validateRrInterval(rri) {
    return rri >= 300 && rri <= 2000
  }

  addRrInterval(rri) {
    this.data.push(rri)
    if (this.data.length > this.maxRRIntervals) {
      this.data.shift()
    }
  }

  calculateRmssd() {
    if (this.data.length >= 2) {
      const n = Math.min(this.pulsesNumber, this.data.length)
      const recentRrs = this.data.slice(-n)
      const differences = recentRrs.slice(1).map((val, i) => val - recentRrs[i])
      const squaredDifferences = differences.map((diff) => diff * diff)
      const meanOfSquares = mean(squaredDifferences)
      this.rmssdValue = sqrt(meanOfSquares)
      this.rmssdSubject.next(this.rmssdValue)
    } else {
      this.rmssdValue = 0
      this.rmssdSubject.next(this.rmssdValue)
    }
  }

  updatePulsesNumber(newPulsesNumber) {
    const clampedNumber = Math.max(2, Math.min(newPulsesNumber, this.maxRRIntervals))
    this.pulsesNumber = clampedNumber
    this.calculateRmssd()
  }

  getRmssdObservable() {
    return this.rmssdSubject.asObservable()
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
    this.rmssdSubject.complete()
  }
}

