import { ICustomElementViewModel } from 'aurelia';
import { fireBind } from '../../src/fire-bind';
import { FireBindFirestore } from '../../src/fire-bind-firestore';

export class FireStore extends FireBindFirestore implements ICustomElementViewModel {

  fireMode = "live" as const;

  @fireBind()
  test = '';
  @fireBind()
  test2: string;
  @fireBind()
  test3: string;
  @fireBind()
  test4: string;

  update() {
    this.updateValues();
  }


}
