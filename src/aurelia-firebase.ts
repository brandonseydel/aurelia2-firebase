/* eslint-disable @typescript-eslint/no-empty-interface */
import { IContainer, IRegistry, Registration, DI, AppTask, IRouter } from 'aurelia';

import firebase from 'firebase/app';


interface FirebaseConfiguration {
  enableMessaging?: boolean;
  enablePerformance?: boolean
  enableStorage?: boolean;
  enableRemoteConfig?: boolean;
  enableFunctions?: boolean;
  enableRealtimeDatabase?: boolean;
  enableAuth?: boolean;
  enableFireStore?: boolean;
  enableAnalytics?: boolean;
  apiKey: string,                             // Auth / General Use
  appId: string,      // General Use
  projectId: string,               // General Use
  authDomain?: string,         // Auth with popup/redirect
  databaseURL?: string, // Realtime Database
  storageBucket?: string,          // Storage
  messagingSenderId?: string,                  // Cloud Messaging
  measurementId?: string,                    // Analytics
}

export interface IFireBaseApp extends firebase.app.App { }
export interface IFireBaseAnalytics extends firebase.analytics.Analytics { }
export interface IFireBaseFunctions extends firebase.functions.Functions { }
export interface IFireBaseAuth extends firebase.auth.Auth { }
export interface IFireBaseFirestore extends firebase.firestore.Firestore { }
export interface IFireBaseMessaging extends firebase.messaging.Messaging { }
export interface IFireBaseStorage extends firebase.storage.Storage { }
export interface IFireBasePerformance extends firebase.performance.Performance { }
export interface IFireBaseDatabase extends firebase.database.Database { }
export interface IFireBaseRemoteConfig extends firebase.remoteConfig.RemoteConfig { }




export const IFireBaseApp = DI.createInterface<IFireBaseApp>('FireBaseApp');
export const IFireBaseAnalytics = DI.createInterface<IFireBaseAnalytics>('FireBaseAnalytics');
export const IFireBaseFunctions = DI.createInterface<IFireBaseFunctions>('FireBaseFunctions');
export const IFireBaseAuth = DI.createInterface<IFireBaseAuth>('FireBaseAuth');
export const IFireBaseFirestore = DI.createInterface<IFireBaseFirestore>('FireBaseFirestore');
export const IFireBaseMessaging = DI.createInterface<IFireBaseMessaging>('FireBaseMessaging');
export const IFireBaseStorage = DI.createInterface<IFireBaseStorage>('FireBaseStorage');
export const IFireBasePerformance = DI.createInterface<IFireBasePerformance>('FireBasePerformance');
export const IFireBaseDatabase = DI.createInterface<IFireBaseDatabase>('FireBaseDatabase');
export const IFireBaseRemoteConfig = DI.createInterface<IFireBaseRemoteConfig>('FireBaseRemoteConfig');

class AureliaFireBase implements IRegistry {

  firebaseConfiguration: FirebaseConfiguration;
  appName?: string;


  public static configure(
    ...args: [config: (config: AureliaFireBase) => void] | [config: FirebaseConfiguration, appName?: string]): AureliaFireBase {
    const instance = new AureliaFireBase();

    if (typeof args[0] === 'function') {
      args[0](instance);
    } else {
      instance.firebaseConfiguration = args[0];
      instance.appName = args[1];
    }
    return instance;
  }

  register(container: IContainer): IContainer {
    const firebaseApp = firebase.initializeApp(this.firebaseConfiguration);
    container = container.register(Registration.instance(IFireBaseApp, firebaseApp));

    container = container.register(AppTask.with(IContainer).beforeCreate().call(async c => {

      if (this.firebaseConfiguration.enableRealtimeDatabase) {
        await import('firebase/database');
        c.register(Registration.instance(IFireBaseDatabase, firebaseApp.database()));
      }

      if (this.firebaseConfiguration.enableAuth) {
        c.register(Registration.instance(IFireBaseAuth, firebaseApp.auth()));
      }

      if (this.firebaseConfiguration.enableAnalytics) {
        await import('firebase/analytics');
        c.register(Registration.instance(IFireBaseAnalytics, firebaseApp.analytics()));
      }

      if (this.firebaseConfiguration.enablePerformance) {
        await import('firebase/performance');
        c.register(Registration.instance(IFireBasePerformance, firebaseApp.performance()));
      }

      if (this.firebaseConfiguration.enableFireStore) {
        await import('firebase/firestore');
        c.register(Registration.instance(IFireBaseFirestore, firebaseApp.firestore()));
      }

      if (this.firebaseConfiguration.enableFunctions) {
        await import('firebase/functions');
        c.register(Registration.instance(IFireBaseFunctions, firebaseApp.functions()));
      }
      if (this.firebaseConfiguration.enableMessaging) {
        await import('firebase/messaging');
        c.register(Registration.instance(IFireBaseMessaging, firebaseApp.messaging()));
      }
      if (this.firebaseConfiguration.enableStorage) {
        await import('firebase/storage');
        c.register(Registration.instance(IFireBaseStorage, firebaseApp.storage()));
      }
      if (this.firebaseConfiguration.enableRemoteConfig) {
        await import('firebase/remote-config');
        c.register(Registration.instance(IFireBaseRemoteConfig, firebaseApp.remoteConfig()));
      }
    }));



    return container;
  }
}

const plugin = AureliaFireBase.configure;

export {
  plugin as AureliaFireBase,
  FirebaseConfiguration,
}
export default plugin;
