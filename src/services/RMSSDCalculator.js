import RRIntCalculator from './RRIntCalculator'
import { sqrt, mean } from 'mathjs'

export default class RmssdCalculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    if (this.data.length >= 2) {
      const n = Math.min(this.pulsesNumber, this.data.length)
      const recentRrs = this.data.slice(-n)
      const differences = recentRrs.slice(1).map((val, i) => val - recentRrs[i])
      const squaredDifferences = differences.map((diff) => diff * diff)
      const meanOfSquares = mean(squaredDifferences)
      const rmssd = sqrt(meanOfSquares)
      this.metricValue = rmssd
      this.metricSubject.next(this.metricValue)
    } else {
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
    }
  }
}

