import { IFireBaseFirestore } from './aurelia-firebase';
import firebase from 'firebase';
import { bindable, inject, Metadata } from "aurelia";
import { ICustomElementViewModel, ICustomElementController } from '@aurelia/runtime-html';
import { FireMode } from './fire-mode';
import { IFireBindViewModel } from './fire-bind-viewmodel';


@inject(IFireBaseFirestore)
export class FireBindFirestore implements ICustomElementViewModel, IFireBindViewModel {
  $controller: ICustomElementController<this>;
  updatePromises = [];


  @bindable public fireRef: string;
  @bindable public fireMode: FireMode = 'live';
  databaseReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  #fireBindRefsToPopulate: { property: string; key: any; }[];
  unsubscribe: () => void;
  exists: boolean;

  constructor(@IFireBaseFirestore protected readonly database: IFireBaseFirestore) {
  }

  binding(): void {
    if (!this.fireRef) { throw 'Make sure the ref has a value'; }
    this.databaseReference = this.database.doc(this.fireRef);
  }

  async attaching(): Promise<void> {
    const keys = Object.keys(this.$controller.definition.bindables);
    this.#fireBindRefsToPopulate = keys.map(x => ({ property: x, key: Metadata.get('fire-bind:' + x, this.constructor, x) })).filter(x => x.key);

    const documentData = (await this.databaseReference.get()).data();
    this.exists = !!documentData;

    if (documentData) {
      this.#fireBindRefsToPopulate.forEach(y => {
        this[y.property] = documentData[y.key];
      });
    }

    if (this.fireMode === 'live') {
      this.unsubscribe = this.databaseReference.onSnapshot({
        next: (data) => {
          this.exists = data.exists;
          if (data.exists && !data.metadata.hasPendingWrites) {
            this.updateProperties(data.data());
          }
        }
      });
    }
  }

  private updateProperties(snapshot?: firebase.firestore.DocumentData) {
    const documentKeys = Object.keys(snapshot);
    documentKeys.filter(y => snapshot[y] !== this[y]).forEach(y => {
      this[y] = !snapshot ? undefined : snapshot[y];
    });
  }

  public async updateValues(): Promise<void> {
    const valuesToSend = {};
    this.#fireBindRefsToPopulate.forEach(x => {
      if (this[x.property] !== undefined)
        valuesToSend[x.key] = this[x.property];
    });
    await this.databaseReference.update(valuesToSend);
  }

  async unbinding(): Promise<void> {
    await Promise.all(this.updatePromises);
    this.unsubscribe && this.unsubscribe();
  }
}
