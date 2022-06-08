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
import { IoLogoGameControllerA } from 'react-icons/io';
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
  const [socketToPoints, setSocketToPoints] = useState({});
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
      setSocketToPoints(socketToPoints);
      if (!toast.isActive('gameStarted')) {
        toast({
          id: 'gameStarted',
          title: 'The game has started! 🎉',
          description: 'Go find a SET!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          icon: <IoLogoGameControllerA />,
        });
      }
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

    socket.on('gameStateUpdate', ({ board, socketToPoints }) => {
      setBoard(board);
      setSocketToPoints(socketToPoints);
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

    socket.on('setAccepted', () => {
      if (!toast.isActive('setAccepted')) {
        toast({
          id: 'setAccepted',
          title: 'Set accepted! 🎉',
          description: '+1 point to your score!',
          status: 'success',
          duration: 1000,
          isClosable: true,
          icon: <IoLogoGameControllerA />,
        });
      }
    });

    socket.on('badCode', msg => {
      setJoinRoomError(msg);
      console.log(msg);
    });

    socket.on('gameEnded', socketToPoints => {
      setSocketToPoints(socketToPoints);
      console.log('socketToPoints', socketToPoints);
      console.log('yourId', yourId);
      if (!toast.isActive('gameEnded')) {
        toast({
          id: 'gameEnded',
          title: 'Game over! 🎉',
          description: 'Your score is: ' + socketToPoints[yourId],
          status: 'success',
          duration: 3000,
          isClosable: true,
          icon: <IoLogoGameControllerA />,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (selected.filter(x => x).length === 3) {
      const selectedCards = board.filter((_, i) => selected[i]);
      if (isSet(...selectedCards)) {
        setStatusText('Set found!');
        socket.emit('setFound', selected);
      } else {
        setStatusText('Not a set.');

        if (!toast.isActive('notASet')) {
          toast({
            id: 'notASet',
            title: 'Not a set! 😬',
            description: 'Try again.',
            status: 'error',
            duration: 1000,
            isClosable: true,
            icon: <MdReport />,
          });
        }
      }
      setSelected(selected.map(() => false));
    } else {
      setStatusText('Must choose 3 cards.');
    }
  }, [board, selected]);

  useEffect(() => {
    console.log('id changed: ', yourId);
  }, [yourId]);

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
            socketToPoints={socketToPoints}
            players={players}
            yourId={yourId}
            gameCode={gameCode}
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
