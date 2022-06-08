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
  IconButton,
  HStack,
  ButtonGroup,
} from '@chakra-ui/react';
import { FaCopy, FaPlay, FaRegCopy } from 'react-icons/fa';

import { ImCopy, ImCross } from 'react-icons/im';

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
  console.log('yourId', yourId);

  return (
    <Stack spacing={4} justifySelf="center">
      <Heading fontSize={'4xl'}>
        Welcome to the Waiting Room, {yourName}
      </Heading>
      <HStack>
        <Heading fontSize={'lg'}>Game Code:</Heading>
        <Heading fontSize={'lg'} color="red">
          {gameCode}
        </Heading>
        <IconButton
          // colorScheme="teal"
          icon={<FaCopy />}
          width="fit-content"
          size={'sm'}
          onClick={() => {
            navigator.clipboard.writeText(`localhost:3000/${gameCode}`);
            if (!toast.isActive('copyGameCode')) {
              toast({
                id: 'copyGameCode',
                title: 'Copied to clipboard',
                description: `localhost:3000/${gameCode}`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                icon: <FaCopy />,
              });
            }
          }}
        />
      </HStack>

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
              <Tr
                fontWeight={player.id === yourId ? 'bold' : 'normal'}
                key={player.id}
              >
                <Td>{player.name}</Td>
                <Td>{player.id}</Td>
                <Td>{player.id === gameOwner ? 'yes' : 'no'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <ButtonGroup>
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
      </ButtonGroup>
    </Stack>
  );
}
