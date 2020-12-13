import React from 'react';
import { Heading, Flex, Text, Button } from '@chakra-ui/react';

 import DashboardShell from './dashboard-shell';
 import AddSiteModal from './add-site-modal';

 const EmptyState = () => (
  //❌  <DashboardShell>

     <Flex
       width="100%"
       backgroundColor="white"
       borderRadius="8px"
       p={16}
       justify="center"
       align="center"
       direction="column"
     >
       <Heading size="lg" mb={2}>
         You haven’t added any sites.
       </Heading>
       <Text mb={4}>Let’s get started.</Text>
       {/* ❌ <AddSiteModal /> */}
       <AddSiteModal> + Add Site</AddSiteModal>
     </Flex>

  //  </DashboardShell>
 );

 export default EmptyState;