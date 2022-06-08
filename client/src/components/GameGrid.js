import {
  Grid,
  Button,
  Text,
  HStack,
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
import { ImCross } from 'react-icons/im';
import { FaCopy } from 'react-icons/fa';

export default function GameGrid({
  board,
  statusText,
  selected,
  toggleCard,
  helpSelect,
  socketToPoints,
  players,
  yourId,
  gameCode,
  clickLeave,
}) {
  const toast = useToast();

  return (
    <HStack spacing={4} width="fit-content" justifySelf="center">
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
                <Th>Points</Th>
              </Tr>
            </Thead>
            <Tbody>
              {players.map(player => (
                <Tr
                  fontWeight={player.id === yourId ? 'bold' : 'normal'}
                  key={player.id}
                >
                  <Td>{player.name}</Td>
                  <Td>{socketToPoints[player.id]}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <ButtonGroup>
          <Button colorScheme={'green'} onClick={helpSelect}>
            Cheat...
          </Button>
          <Button
            colorScheme="red"
            rightIcon={<ImCross />}
            width="fit-content"
            onClick={clickLeave}
          >
            Leave room
          </Button>
        </ButtonGroup>
      </VStack>
    </HStack>
  );
}
