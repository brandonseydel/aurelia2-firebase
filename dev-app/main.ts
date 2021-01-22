import { Test } from './test/test';
import { App } from './app';
import Aurelia from 'aurelia';
import AureliaFirebase from '../src/aurelia-firebase';


Aurelia
  .register(
    Test,
    AureliaFirebase({
      apiKey: "AIzaSyA4m2eSxUx5ehsO1MUBsAM50ZvaOn7XC-k",
      authDomain: "devsquad-38d38.firebaseapp.com",
      databaseURL: "https://devsquad-38d38.firebaseio.com",
      projectId: "devsquad-38d38",
      storageBucket: "devsquad-38d38.appspot.com",
      messagingSenderId: "609426139859",
      appId: "1:609426139859:web:0e9e4ddc3d7fece91fc226",
      enableRealtimeDatabase: true
    })
  )
  .app(App)
  .start();
