import {
  Grid,
  Stack,
  Text,
  Heading,
  useColorModeValue,
  Button,
  useToast,
  Table,
  Th,
  Td,
  Thead,
  Tr,
  Tbody,
  TableContainer,
  TableCaption,
  Tfoot,
} from '@chakra-ui/react';
import { FaCopy, FaPlay } from 'react-icons/fa';

import { ImCross } from 'react-icons/im';

export default function WaitingRoom({
  players,
  gameCode,
  yourName,
  clickLeave,
  clickStart,
  gameOwner,
  yourId,
}) {
  const toast = useToast();
  const isOwner = gameOwner === yourId;

  return (
    <Stack spacing={4}>
      <Heading fontSize={'4xl'}>
        Welcome to the Waiting Room, {yourName}
      </Heading>
      <Heading fontSize={'lg'}>
        Game Code: <Text color="red">{gameCode}</Text>
      </Heading>
      <Button
        colorScheme="teal"
        rightIcon={<FaCopy />}
        width="fit-content"
        onClick={() => {
          navigator.clipboard.writeText(`localhost:3000/${gameCode}`);
          toast({
            title: 'Copied to clipboard',
            description: `localhost:3000/${gameCode}`,
            status: 'success',
            duration: 2000,
            isClosable: true,
            icon: <FaCopy />,
          });
        }}
      >
        Copy link
      </Button>
      <Heading fontSize={'lg'}>Players</Heading>
      <TableContainer width={'fit-content'}>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Id</Th>
              <Th>Is game owner</Th>
            </Tr>
          </Thead>
          <Tbody>
            {players.map(player => (
              <Tr fontWeight={player.id === yourId ? 'bold' : 'normal'}>
                <Td>{player.name}</Td>
                <Td>{player.id}</Td>
                <Td>{player.id === gameOwner ? 'yes' : 'no'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {isOwner && (
        <Button
          colorScheme="green"
          rightIcon={<FaPlay />}
          width="fit-content"
          onClick={clickStart}
        >
          Start game!
        </Button>
      )}
      <Button
        colorScheme="red"
        rightIcon={<ImCross />}
        width="fit-content"
        onClick={clickLeave}
      >
        Leave room
      </Button>
    </Stack>
  );
}
