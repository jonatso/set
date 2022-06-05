import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowRight, FaPlus } from 'react-icons/fa';

export default function LoginCard() {
  return (
    <Flex
      minH={'100%'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Lets play a game of SET! 🤠</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Made by{' '}
            <Link href="https://github.com/jonatso" color={'blue.400'}>
              Jonatan Solheim
            </Link>
            , original game by{' '}
            <Link
              href="https://www.setgame.com/founder-inventor"
              color={'blue.400'}
            >
              Marsha Falco.
            </Link>{' '}
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              leftIcon={<FaPlus />}
            >
              Create game
            </Button>
            <FormControl id="text">
              <FormLabel>Game code</FormLabel>
              <Input type="text" />
            </FormControl>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              leftIcon={<FaArrowRight />}
            >
              Join game
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
