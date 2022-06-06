import { useState, useEffect } from 'react';
import {
  ChakraProvider,
  theme,
  Grid,
  useColorModeValue,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { createDeck, findSet, makeBoard, isSet } from './logic/game';
import SVGPatterns from './components/SVGPatterns';
import GameGrid from './components/GameGrid';
import LoginCard from './components/LoginCard';
import WaitingRoom from './components/WaitingRoom';

function App() {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('login');
  const [selected, setSelected] = useState(board.map(() => false));
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([
    { id: 0, name: 'jonas' },
    { id: 1, name: 'bob' },
    { id: 2, name: 'carmen' },
  ]);
  const [yourName, setYourName] = useState('bob');

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
        {gameState === 'inGame' && (
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
        )}
        {gameState === 'login' && <LoginCard />}
        {gameState === 'waitingRoom' && (
          <WaitingRoom
            players={players}
            gameCode={gameCode}
            yourName={yourName}
          />
        )}
      </Grid>
    </ChakraProvider>
  );
}

export default App;
