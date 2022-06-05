import { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  GridItem,
  theme,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import GameCard from './components/GameCard';
import { createDeck, findSet, makeBoard, isSet } from './logic/game';
import SVGPatterns from './components/SVGPatterns';
import GameGrid from './components/GameGrid';

function App() {
  const [deck, setDeck] = useState(createDeck());
  const [board, setBoard] = useState(makeBoard(deck));
  const [selected, setSelected] = useState(board.map(() => false));

  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (selected.filter(x => x).length === 3) {
      const selectedCards = board.filter((_, i) => selected[i]);
      if (isSet(...selectedCards)) {
        setStatusText('Set found!');
      } else {
        setStatusText('Not a set.');
      }
    } else {
      setStatusText('Must choose 3 cards.');
    }
  }, [board, selected]);

  return (
    <ChakraProvider theme={theme}>
      <SVGPatterns />
      <Grid p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <GameGrid
          board={board}
          selected={selected}
          statusText={statusText}
          toggleCard={x =>
            setSelected(prevSelected => {
              const newSelected = [...prevSelected];
              newSelected[x] = !newSelected[x];
              return newSelected;
            })
          }
          helpSelect={() => {
            setSelected(prevSelected => {
              const newSelected = [...prevSelected];
              newSelected.forEach((_, i) => {
                newSelected[i] = false;
              });

              let solution = findSet(board);
              if (solution) {
                solution.forEach(idx => {
                  newSelected[idx] = true;
                });
              }
              return newSelected;
            });
          }}
        />
      </Grid>
    </ChakraProvider>
  );
}

export default App;
