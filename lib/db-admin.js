import { compareDesc, parseISO } from 'date-fns';

import { db } from './firebase-admin';

export async function getAllFeedback(siteId) {
  try {
    // get all feedback related to site, based on siteId
    const snapshot = await db.collection('feedback').where('siteId', '==', siteId).get();
    const feedback = [];

    snapshot.forEach((doc) => {
      // push feedback values to array
      feedback.push({ id: doc.id, ...doc.data() });
    });

    // sort feedback in descending order so that comments are rendered based on date
    feedback.sort((a, b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt)));
    return { feedback };
  } catch (error) {
    return { error };
  }
}

export async function getUserFeedback(uid) {
  const snapshot = await db.collection('feedback').where('authorId', '==', uid).get();

  const feedback = [];

  snapshot.forEach((doc) => {
    feedback.push({ id: doc.id, ...doc.data() });
  });

  return { feedback };
}

export async function getAllSites() {
  // grab items from sites tab;e
  const snapshot = await db.collection('sites').get();
  const sites = [];

  snapshot.forEach((doc) => {
    // add each site to the array of sites to be returned to client-side
    sites.push({ id: doc.id, ...doc.data() });
  });
  return { sites };

}

export async function getUserSites(uid) {
  const snapshot = await db.collection('sites').where('authorId', '==', uid).get();

  const sites = [];

  snapshot.forEach((doc) => {
    sites.push({ id: doc.id, ...doc.data() });
  });

    sites.sort((a, b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt)));

  return { sites };
}
