import { auth } from '@/lib/firebase-admin';
import { getUserFeedback } from '@/lib/db-admin';

export default async (req, res) => {
  try {
    // get user id from token on request headers
    const { uid } = await auth.verifyIdToken(req.headers.token);
    // get all related feedback by userId
    const { feedback } = await getUserFeedback(uid);

    res.status(200).json({ feedback });
  } catch (error) {
    res.status(500).json({ error });
  }
};
