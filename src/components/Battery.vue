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
      async handler() {
        this.batteryLevel = await this.device.getBatteryLevel()
      }
    }
  },

  methods: {
  }
}
</script>

