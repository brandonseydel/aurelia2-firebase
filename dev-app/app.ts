import { ICustomElementViewModel } from "aurelia";
import { IFireBaseApp, IFireBaseAuth, IFireBaseFirestore, IFireBasePerformance } from "../src/aurelia-firebase";
import { FirebasePerformance } from "../src/firebase-performance";


export class App extends FirebasePerformance implements ICustomElementViewModel {

  constructor(
    @IFireBaseApp private readonly app: IFireBaseApp,
    @IFireBaseAuth private readonly auth: IFireBaseAuth,
    @IFireBaseFirestore private readonly store: IFireBaseFirestore,
    @IFireBasePerformance performance: IFireBasePerformance,

  ) {
    super(performance);
  }

  async attaching() {
    // const user = await this.auth.getRedirectResult();
    // if (user.user?.isAnonymous ?? true) {
    //   await this.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    //   return;
    // }
    // await this.store.collection('test').doc('test').set({
    //   test: 'asfasfd'
    // });


  }

}
