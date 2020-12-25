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
  // NOTE: site variable will contain the generated documentid from firebase
    const site = firestore.collection('sites').doc(); // returns a reference to the new site
    site.set(data); // set data from @args to properly facilitate optimistic-ui

    return site;
}


export function createFeedback(data) {
  // sets new record for each user submitted feedback
  return firestore.collection('feedback').add(data);
}

export function deleteFeedback(id) {
  // allows user to remove feedback
  return firestore.collection('feedback').doc(id).delete();
}
