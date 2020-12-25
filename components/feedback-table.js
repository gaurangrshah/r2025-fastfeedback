import { Code, Box, Switch } from '@chakra-ui/react';
import { Table, Tr, Th, Td } from './table';
import DeleteFeedbackButton from './delete-feedback-button';

const FeedbackTable = (props) => {
  return (
    <Table>
      <thead>
        <Tr>
          <Th>Name</Th>
          <Th>Feedback</Th>
          <Th>Route</Th>
          <Th>Visible</Th>
          <Th width="50px">Remove</Th>
        </Tr>
      </thead>
      <tbody>
        {props.feedback.map((feedback) => (
          <Box as="tr" key={feedback.id}>
            <Td fontWeight="medium">{feedback.author}</Td>
            <Td>{feedback.text}</Td>
            <Td>
              <Code>{`/`}</Code>
            </Td>
            <Td>
              <Switch colorScheme="green" defaultIsChecked={feedback.status === 'active'} />
            </Td>
            <Td>
              <DeleteFeedbackButton feedbackId={feedback.id} />
            </Td>
          </Box>
        ))}
      </tbody>
    </Table>
  );
};

export default FeedbackTable;
