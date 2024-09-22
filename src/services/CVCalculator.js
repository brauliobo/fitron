import RRIntCalculator from './RRIntCalculator'
import { mean, std } from 'mathjs'

export default class CvCalculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    const recentRrs = this.recentRrs

    if (recentRrs.length > 0) {
      const meanRR = mean(recentRrs)
      const stdDev = std(recentRrs, 'uncorrected')

      if (meanRR === 0) {
        this.metricValue = 0
      } else {
        const cv = (stdDev / meanRR) * 100
        this.metricValue = cv
      }

      this.metricSubject.next(this.metricValue)
    } else {
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
    }
  }
}

