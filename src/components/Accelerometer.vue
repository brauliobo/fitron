<template>
  <div>
    Accelerometer
    <p v-for='acc in accData' > {{ acc }} %</p>
  </div>
</template>

<script>
import log from '@/log'

export default {
  data() {
    return {
      accData: [],
    }
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler() {
        this.device.observeAccelerometer().subscribe(acc => this.accData.push(acc))
      }
    }
  },

  methods: {
  }
}
</script>

