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
    let ref = firebase
      .firestore()
      .collection('users')
      .doc(this.userId())
      .collection('lists');
    unsubscribe = ref.onSnapshot(snapshot => {
      let lists = []
      snapshot.forEach(doc => {
        lists.push({ id: doc.id, ...doc.data() });
      })

      callback(lists);
    })

  }
  userId() {
    return firebase.auth().currentUser.email.replace('.', '');
  }

  detach() {
    unsubscribe();
  }

}

export default Fire;