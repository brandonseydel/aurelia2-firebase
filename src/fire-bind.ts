/* eslint-disable @typescript-eslint/ban-types */
import firebase from 'firebase';
import { bindable, Metadata } from "aurelia";
import { BindableObserver } from '@aurelia/runtime-html'
import { IFireBindViewModel } from './fire-bind-viewmodel';
export function fireBind(ref?: string): (...args: any) => void {
  return function (targetClass: {}, propertyKey: string) {
    bindable({
      set: function (val) {
        const currentViewModel = this?.obj as IFireBindViewModel;
        if (currentViewModel?.fireMode != 'live') return val;
        if (currentViewModel?.databaseReference && val !== undefined && val != this.currentValue) {

          if (!currentViewModel.exists) {
            currentViewModel.databaseReference.set({ [ref || propertyKey]: val });
            return val;
          }
          currentViewModel.databaseReference.update({ [ref || propertyKey]: val });
          return val;
        }
      }
    })(targetClass, propertyKey);
    Metadata.define('fire-bind:' + propertyKey, ref || propertyKey, targetClass.constructor, propertyKey)
  }
}




