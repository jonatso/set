import {
  Grid,
  Stack,
  Text,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';

export default function WaitingRoom({ players, gameCode, yourName }) {
  return (
    <Stack spacing={4}>
      <Heading fontSize={'4xl'}>Waiting Room</Heading>
      <Heading fontSize={'lg'}>Players</Heading>
      <Text fontSize={'lg'} color={'gray.600'}>
        {players.map(player => (
          <Text key={player.id}>
            {player.name}{' '}
            <i>({player.name === yourName ? 'you' : player.id})</i>
          </Text>
        ))}
      </Text>
    </Stack>
  );
}
