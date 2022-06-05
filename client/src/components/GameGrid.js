import { Grid, Button, Text } from '@chakra-ui/react';
import GameCard from './GameCard';

export default function GameGrid({
  board,
  statusText,
  selected,
  toggleCard,
  helpSelect,
}) {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      gap={4}
      width={600}
      justifySelf="center"
    >
      {board.map((card, i) => (
        <GameCard
          card={card}
          isSelected={selected[i]}
          toggleCard={() => toggleCard(i)}
          key={i}
        />
      ))}
      <Text>{statusText}</Text>
      <Button colorScheme={'teal'} onClick={helpSelect}>
        Help...
      </Button>
    </Grid>
  );
}
