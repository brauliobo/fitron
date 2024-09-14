import BaseDevice from '../../base_device.js'

export default class H10 extends BaseDevice {

  static services = [
    '00001800-0000-1000-8000-00805f9b34fb',
    '00001801-0000-1000-8000-00805f9b34fb',
    '0000180a-0000-1000-8000-00805f9b34fb',
    '0000180d-0000-1000-8000-00805f9b34fb',
    '0000180f-0000-1000-8000-00805f9b34fb',
    '0000feee-0000-1000-8000-00805f9b34fb',
    '6217ff4b-fb31-1140-ad5a-a45545d7ecf3',
    'fb005c80-02e7-f387-1cad-8acd2d8df0c8',
  ]

}

