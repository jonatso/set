import {
  Grid,
  Button,
  Avatar,
  HStack,
  Stack,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  VStack,
  ButtonGroup,
  Heading,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import GameCard from './GameCard';
import GameLog from './GameLog';
import { ImCross } from 'react-icons/im';
import { FaCopy } from 'react-icons/fa';

export default function GameGrid({
  board,
  statusText,
  selected,
  toggleCard,
  cheatSelect,
  semiCheatSelect,
  socketToPoints,
  players,
  yourId,
  gameCode,
  clickLeave,
  cheatEnabled,
  gameLog,
}) {
  const toast = useToast();
  const sortedPlayers = [...players].sort((a, b) =>
    (socketToPoints[b.id] ?? 0) > (socketToPoints[a.id] ?? 0) ? 1 : -1
  );

  console.log('socketToPoints', socketToPoints);
  console.log('players', players);
  console.log('sortedPlayers', sortedPlayers);

  return (
    <Stack
      spacing={4}
      width="fit-content"
      justifySelf="center"
      alignItems={'start'}
      direction={['column', 'row']}
    >
      <GameLog gameLog={gameLog} />
      <Grid templateColumns="repeat(3, 1fr)" gap={4} width={600}>
        {board.map((card, i) => (
          <GameCard
            card={card}
            isSelected={selected[i]}
            toggleCard={() => toggleCard(i)}
            key={i}
          />
        ))}
      </Grid>
      <VStack>
        <Heading fontSize={'4xl'}>Game is running!</Heading>
        <HStack>
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
          <Button
            colorScheme="red"
            rightIcon={<ImCross />}
            width="fit-content"
            onClick={clickLeave}
          >
            Leave room
          </Button>
        </HStack>
        <TableContainer width={'fit-content'}>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Picture</Th>
                <Th>Name</Th>
                <Th>Points</Th>
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
                  <Td>{socketToPoints[player.id]}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {cheatEnabled && (
          <ButtonGroup>
            <Button colorScheme={'green'} onClick={cheatSelect}>
              Cheat
            </Button>
            <Button colorScheme={'green'} onClick={semiCheatSelect}>
              SemiCheat
            </Button>
          </ButtonGroup>
        )}
      </VStack>
    </Stack>
  );
}
