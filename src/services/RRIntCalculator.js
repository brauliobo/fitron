import { Subject } from 'rxjs'

export default class RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    this.device = device
    this.opts = opts
    this.pulsesNumber = opts.rrIntervals || 100
    this.maxRRIntervals = maxRRIntervals

    this.subscription = null
    this.data = []
    this.metricValue = 0

    this.metricSubject = new Subject()

    this.init()
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
    return rri >= 300 && rri <= 2000
  }

  addRrInterval(rri) {
    this.data.push(rri)
    if (this.data.length > this.maxRRIntervals) {
      this.data.shift()
    }
  }

  /**
   * Provides the most recent R-R intervals based on pulsesNumber.
   * Subclasses can access this.recentRrs directly.
   */
  get recentRrs() {
    const n = Math.min(this.pulsesNumber, this.data.length)
    return this.data.slice(-n)
  }

  calculateMetric() {
    throw new Error('calculateMetric() must be implemented by subclass')
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

