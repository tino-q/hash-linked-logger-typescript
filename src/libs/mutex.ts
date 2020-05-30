export default class Mutex {
  isLocked: boolean;
  queue: (() => void)[];

  constructor() {
    this.isLocked = false;
    this.queue = [];
  }

  lock(callback: () => Promise<void>): void {
    if (this.isLocked) {
      this.queue.push(callback);
    } else {
      this.isLocked = true;
      callback();
    }  
}

  unlock(): void{
    if (!this.isLocked) {
      throw new Error('locked');
    }
    const callback = this.queue.shift();
    if (callback) {
      callback();
    } else {
      this.isLocked = false;
    }
  }
}
