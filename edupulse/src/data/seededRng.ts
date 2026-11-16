export function createRng(seed: number) {
  let a = seed;
  return {
    next() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    },
    int(min: number, max: number) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    float(min: number, max: number, decimals?: number) {
      const val = this.next() * (max - min) + min;
      return decimals !== undefined ? parseFloat(val.toFixed(decimals)) : val;
    },
    pick<T>(arr: T[]): T {
      return arr[this.int(0, arr.length - 1)];
    },
    normal(mean: number, stddev: number) {
      let u = 1 - this.next();
      let v = this.next();
      let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return z * stddev + mean;
    },
    bool(probability: number = 0.5) {
      return this.next() < probability;
    },
    shuffle<T>(arr: T[]): T[] {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = this.int(0, i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  };
}
