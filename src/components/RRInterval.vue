<template>
  <div>
    <p v-if=lastRRInterval >R-R Interval: {{ Math.round(lastRRInterval) }}ms </p>
    <p v-else >No R-R Interval available</p>
    
    <div>
      <label for=rrIntervals > Number of R-R Intervals for metrics </label>
      <input type=number name=rrIntervals v-model.number=opts.rrIntervals :min=2 :max=1000 />
    </div>
  </div>
</template>

<script>
import log from '@/log'
import { opts } from '../services/store'

export default {
  data() {
    return {
      lastRRInterval: null,
      opts, opts,
    }
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler() {
        this.device.observeRRInterval().subscribe(rri => this.lastRRInterval = rri)
      }
    }
  },

  methods: {
  }
}
</script>

