import log from '@/log'
import BaseDevice from '../../base_device.js'

const PMD_SERVICE = 'fb005c80-02e7-f387-1cad-8acd2d8df0c8'
const PMD_CONTROL = 'fb005c81-02e7-f387-1cad-8acd2d8df0c8'
const PMD_DATA    = 'fb005c82-02e7-f387-1cad-8acd2d8df0c8'

export default class H10 extends BaseDevice {

  static services = [
    '00001800-0000-1000-8000-00805f9b34fb',
    '00001801-0000-1000-8000-00805f9b34fb',
    '0000180a-0000-1000-8000-00805f9b34fb',
    '0000180d-0000-1000-8000-00805f9b34fb',
    '0000180f-0000-1000-8000-00805f9b34fb',
    '0000feee-0000-1000-8000-00805f9b34fb',
    '6217ff4b-fb31-1140-ad5a-a45545d7ecf3',
    PMD_SERVICE,
  ]

  static chars = [
    PMD_CONTROL,
    PMD_DATA,
  ]

  static ECG_START = new Uint8Array([0x02, 0x00, 0x00, 0x01, 0x82, 0x00, 0x01, 0x01, 0x0E, 0x00])

  observeEcg() {
    return this.observeNotifications(PMD_SERVICE, PMD_DATA, {
      init: (svc, charac) => {
        return this.observeNotifications(svc, PMD_CONTROL, {
          init: async (svc, charac) => {
            await charac.writeValue(ECG_START)
          },
          handler: (sub, event) => {
            const response = new Uint8Array(event.currentTarget.value.buffer)
            log.debug('H10/ecg/control', response)
          },
        })
      },
      handler: (sub, event) => {
        const dataView  = event.target.value // event.target.value is a DataView
        const dataArray = new Uint8Array(dataView.buffer)
        const DataType  = dataArray[0] // First byte indicates the data type (ECG, ACC, etc.)

        if (DataType === 0) { // ECG data type
          const samples = dataArray.slice(10) // Get the ECG samples (skip header bytes)
          const npoints = samples.length / 3
          const ECGdata = Array(npoints)

          for (let offset = 0; offset < samples.length; offset += 3) {
            const i = offset / 3
            ECGdata[i] = this.wordstoSignedInteger(samples.slice(offset, offset + 2), 8)
          }

          sub.next(ECGdata)
        }
      },
    })
  }

  static acc_timestep = 1000 / 200; // Assuming 200Hz sampling rate
  static acc_range    = 0x04; //hex(2) for range of 2G - 4 and 8G available
  static acc_rate     = 0xC8; //hex(200) for sampling freqency of 200Hz
  static acc2_rate    = 416;  //0xA0;//acc2_rate=208;//26Hz, 52Hz, 104Hz, 208Hz, 416Hz
  static acc_res      = 0x10; //hex(16) 16bit resolution
  static ACC_START    = new Uint8Array([0x02, 0x01, 0x04, 0x00, 0x00, 0x01, 0xC8, 0x00, 0x01, 0x01, 0x10, 0x00])

  observeAccelerometer() {
    const controlCharac = this.fetchCharac(PMD_SERVICE, PMD_CONTROL)

    return this.observeNotifications(PMD_SERVICE, PMD_DATA, {
      init: (svc, charac) => {
        return this.observeNotifications(svc, PMD_CONTROL, {
          init: async (svc, charac) => {
            await charac.writeValue(ACC_START)
          },
          handler: (sub, event) => {
            const response = new Uint8Array(event.currentTarget.value.buffer)
            log.debug('H10/acc/control', response)
          },
        })
      },
      handler: (sub, event) => {
        const data = event.target.value.buffer
        const dataType = new Uint8Array(data.slice(0, 1))[0]

        if (dataType === 2) {  // Accelerometer data type
          const frameType = new Uint8Array(data.slice(9, 10))[0]
          const resolution = (frameType + 1) * 8
          const step = resolution / 8

          // Process the accelerometer data
          const samples = new Int16Array(data.slice(10))
          const npoints = samples.byteLength / 2
          const acc = Array.from({ length: npoints / 3 }, (_, i) => {
            const x = samples[i * 3]
            const y = samples[i * 3 + 1]
            const z = samples[i * 3 + 2]
            return { x, y, z }
          });

          sub.next(acc)
        }
      },
    })
  }

  // Helper function to convert bytes to signed integers
  wordstoSignedInteger(words, BitsPerWord) {
    let val = 0;
    const word_val = 2 ** BitsPerWord;
    for (let i = 0; i < words.length; i += 1) {
      val += words[i] * word_val ** i;
    }
    const bits = words.length * BitsPerWord;
    if (val > 2 ** (bits - 1)) {
      val = val - 2 ** bits;
    }
    return val;
  }

}

