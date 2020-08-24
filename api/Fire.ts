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

  getLists(callback) {
    let ref = this.ref.orderBy("name");
    unsubscribe = ref.onSnapshot(snapshot => {
      let lists = []
      snapshot.forEach(doc => {
        lists.push({ id: doc.id, ...doc.data() });
      })

      callback(lists);
    })

  }

  addList(list) {
    let ref = this.ref;
    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;
    ref.doc(list.id).update(list);
  }
  get userId() {
    return firebase.auth().currentUser.email.replace('.', '');
  }

  get ref() {
    return firebase
      .firestore()
      .collection('users')
      .doc(this.userId)
      .collection('lists');
  }

  detach() {
    unsubscribe();
  }

}

export default Fire;