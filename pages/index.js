import Head from 'next/head';
import { Box, Button, Code, Flex, Heading, Text } from '@chakra-ui/react';
import { LogoIcon } from '../styles/icons';
import { useAuth } from '@/lib/auth';

const Home = () => {
  const auth = useAuth(); // import auth from our custom hook

  return (
    <>
      <Head>
        <title>Fast Feedback</title>
      </Head>
      <Flex
        as="main"
        direction="column"
        mx="auto"
        align="center"
        justify="center"
        flex={1}
        maxW="300px"
      >
        <LogoIcon boxSize={12} fill="blue.200" />
        {auth?.user ? (
          <>
            <Text>
              Current user: <Code>{auth.user ? auth.user.email : 'None'}</Code>
            </Text>
            <Button onClick={(e) => auth.signout()}>Sign Out</Button>
          </>
        ) : (
          <Button variant="link" size="sm" onClick={(e) => auth.signinWithGitHub()}>Sign In</Button>
        )}
      </Flex>

      <Box as="footer">{/* <p>fast feedback</p> */}</Box>
    </>
  );
};

export default Home;
