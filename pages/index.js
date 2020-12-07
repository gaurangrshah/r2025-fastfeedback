import Head from 'next/head';
import { Box, Button, Code, Heading, Text } from '@chakra-ui/react';
import { useAuth } from '@/lib/auth';

const Home = () => {
  const auth = useAuth(); // import auth from our custom hook

  return (
    <Box className="container" bg="blue.200">
      {/*
      the title and favicon are now being rendered from document.js so we've removed them from here.
       */}

      {/* <Head>
        <title>Fast Feedback</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <Box as="main">
        <Heading fontWeight={600}>Fast Feedback</Heading>

        <p>
          Current user: <Code>{auth.user ? auth.user.email : 'None'}</Code>
        </p>

        {/* conditionally show authentication login button only if a user does not already exist */}
        {auth?.user ? (
          <Button onClick={(e) => auth.signout()}>Sign Out</Button>
        ) : (
          <Button onClick={(e) => auth.signinWithGitHub()}>Sign In</Button>
        )}
      </Box>

      <Box as="footer">{/* <p>fast feedback</p> */}</Box>
    </Box>
  );
};

export default Home;
