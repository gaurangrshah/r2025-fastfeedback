import { auth } from '@/lib/firebase-admin';
import { getUserSites } from '@/lib/db-admin';

export default async (req, res) => {
  try {
    // get user id from token on request headers
    const { uid } = await auth.verifyIdToken(req.headers.token);
    // get all related sites by userId
    const { sites } = await getUserSites(uid);
    res.status(200).json({ sites });
  } catch (error) {
    res.status(500).json({ error });
  }
};
