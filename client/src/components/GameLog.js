import { useEffect, useRef } from 'react';

import {
  Avatar,
  Table,
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  HStack,
  useColorModeValue,
  theme,
} from '@chakra-ui/react';

import GameCard from './GameCard';

export default function GameLog({ gameLog, yourId }) {
  const tableEndRef = useRef(null);

  useEffect(() => {
    tableEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [gameLog]);

  return (
    <TableContainer width={'fit-content'} height="470px" overflowY={'scroll'}>
      <Table variant="striped" size={'sm'}>
        <Thead
          position={'sticky'}
          top="0"
          bgColor={useColorModeValue(
            theme.semanticTokens.colors['chakra-body-bg']._light,
            theme.semanticTokens.colors['chakra-body-bg']._dark
          )}
          zIndex={1}
        >
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
      <div ref={tableEndRef}></div>
    </TableContainer>
  );
}
