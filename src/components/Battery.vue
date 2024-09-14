<template>
  <div>
    <p v-if=batteryLevel >Battery: {{ batteryLevel }} %</p>
    <p v-else >No battery level available</p>
  </div>
</template>

<script>
import log from '@/log'

export default {
  data() {
    return {
      batteryLevel: null
    }
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler() {
        this.device.observeBatteryLevel().subscribe(bl => this.batteryLevel = bl)
      }
    }
  },

  methods: {
  }
}
</script>

