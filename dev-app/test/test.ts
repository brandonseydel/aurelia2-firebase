import { ICustomElementViewModel } from 'aurelia';
import { FireBind, fireBind } from '../../src/fire-bind';

export class Test extends FireBind implements ICustomElementViewModel {

  fireMode = "submit" as const;

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
