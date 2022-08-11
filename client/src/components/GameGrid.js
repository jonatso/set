import {
  Grid,
  Button,
  Avatar,
  HStack,
  Flex,
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
  isMobile,
}) {
  const toast = useToast();
  const sortedPlayers = [...players].sort((a, b) =>
    (socketToPoints[b.id] ?? 0) > (socketToPoints[a.id] ?? 0) ? 1 : -1
  );

  return (
    <Flex wrap={'wrap'} gap={2} justify="center">
      {!isMobile && <GameLog gameLog={gameLog} />}

      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={2}
        flex={1}
        maxWidth="650px"
        minWidth="40%"
      >
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
          <Table
            variant="striped"
            size={isMobile || players.length > 4 ? 'sm' : 'md'}
          >
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
    </Flex>
  );
}
