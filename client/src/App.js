import { ChakraProvider, theme, Box } from '@chakra-ui/react';

import Game from './Game';

import Nav from './Nav';

import SVGPatterns from './components/SVGPatterns';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SVGPatterns />
      <Nav />
      <Game />
    </ChakraProvider>
  );
}

export default App;
