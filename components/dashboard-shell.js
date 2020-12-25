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
      <Flex backgroundColor="white" mb={16} w="full">
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

            {/* ❌ <Link mr={4}>Sites</Link>
            <Link>Feedback</Link> */}

            <NextLink href="/dashboard" passHref>
              <Link mr={4}>Sites</Link>
            </NextLink>
            <NextLink href="/feedback" passHref>
              <Link>Feedback</Link>
            </NextLink>

          </Flex>
          <Flex justifyContent="center" alignItems="center">
            {user && (
              <Button variant="ghost" mr={2} onClick={() => signout()}>
                Log Out
              </Button>
            )}
            <Avatar size="sm" src={user?.photoUrl} />
          </Flex>
        </Flex>
      </Flex>
      <Flex margin="0 auto" direction="column" maxW="1250px" px={8}>
        {/* ❌ <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink>Sites</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex justifyContent="space-between">
          <Heading mb={8}>My Sites</Heading>
          <AddSiteModal>+ Add Site</AddSiteModal>
        </Flex> */}
        {children}
      </Flex>
    </Box>
  );
};

export default DashboardShell;
