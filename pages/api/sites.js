// import db from '@/lib/firebase-admin';
import { getAllSites } from '@/lib/db-admin';

export default async (_, res) => {

  // ❌ abstracted to db-admin
  // // grab items from sites tab;e
  // const snapshot = await db.collection('sites').get();
  // const sites = [];

  // snapshot.forEach((doc) => {
  //   // add each site to the array of sites to be returned to client-side
  //   sites.push({ id: doc.id, ...doc.data() });
  // });

  const sites = await getAllSites()

  // return sites table as json
  res.status(200).json({ sites });
};
