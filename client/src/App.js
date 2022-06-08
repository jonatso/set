import { useState, useEffect } from 'react';
import { ChakraProvider, theme, Grid, useToast } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { createDeck, findSet, makeBoard, isSet } from './logic/game';
import SVGPatterns from './components/SVGPatterns';
import GameGrid from './components/GameGrid';
import LoginCard from './components/LoginCard';
import WaitingRoom from './components/WaitingRoom';
import socketIOClient from 'socket.io-client';
import { MdReport } from 'react-icons/md';
const ENDPOINT = 'http://localhost:3001';
var socket;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //for testing without express launch
  socket = socketIOClient(ENDPOINT);
  console.log('dev');
} else {
  //socket io finds port automatically if launched with express
  socket = socketIOClient();
  console.log('prod');
}

function App() {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('login');
  const [selected, setSelected] = useState(board.map(() => false));
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [yourName, setYourName] = useState('');
  const [yourId, setYourId] = useState('');
  const [statusText, setStatusText] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');
  const [gameOwner, setGameOwner] = useState('');
  const toast = useToast();

  useEffect(() => {
    const codeFromUrl = window.location.pathname.substring(1);

    if (codeFromUrl) {
      clickJoin(codeFromUrl);
    }
  }, []);

  function clickJoin(roomName) {
    console.log('clickJoin', roomName);
    socket.emit('joinGame', roomName);
    setJoinRoomError('');
  }

  function clickCreate() {
    console.log('clickCreate');
    socket.emit('createGame');
    setJoinRoomError('');
  }

  function clickLeave() {
    console.log('clickLeave');
    socket.emit('leaveGame');
    setJoinRoomError('');
    setBoard([]);
    setGameState('login');
    setSelected([]);
    setGameCode('');
    setPlayers([]);
    setYourName('');
    setYourId('');
  }

  function clickStart() {
    console.log('clickStart');
    socket.emit('startGame');
  }

  useEffect(() => {
    socket.on('gameJoined', ({ code, name, id, players, gameOwner }) => {
      setGameCode(code);
      setYourName(name);
      setPlayers(players);
      setGameState('waitingRoom');
      setGameOwner(gameOwner);
      setYourId(id);
    });

    socket.on('gameStarted', ({ board, socketToPoints }) => {
      setBoard(board);
      setGameState('inGame');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      setGameState('login');
      setBoard([]);
      setSelected([]);
      setGameCode('');
      setPlayers([]);
      setYourName('');
      setYourId('');
      setStatusText('');

      if (!toast.isActive('disconnectedError')) {
        toast({
          id: 'disconnectedError',
          title: 'Disconnected from server 😢',
          description:
            "You've been disconnected from the server. Please try again.",
          status: 'error',
          duration: 3000,
          isClosable: true,
          icon: <MdReport />,
        });
      }
    });

    socket.on('startGame', gameState => {
      setGameState(gameState);
    });

    socket.on('playersUpdate', ({ players, gameOwner }) => {
      setPlayers(players);
      setGameOwner(gameOwner);
    });

    socket.on('opponentLeft', () => {
      // setConnectText('Your opponent left the game');
      // setGameState({
      //   board: emptyBoard,
      //   possibleMovesBoard: emptyBoard,
      //   isWhitesTurn: true,
      // });
      // setIsPlayer1(null);
      // setGameHasStarted(false);
    });

    socket.on('moveError', message => {
      console.log(message);
    });

    socket.on('badCode', msg => {
      setJoinRoomError(msg);
      console.log(msg);
    });

    socket.on('gameEnded', gameState => {
      // setGameState(gameState);
      // setGameIsEnded(true);
      // setConnectText(getWinnerText());
    });
  }, []);

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
        {gameState === 'login' && (
          <LoginCard
            clickJoin={clickJoin}
            clickCreate={clickCreate}
            joinRoomError={joinRoomError}
          />
        )}
        {gameState === 'waitingRoom' && (
          <WaitingRoom
            players={players}
            gameCode={gameCode}
            yourName={yourName}
            clickLeave={clickLeave}
            clickStart={clickStart}
            gameOwner={gameOwner}
            yourId={yourId}
          />
        )}
      </Grid>
    </ChakraProvider>
  );
}

export default App;
