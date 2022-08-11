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
  Avatar,
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
  socketToPoints,
  isMobile,
}) {
  const toast = useToast();
  const isOwner = gameOwner === yourId;

  const sortedPlayers = [...players].sort((a, b) =>
    (socketToPoints[b.id] ?? 0) > (socketToPoints[a.id] ?? 0) ? 1 : -1
  );

  return (
    <Stack spacing={4} justifySelf="center">
      <Heading fontSize={'4xl'}>Waiting Room</Heading>
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
            navigator.clipboard.writeText(window.location.href);
            if (!toast.isActive('copyGameCode')) {
              toast({
                id: 'copyGameCode',
                title: 'Copied to clipboard',
                description: window.location.href,
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
        <Table
          variant="striped"
          size={isMobile || players.length > 4 ? 'sm' : 'md'}
        >
          <Thead>
            <Tr>
              <Th>Picture</Th>
              <Th>Name</Th>
              {/* <Th>Id</Th> */}
              <Th>Owner?</Th>
              {Object.keys(socketToPoints).length !== 0 && <Th>Last score</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {sortedPlayers.map(player => (
              <Tr
                fontWeight={player.id === yourId ? 'bold' : 'normal'}
                key={player.id}
              >
                <Td>
                  <Avatar
                    size={'sm'}
                    src={`https://avatars.dicebear.com/api/pixel-art/${player.id}.svg
                    `}
                    name={player.name}
                  />
                </Td>
                <Td>{player.name}</Td>
                {/* <Td>{player.id}</Td> */}
                <Td>{player.id === gameOwner ? 'yes' : 'no'}</Td>
                {Object.keys(socketToPoints).length !== 0 && (
                  <Td>
                    {socketToPoints[player.id] || '-'}{' '}
                    {socketToPoints[player.id] &&
                      socketToPoints[player.id] ===
                        Math.max(...Object.values(socketToPoints)) &&
                      '🏆'}
                  </Td>
                )}
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
