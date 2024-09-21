<template>
  <div>
    <p v-if=rrInterval >R-R Interval: {{ Math.round(rrInterval) }}ms </p>
    <p v-else >No R-R Interval available</p>
  </div>
</template>

<script>
import log from '@/log'

export default {
  data() {
    return {
      rrInterval: null
    }
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler() {
        this.device.observeRRInterval().subscribe(rri => this.rrInterval = rri)
      }
    }
  },

  methods: {
  }
}
</script>

