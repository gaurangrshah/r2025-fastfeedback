import Head from 'next/head';
import {  Box, Button, Code, Flex, Text, Link, Stack } from '@chakra-ui/react';

import { LogoIcon, GoogleSigninButton, GithubSigninButton } from '@/styles/icons';
import FeedbackLink from '@/components/feedback-link';
import Feedback from '@/components/feedback';
import { getAllFeedback } from '@/lib/db-admin';
import { useAuth } from '@/lib/auth';

const SITE_ID = 'chjoZ7fFAzZJ9YEM1dGu';

export async function getStaticProps(context) {
  const { feedback } = await getAllFeedback(SITE_ID);

  return {
    props: {
      allFeedback: feedback,
    },
    revalidate: 1,
  };
}

// ❌const Home = () => {
const Home = ({allFeedback}) => {
  const auth = useAuth(); // import auth from our custom hook

  return (
    <>
      <Box bg="gray.100" py={16}>
        <Flex
          as="main"
          direction="column"
          align="center"
          justify="center"
          flex={1}
          mx="auto"
          maxW="400px"
        >
          <Head>
            <script
              // automatically redirects logged in users to dashboard
              dangerouslySetInnerHTML={{
                __html: `
              if (document.cookie && document.cookie.includes('fast-feedback-auth')) {
                window.location.href = "/dashboard"
              }
            `,
              }}
            />
            <title>Fast Feedback</title>
          </Head>
          <LogoIcon boxSize={12} fill="blue.200" />
          <Text mb={4}>
            <Text as="span" fontWeight="bold" display="inline">
              Fast Feedback
            </Text>
            {' is being built as part of '}
            <Link href="https://react2025.com" isExternal textDecoration="underline">
              React 2025
            </Link>
            {`. It's the easiest way to add comments or reviews to your static site. It's still a work-in-progress, but you can try it out by logging in.`}
          </Text>

          {auth?.user ? (
            <>
              <Flex justifyContent="space-between" w="full" mx="auto" mb={4}>
                <Text>Current user:</Text>
                <Code>{auth.user ? auth.user.email : 'None'}</Code>
              </Flex>
              <Flex justifyContent="space-between" w="full" mx="auto">
                <Button as="a" size="sm" fontWeight="medium" href="/dashboard">
                  View Dashboard
                </Button>
                <Button size="sm" fontWeight="medium" onClick={(e) => auth.signout()}>
                  Sign Out
                </Button>
              </Flex>
            </>
          ) : (
            <Stack>
              <Button
                size="lg"
                mt={4}
                fontWeight="medium"
                colorScheme="gray"
                color="gray.900"
                variant="outline"
                leftIcon={<GithubSigninButton />}
                onClick={(e) => auth.signinWithGitHub()}
              >
                Sign In
              </Button>
              <Button
                size="lg"
                mt={4}
                fontWeight="medium"
                colorScheme="gray"
                color="gray.900"
                variant="outline"
                leftIcon={<GoogleSigninButton />}
                onClick={(e) => auth.signinWithGoogle()}
              >
                Sign In
              </Button>
            </Stack>
          )}
        </Flex>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        width="full"
        maxWidth="700px"
        margin="0 auto"
        mt={8}
      >
        <FeedbackLink siteId={SITE_ID} />
        {allFeedback.map((feedback) => (
          <Feedback key={feedback.id} {...feedback} />
        ))}
      </Box>
    </>
  );
};

export default Home;
