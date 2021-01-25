import { FireMode } from './fire-mode';
import firebase from 'firebase/app';
export interface IFireBindViewModel {
  fireRef: string;
  fireMode: FireMode;
  exists: boolean;
  updatePromises: Promise<void>[];
  databaseReference: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | firebase.database.Reference;
}
