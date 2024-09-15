export default class Mutex {
  constructor() {
    this.queue = []
    this.locked = false
  }

  lock() {
    const unlock = () => {
      this.locked = false
      if (this.queue.length > 0) {
        const nextUnlock = this.queue.shift()
        nextUnlock()
      }
    };

    if (this.locked) {
      return new Promise(resolve => {
        this.queue.push(() => {
          this.locked = true
          resolve(unlock)
        });
      });
    } else {
      this.locked = true
      return Promise.resolve(unlock)
    }
  }
}

