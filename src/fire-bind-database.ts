import firebase from 'firebase';
import { IFireBaseDatabase } from './aurelia-firebase';
import { bindable, inject, Metadata } from "aurelia";
import { ICustomElementViewModel, ICustomElementController } from '@aurelia/runtime-html';
import { FireMode } from './fire-mode';
import { IFireBindViewModel } from './fire-bind-viewmodel';


@inject(IFireBaseDatabase)
export class FireBindDatabase implements ICustomElementViewModel, IFireBindViewModel {
  $controller: ICustomElementController<this>;
  updatePromises = [];


  @bindable public fireRef: string;
  @bindable public fireMode: FireMode = 'live';
  databaseReference: firebase.database.Reference;
  exists: boolean;
  #fireBindRefsToPopulate: { property: string; key: any; }[];

  constructor(@IFireBaseDatabase protected readonly database: IFireBaseDatabase) {
  }

  binding() {
    if (!this.fireRef) { throw 'Make sure the ref has a value'; }

    this.databaseReference = this.database.ref(this.fireRef);
  }

  async attaching() {
    const keys = Object.keys(this.$controller.definition.bindables);
    this.#fireBindRefsToPopulate = keys.map(x => ({ property: x, key: Metadata.get('fire-bind:' + x, this.constructor, x) })).filter(x => x.key);
    const currentRefValues = (await this.databaseReference.once('value'))?.val();
    this.exists = currentRefValues;
    if (this.exists) {
      this.#fireBindRefsToPopulate.forEach(y => {
        this[y.property] = currentRefValues[y.key];
      });
    }

    this.databaseReference.on('child_changed', (snapshot) => {
      this.updateProperties(snapshot);
    });
    this.databaseReference.on('child_removed', (snapshot) => {
      this.updateProperties(snapshot, true);
    });
  }

  private updateProperties(snapshot: firebase.database.DataSnapshot, removed?: boolean) {
    const currentPropKey = this.#fireBindRefsToPopulate.find(y => y.key == snapshot.key);
    if (currentPropKey) {
      this[currentPropKey.property] = removed ? undefined : snapshot.val();
    }
  }

  public async updateValues() {
    const valuesToSend = {};
    this.#fireBindRefsToPopulate.forEach(x => {
      if (this[x.property] !== undefined)
        valuesToSend[x.key] = this[x.property];
    });
    await this.databaseReference.update(valuesToSend);
  }

  async unbinding() {
    await Promise.all(this.updatePromises);
    this.databaseReference?.off();
  }
}
