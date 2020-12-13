import db from '@/lib/firebase-admin';

export default async (_, res) => {
  // grab items from sites tab;e
  const snapshot = await db.collection('sites').get();
  const sites = [];

  snapshot.forEach((doc) => {
    // add each site to the array of sites to be returned to client-side
    sites.push({ id: doc.id, ...doc.data() });
  });

  // return sites table as json
  res.status(200).json({ sites });
};
