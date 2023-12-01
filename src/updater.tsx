import { hass } from "./utils";

class Updater {
  timeout = 0;
  isUpdating = false;
  shouldUpdate = false;
  states = {};
  callback: (states: any) => void = () => {};

  constructor() {
    this.update();
  }

  start() {
    this.shouldUpdate = true;
    this.update();
  }

  stop() {
    this.shouldUpdate = false;
    clearTimeout(this.timeout);
  }

  update() {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;
    clearTimeout(this.timeout);

    hass("get", "states")
      .then((rawStates: any[]) => {
        this.states = rawStates.reduce(
          (acc, state: any) => ({
            ...acc,
            [state.entity_id]: state.state === "on",
          }),
          {} as Record<string, boolean>
        );

        this.callback(this.states);
      })
      .finally(() => {
        this.isUpdating = false;

        if (this.shouldUpdate) {
          this.timeout = window.setTimeout(() => this.update(), 3000);
        }
      });
  }

  setCallback(callback: (states: any) => void) {
    this.callback = callback;
  }
}

const updater = new Updater();

export default updater;
