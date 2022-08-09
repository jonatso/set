import {
  Button,
  Box,
  Flex,
  useColorModeValue,
  Center,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuDivider,
  MenuList,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

import { MdReport } from 'react-icons/md';

import { ColorModeSwitcher } from './ColorModeSwitcher';

export default function Nav() {
  const toast = useToast();
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'start'}>
        <Text fontSize={20} fontWeight={'semibold'}>
          Set
        </Text>

        <Flex alignItems={'center'} ml={'auto'}>
          <Stack direction={'row'} spacing={7}>
            <ColorModeSwitcher />

            {/* <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              > */}
            <Button
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
              onClick={() => {
                if (!toast.isActive('accountsComingSoon'))
                  toast({
                    id: 'accountsComingSoon',
                    title: 'Accounts coming later!',
                    description: "We're working on it. 😤",
                    status: 'info',
                    duration: 1500,
                    isClosable: true,
                    icon: <MdReport />,
                  });
              }}
            >
              <Avatar
                size={'sm'}
                src={'https://avatars.dicebear.com/api/male/username.svg'}
              />
            </Button>
            {/* </MenuButton>
              <MenuList alignItems={'center'}>
                <br />
                <Center>
                  <Avatar
                    size={'2xl'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </Center>
                <br />
                <Center>
                  <p>Username</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>Your Servers</MenuItem>
                <MenuItem>Account Settings</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu> */}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
