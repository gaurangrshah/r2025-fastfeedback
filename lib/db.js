import firebase from './firebase';

// initialize firestore
const firestore = firebase.firestore();

export function createUser(uid, data) {
  // creates new user and sets the database with new user
  return (
    firestore
      .collection('users') // db table name
      .doc(uid) // document === userId (uid)
      // add user id, and merge with data already present in database
      .set({ uid, ...data }, { merge: true })
  );
}

export function createSite(data) {
  // sets a new table called sites
  return firestore.collection('sites').add(data);
}
