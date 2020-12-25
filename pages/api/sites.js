import { auth } from '@/lib/firebase-admin';
import { getUserSites } from '@/lib/db-admin';
import { logger, formatObjectKeys } from '@/utils/logger';


export default async (req, res) => {
  console.log('🔵', req.headers.token)
  try {
    // get user id from token on request headers
    const { uid } = await auth.verifyIdToken(req.headers.token);
    // get all related sites by userId
    const { sites } = await getUserSites(uid);
    res.status(200).json({ sites });
  } catch (error) {

     logger.error(
       {
         request: {
           headers: formatObjectKeys(req.headers),
           url: req.url,
           method: req.method,
         },
         response: {
           statusCode: res.statusCode,
         },
       },
       error.message
     );

    res.status(500).json({ error });
  }
};
