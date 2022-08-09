import { ChakraProvider, theme, Box } from '@chakra-ui/react';

import Game from './Game';

import Nav from './Nav';

import SVGPatterns from './components/SVGPatterns';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SVGPatterns />
      <Nav />
      <Box p={4}>
        <Game />
      </Box>
    </ChakraProvider>
  );
}

export default App;
