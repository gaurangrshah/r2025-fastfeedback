import Head from 'next/head';
import {  Button, Code, Flex, Text, Icon, Link } from '@chakra-ui/react';
import { LogoIcon } from '../styles/icons';
import { useAuth } from '@/lib/auth';

const Home = () => {
  const auth = useAuth(); // import auth from our custom hook

  return (
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
        <Button
          variant="link"
          size="sm"
          mt={4}
          size="sm"
          fontWeight="medium"
          onClick={(e) => auth.signinWithGitHub()}
        >
          Sign In
        </Button>
      )}
    </Flex>
  );
};

export default Home;
