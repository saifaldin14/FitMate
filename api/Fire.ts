import firebase from 'firebase';
import '@firebase/firestore';

let unsubscribe;
class Fire {
  constructor(callback) {
    this.init(callback);
  }
  init(callback) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        callback(null, user);
      }
    })
  }

  //Interface for TODO list
  getLists(callback) {
    let ref = this.refList.orderBy("name");
    unsubscribe = ref.onSnapshot(snapshot => {
      let lists = []
      snapshot.forEach(doc => {
        lists.push({ id: doc.id, ...doc.data() });
      })

      callback(lists);
    })

  }

  addList(list) {
    let ref = this.refList;
    ref.add(list);
  }

  updateList(list) {
    let ref = this.refList;
    ref.doc(list.id).update(list);
  }

  //Interface for RUN Data
  getRun(callback) {
    let ref = this.refRun;
    unsubscribe = ref.onSnapshot(snapshot => {
      let runLists = []
      snapshot.forEach(doc => {
        runLists.push({ id: doc.id, ...doc.data() });
      })

      callback(runLists);
    })

  }

  addRun(run) {
    let ref = this.refRun;
    ref.add(run);
  }

  get userId() {
    return firebase.auth().currentUser.email.replace('.', '');
  }

  get refList() {
    return firebase
      .firestore()
      .collection('users')
      .doc(this.userId)
      .collection('lists');
  }

  get refRun() {
    return firebase
      .firestore()
      .collection('users')
      .doc(this.userId)
      .collection('runData');
  }

  detach() {
    unsubscribe();
  }

}

export default Fire;