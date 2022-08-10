import {
  Avatar,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  HStack,
} from '@chakra-ui/react';

import GameCard from './GameCard';

export default function GameLog({ gameLog, yourId }) {
  return (
    <TableContainer width={'fit-content'}>
      <Table variant="striped" size={'sm'}>
        <Thead>
          <Tr>
            <Th>Player</Th>
            <Th>Cards</Th>
          </Tr>
        </Thead>
        <Tbody>
          {gameLog.map((logItem, i) => (
            <Tr fontWeight={logItem.id === yourId ? 'bold' : 'normal'} key={i}>
              <Td>
                <Avatar
                  size="xs"
                  src={`https://avatars.dicebear.com/api/pixel-art/${logItem.id}.svg
                    `}
                />
              </Td>
              {/*scale parent to fit child*/}

              <Td>
                <HStack>
                  {logItem.cards.map(card => (
                    <GameCard key={card} card={card} sizeMultiplier={0.3} />
                  ))}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
