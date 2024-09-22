import { watch } from 'vue'
import { Subject } from 'rxjs'

export default class RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    this.device = device
    this.opts = opts // Reactive opts object
    this.pulsesNumber = opts.rrIntervals // Number of intervals for calculation
    this.maxRRIntervals = maxRRIntervals // Maximum number of RR intervals to store

    this.subscription = null
    this.data = [] // Array to store RR intervals
    this.metricValue = 0 // Calculated metric value (SDNN or RMSSD)

    this.metricSubject = new Subject() // RxJS Subject to emit metric values

    this.init()

    // Watch for changes in opts.rrIntervals and update pulsesNumber accordingly
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
    } else {
      console.error('Device does not support observeRRInterval().')
    }
  }

  handleRrInterval(rri) {
    if (this.validateRrInterval(rri)) {
      this.addRrInterval(rri)
      this.calculateMetric()
    }
  }

  validateRrInterval(rri) {
    // Valid RR intervals are typically between 300 ms and 2000 ms
    return rri >= 300 && rri <= 2000
  }

  addRrInterval(rri) {
    this.data.push(rri)
    if (this.data.length > this.maxRRIntervals) {
      this.data.shift()
    }
  }

  calculateMetric() {
    // Abstract method to be implemented by subclasses
    throw new Error('calculateMetric() must be implemented by subclass')
  }

  updatePulsesNumber(newPulsesNumber) {
    const clampedNumber = Math.max(2, Math.min(newPulsesNumber, this.maxRRIntervals))
    this.pulsesNumber = clampedNumber
    this.calculateMetric()
  }

  getMetricObservable() {
    return this.metricSubject.asObservable()
  }

  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
    this.metricSubject.complete()
  }
}

