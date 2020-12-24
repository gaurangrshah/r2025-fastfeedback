import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import {mutate} from 'swr'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Button,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { useAuth } from '@/lib/auth';
import { createSite } from '@/lib/db';

const AddSiteModal = ({children}) => {
  const initialRef = useRef();
  const auth = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, register } = useForm();

  const onCreateSite = ({ name, url }) => {
    const newSite = {
       authorId: auth.user.uid,
       createdAt: new Date().toISOString(),
       name,
       url
     };
    createSite({
      // setup initialized fields author and date:
      authorId: auth.user.uid,
      createdAt: new Date().toISOString(),
      // add user input fields:
      name,
      url,
    });

    // adds toast success response
    toast({
      title: 'Success!',
      description: "We've added your site.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    // used to refetch queries after updates
    mutate(
      // refetch the cached sites
      ['/api/sites', auth.user.token],
      async (data) => {
        // take the cached sites and manually update with newSite
        return { sites: [...data.sites, newSite] };
        // ☝️ This is client side only -- so a document id will not yet be available
      },
      false
    );

    onClose(); // close modal when completed.
  };

  return (
    <>
      <Button
        onClick={onOpen}
        backgroundColor="gray.900"
        color="white"
        fontWeight="medium"
        _hover={{ bg: 'gray.700' }}
        _active={{
          bg: 'gray.800',
          transform: 'scale(0.95)',
        }}
      >
        {children}
      </Button>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onCreateSite)}>
          <ModalHeader fontWeight="bold">Add Site</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} maxW="80%">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="My site"
                name="name"
                ref={register({
                  required: 'Required',
                })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Link</FormLabel>
              <Input
                placeholder="https://website.com"
                name="url"
                ref={register({
                  required: 'Required',
                })}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} fontWeight="medium">
              Cancel
            </Button>
            <Button backgroundColor="#99FFFE" color="#194D4C" fontWeight="medium" type="submit">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddSiteModal;
