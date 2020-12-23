import {useRef, useState} from 'react'
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import {useRouter} from 'next/router'

import { getAllFeedback, getAllSites } from '@/lib/db-admin';
import { createFeedback } from '@/lib/db';
import Feedback from '@/components/feedback';
import { useAuth } from '@/lib/auth';

export async function getStaticProps(context) {
  const siteId = context.params.siteId;
  // get all feedback related to siteId
  const { feedback } = await getAllFeedback(siteId);
  return {
    props: {
      initialFeedback: feedback, // pass feedback from firestore as props to page component
    },
  };
}

export async function getStaticPaths() {
  const { sites } = await getAllSites();
  const paths = sites.map((site) => ({
    params: {
      siteId: site.id.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

const SiteFeedback = ({ initialFeedback }) => {
  // stores feedback in local state
    const [allFeedback, setAllFeedback] = useState(initialFeedback)

    const auth = useAuth() // used to populate the author info when submitting form
    const router = useRouter() // used to populate siteId when submitting form

    const inputEl = useRef(null); // used to populate the input value when submitting form

    const onSubmit = (e) => {
      e.preventDefault();

      const newFeedback = {
        // create feedback object to set new comment to database as feedback
        author: auth.user.name,
        authorId: auth.user.uid,
        siteId: router.query.siteId,
        text: inputEl.current.value,
        createdAt: new Date().toISOString(),
        provider: auth.user.provider,
        status: 'pending',
      };

      setAllFeedback([newFeedback, ...allFeedback]); // add new comment to local state
      createFeedback(newFeedback); // update database
      inputEl.current.value = ''
    };

  return (
    <Box display="flex" flexDirection="column" width="full" maxWidth="700px" margin="0 auto">
      {auth.user && (
        <Box as="form" onSubmit={onSubmit}>
          <FormControl my={8}>
            <FormLabel htmlFor="comment">Comment</FormLabel>
            <Input ref={inputEl} id="comment" placeholder="Leave a comment" />
            <Button mt={4} type="submit" fontWeight="medium">
              Add Comment
            </Button>
          </FormControl>
        </Box>
      )}
      {allFeedback.map((feedback) => {
        // renders comments from local state
        return <Feedback key={feedback.id} {...feedback} />;
      })}
    </Box>
  );
};

export default SiteFeedback;
