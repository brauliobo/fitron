import RRIntCalculator from './RRIntCalculator'
import { std } from 'mathjs'

export default class SdnnCalculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    if (this.data.length >= 2) {
      const n = Math.min(this.pulsesNumber, this.data.length)
      const recentRrs = this.data.slice(-n)
      const sdnn = std(recentRrs, 'uncorrected')
      this.metricValue = sdnn
      this.metricSubject.next(this.metricValue)
    } else {
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
    }
  }
}

