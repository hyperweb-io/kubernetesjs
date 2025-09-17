export interface State {
  value: number;
}

export default class Contract {
  state: State;

  constructor() {
    console.log("[Contract] constructor called");
  }

  reset() {
    console.log("[Contract] reset called");
    this.state.value = 0;
  }

  init(): number {
    console.log("[Contract] init called");
    this.state.value = 0;
    return this.state.value;
  }

  inc(x: number): number {
    console.log("[Contract] inc called");
    this.state.value += x;
    return this.state.value;
  }

  dec(x: number) {
    console.log("[Contract] dec called");
    this.state.value -= x;
  }

  read() {
    console.log("[Contract] read called");
    return this.state.value;
  }
}
