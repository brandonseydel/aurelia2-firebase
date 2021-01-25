import { ICustomElementViewModel } from 'aurelia';
import { fireBind } from '../../src/fire-bind';
import { FireBindDatabase } from "../../src/fire-bind-database";

export class FireDatabase extends FireBindDatabase implements ICustomElementViewModel {

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
