

import { ICustomElementViewModel, inject } from "aurelia";
import { IFireBasePerformance } from "./aurelia-firebase";
import firebase from 'firebase/app';

@inject(IFireBasePerformance)
export class FirebasePerformance implements ICustomElementViewModel {
  trace: firebase.performance.Trace;
  constructor(@IFireBasePerformance private readonly performance?: IFireBasePerformance) {
    this.trace = this.performance.trace(FirebasePerformance.name);
    this.trace.start();
  }

  attached() { this.trace.stop(); }
}
