import RRIntCalculator from './RRIntCalculator'
import { mean, std } from 'mathjs'

export default class CvCalculator extends RRIntCalculator {
  constructor(device, opts, maxRRIntervals = 1000) {
    super(device, opts, maxRRIntervals)
  }

  calculateMetric() {
    if (this.data.length > 0) {
      const meanRR = mean(this.data) // Calculate mean of R-R intervals
      const stdDev = std(this.data, 'uncorrected') // Calculate standard deviation

      // Prevent division by zero
      if (meanRR === 0) {
        this.metricValue = 0
      } else {
        const cv = (stdDev / meanRR) * 100 // Calculate CV as a percentage
        this.metricValue = cv
      }

      // Emit the calculated CV value
      this.metricSubject.next(this.metricValue)
    } else {
      // Handle case with no data
      this.metricValue = 0
      this.metricSubject.next(this.metricValue)
    }
  }
}

