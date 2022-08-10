import { useState, useEffect, useRef } from 'react';
import { useToast, Box } from '@chakra-ui/react';

import { findSet, isSet } from './logic/game';
import GameGrid from './components/GameGrid';
import LoginCard from './components/LoginCard';
import WaitingRoom from './components/WaitingRoom';
import socketIOClient from 'socket.io-client';
import { MdReport } from 'react-icons/md';
import { IoLogoGameControllerA } from 'react-icons/io';
const ENDPOINT = window.location.hostname + ':3001';
console.log('ENDPOINT', ENDPOINT);
var socket;
var CHEAT_ENABLED;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //for testing without express launch
  socket = socketIOClient(ENDPOINT);
  console.log('dev');
  CHEAT_ENABLED = true;
} else {
  //socket io finds port automatically if launched with express
  socket = socketIOClient();
  console.log('prod');
  CHEAT_ENABLED = false;
}

function Game() {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('login');
  const [selected, setSelected] = useState(board.map(() => false));
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [yourName, setYourName] = useState('');
  const [yourId, setYourId] = useState('');
  const yourIdRef = useRef(yourId);
  const [statusText, setStatusText] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');
  const [gameOwner, setGameOwner] = useState('');
  const [socketToPoints, setSocketToPoints] = useState({});
  const [gameLog, setGameLog] = useState([]);
  const toast = useToast();
  const [cheatEnabled, setCheatEnabled] = useState(CHEAT_ENABLED);

  window.toggleCheatEnabled = () =>
    setCheatEnabled(prevCheatEnabled => !prevCheatEnabled); //for testing

  useEffect(() => {
    const codeFromUrl = window.location.search.slice(1);

    if (codeFromUrl) {
      clickJoin(codeFromUrl);
    }
  }, []);

  useEffect(() => {
    setSelected(board.map(() => false));
  }, [board]);

  useEffect(() => {
    yourIdRef.current = yourId; // update ref for use in socket.on('gameEnded')
  });

  function clickJoin(roomName) {
    socket.emit('joinGame', roomName);
    setJoinRoomError('');
  }

  function clickCreate() {
    socket.emit('createGame');
    setJoinRoomError('');
  }

  function clickLeave() {
    socket.emit('leaveGame');
    setJoinRoomError('');
    setBoard([]);
    setGameState('login');
    setSelected([]);
    setGameCode('');
    setPlayers([]);
    setYourName('');
    setYourId('');
    setGameOwner('');
    setSocketToPoints({});
    setGameLog([]);
    window.history.replaceState({}, '', '/');
  }

  function clickStart() {
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
      window.history.replaceState({}, '', `/?${code}`);
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
      setGameState('login');
      setBoard([]);
      setSelected([]);
      setGameCode('');
      setPlayers([]);
      setYourName('');
      setYourId('');
      setStatusText('');
      setGameOwner('');
      setSocketToPoints({});
      setGameLog([]);
      window.history.replaceState({}, '', '/');
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

    socket.on('gameStateUpdate', ({ board, socketToPoints, gameLog }) => {
      setBoard(board);
      setSocketToPoints(socketToPoints);
      setGameLog(gameLog);
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
      setGameState('waitingRoom');
      setGameLog([]);
      if (!toast.isActive('gameEnded')) {
        toast({
          id: 'gameEnded',
          title: 'Game over! 🎉',
          description: `${
            socketToPoints[yourIdRef.current] ===
            Math.max(...Object.values(socketToPoints))
              ? 'Victory! '
              : ''
          } Your score is: ${socketToPoints[yourIdRef.current]}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          icon: <IoLogoGameControllerA />,
        });
      }
    });

    return () => {
      socket.off('gameJoined');
      socket.off('gameStarted');
      socket.off('gameStateUpdate');
      socket.off('playersUpdate');
      socket.off('opponentLeft');
      socket.off('setAccepted');
      socket.off('badCode');
      socket.off('gameEnded');
    };
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
  }, [board, selected, toast]);

  return (
    <Box p={4}>
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
          cheatSelect={() => {
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
          semiCheatSelect={() => {
            setSelected(prevSelected => {
              const newSelected = [...prevSelected];
              newSelected.forEach((_, i) => {
                newSelected[i] = false;
              });

              let solution = findSet(board);
              if (solution) {
                solution.slice(0, -1).forEach(idx => {
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
          clickLeave={clickLeave}
          cheatEnabled={cheatEnabled}
          gameLog={gameLog}
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
          socketToPoints={socketToPoints}
        />
      )}
    </Box>
  );
}

export default Game;
