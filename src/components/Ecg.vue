<template>
  <div>
    <h4> ECG </h4>
    <p v-for='p in ecgData' > {{ p }} </p>
  </div>
</template>

<script>
import log from '@/log'

export default {
  data() {
    return {
      ecgData: [],
    }
  },
  props: ['device'],

  watch: {
    device: {
      immediate: true,
      handler() {
        this.device.observeEcg().subscribe(ecg => this.ecgData.push(ecg))
      }
    }
  },

  methods: {
  }
}
</script>

