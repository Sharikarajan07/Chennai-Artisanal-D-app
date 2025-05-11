import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useDisclosure,
  HStack,
  IconButton,
  Icon,
  useColorMode,
  useColorModeValue,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider
} from '@chakra-ui/react';
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiChevronDown } from 'react-icons/fi';
import { ethers } from 'ethers';
import { getCurrentAccount } from '../utils/blockchain';
import ArtisanRegistryABI from '../contracts/ArtisanRegistry.json';
import { ARTISAN_REGISTRY_ADDRESS } from '../utils/constants';

const NavLink = ({ children, to }) => (
  <Link
    to={to}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
          console.log('MetaMask not installed');
          return;
        }

        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          console.log('No connected accounts');
          setIsConnected(false);
          return;
        }

        // Get the current account
        try {
          const address = await getCurrentAccount();
          setAccount(address);
          setIsConnected(true);

          // Check if the user is the contract owner
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Initialize contract
            const artisanRegistry = new ethers.Contract(
              ARTISAN_REGISTRY_ADDRESS,
              ArtisanRegistryABI.abi,
              signer
            );

            const owner = await artisanRegistry.owner();
            setIsOwner(owner.toLowerCase() === address.toLowerCase());
          } catch (ownerError) {
            console.error('Error checking owner status:', ownerError);
            // Don't show a toast for this error as it's not critical
          }
        } catch (accountError) {
          console.error('Error getting current account:', accountError);
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setIsConnected(false);
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount('');
          setIsConnected(false);
          toast({
            title: 'Wallet Disconnected',
            description: 'Your wallet has been disconnected.',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Clean up event listener on component unmount
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [toast]);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast({
          title: 'MetaMask not found',
          description: 'Please install MetaMask to connect your wallet.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the address
      const address = await getCurrentAccount();
      setAccount(address);
      setIsConnected(true);

      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection Error',
        description: error.message || 'Failed to connect wallet. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} boxShadow="sm">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <Icon as={FiX} /> : <Icon as={FiMenu} />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box fontWeight="bold" fontSize="xl">
            <Link to="/">Chennai Artisanal</Link>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/artisans">Artisans</NavLink>
            {isConnected && (
              <>
                <NavLink to="/create">Create</NavLink>
              </>
            )}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <Icon as={FiMoon} /> : <Icon as={FiSun} />}
            </Button>
            {isConnected ? (
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  rounded="full"
                  variant="outline"
                  colorScheme="teal"
                  rightIcon={<FiChevronDown />}
                >
                  {`${account.substring(0, 6)}...${account.substring(
                    account.length - 4
                  )}`}
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} to="/profile" icon={<Icon as={FiUser} />}>
                    My Profile
                  </MenuItem>
                  <MenuItem as={Link} to="/my-items">
                    My Items
                  </MenuItem>
                  <MenuItem as={Link} to="/get-address">
                    Get Address
                  </MenuItem>
                  {isOwner && (
                    <>
                      <Divider />
                      <MenuItem as={Link} to="/admin" color="red.500">
                        Admin
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            ) : (
              <Button
                size="sm"
                rounded="full"
                colorScheme="teal"
                onClick={connectWallet}
                isLoading={isConnecting}
                loadingText="Connecting..."
              >
                Connect Wallet
              </Button>
            )}
          </Stack>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={2}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/artisans">Artisans</NavLink>

            {isConnected && (
              <>
                <NavLink to="/create">Create</NavLink>

                {/* Profile Section */}
                <Box
                  p={2}
                  rounded="md"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  borderWidth="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                >
                  <Text fontWeight="medium" mb={2}>Profile</Text>
                  <Stack pl={4} spacing={1} fontSize="sm">
                    <Link
                      to="/profile"
                      style={{ padding: '6px 0' }}
                      onClick={onClose}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/my-items"
                      style={{ padding: '6px 0' }}
                      onClick={onClose}
                    >
                      My Items
                    </Link>
                    <Link
                      to="/get-address"
                      style={{ padding: '6px 0' }}
                      onClick={onClose}
                    >
                      Get Address
                    </Link>

                    {isOwner && (
                      <>
                        <Divider my={1} />
                        <Link
                          to="/admin"
                          style={{ padding: '6px 0', color: 'var(--chakra-colors-red-500)' }}
                          onClick={onClose}
                        >
                          Admin
                        </Link>
                      </>
                    )}
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
