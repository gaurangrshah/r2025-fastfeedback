import React from 'react';
import {
  Box,
  Button,
  Flex,
  Link,
  Avatar,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { LogoIcon } from '../styles/icons';

import { useAuth } from '@/lib/auth';


const DashboardShell = ({ children }) => {
  const { user, signout } = useAuth();
  return (
    <Box backgroundColor="gray.100" h="100vh">
      <Flex backgroundColor="white" mb={16} w="full" borderTop="5px solid #0AF5F4">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          pt={4}
          pb={4}
          maxW="1250px"
          margin="0 auto"
          w="full"
          px={8}
          h="70px"
        >
          <Flex align="center">
            <NextLink href="/" passHref>
              <Link>
                <LogoIcon name="logo" boxSize={8} mr={8} />
              </Link>
            </NextLink>
            <NextLink href="/dashboard" passHref>
              <Link mr={4}>Sites</Link>
            </NextLink>
            <NextLink href="/feedback" passHref>
              <Link>Feedback</Link>
            </NextLink>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            {user && (
              <NextLink href="/account" passHref>
                <Button as="a" variant="ghost" mr={2}>
                  Account
                </Button>
              </NextLink>
            )}
            <Button onClick={user?.uid && signout}>
              <Avatar size="sm" src={user?.photoUrl}/>
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex margin="0 auto" direction="column" maxW="1250px" px={8}>
        {children}
      </Flex>
    </Box>
  );
};

export default DashboardShell;
