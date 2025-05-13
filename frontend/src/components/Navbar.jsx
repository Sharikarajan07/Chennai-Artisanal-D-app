import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Divider,
  Image,
  Heading,
  Container,
  Tooltip,
  Avatar
} from '@chakra-ui/react';
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiChevronDown, FiShoppingBag, FiHome, FiUsers, FiPlusCircle } from 'react-icons/fi';
import { ethers } from 'ethers';
import { getCurrentAccount } from '../utils/blockchain';
import ArtisanRegistryABI from '../contracts/ArtisanRegistry.json';
import { ARTISAN_REGISTRY_ADDRESS } from '../utils/constants';

const NavLink = ({ children, to, icon }) => {
  const location = useLocation();
  // Check if current path matches the link's path
  // For home route ('/'), only match exactly, otherwise handle nested routes
  // (e.g., /artisan/123 should highlight the /artisan tab)
  const isActive = to === '/'
                  ? location.pathname === '/'
                  : location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <Box position="relative">
      <Link
        to={to}
        px={4}
        py={2}
        rounded={'md'}
        display="flex"
        alignItems="center"
        fontWeight={isActive ? "700" : "500"}
        fontSize="md"
        color={isActive ? "brand.500" : useColorModeValue('gray.700', 'gray.200')}
        bg={isActive ? useColorModeValue('brand.50', 'brand.900') : 'transparent'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.100', 'gray.700'),
          transform: 'translateY(-2px)',
          color: isActive ? "brand.600" : "brand.500"
        }}
        transition="all 0.2s"
      >
        {icon && <Icon as={icon} mr={2.5} color={isActive ? "brand.500" : "inherit"} />}
        {children}
      </Link>

      {/* Active indicator line */}
      {isActive && (
        <Box
          position="absolute"
          bottom="-2px"
          left="0"
          right="0"
          height="3px"
          bg="brand.500"
          borderRadius="full"
          mx={2}
          transition="all 0.2s"
        />
      )}
    </Box>
  );
};

// Mobile navigation link component
const MobileNavLink = ({ children, to, icon, onClick, isAdmin = false }) => {
  const location = useLocation();
  const isActive = to === '/'
                  ? location.pathname === '/'
                  : location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      display="flex"
      alignItems="center"
      p={2}
      rounded="md"
      position="relative"
      fontWeight={isActive ? "600" : "normal"}
      color={isAdmin ? "red.500" : (isActive ? "brand.500" : useColorModeValue('gray.700', 'gray.200'))}
      bg={isActive ? useColorModeValue('brand.50', 'brand.900') : 'transparent'}
      borderLeftWidth={isActive ? "3px" : "0px"}
      borderLeftColor="brand.500"
      pl={isActive ? 3 : 2}
      _hover={{
        bg: isAdmin
          ? useColorModeValue('red.50', 'red.900')
          : useColorModeValue('gray.100', 'gray.700'),
        color: isAdmin ? "red.600" : "brand.500"
      }}
      onClick={onClick}
      transition="all 0.2s"
    >
      <Icon
        as={icon}
        mr={2}
        color={isActive ? (isAdmin ? "red.500" : "brand.500") : "inherit"}
      />
      {children}
    </Link>
  );
};

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
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex="1000"
      transition="all 0.3s ease"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container maxW="7xl">
        <Flex h={20} alignItems={'center'} justifyContent={'space-between'} px={4}>
          <IconButton
            size={'md'}
            icon={isOpen ? <Icon as={FiX} /> : <Icon as={FiMenu} />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
          />

          <HStack spacing={{ base: 4, md: 8 }} alignItems={'center'}>
            <Link to="/">
              <Flex align="center">
                <Heading
                  as="h1"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontFamily="heading"
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  bgClip="text"
                  letterSpacing="tight"
                  fontWeight="bold"
                >
                  Chennai Artisanal
                </Heading>
              </Flex>
            </Link>

            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }} ml={6}>
              <NavLink to="/" icon={FiHome}>Home</NavLink>
              <NavLink to="/marketplace" icon={FiShoppingBag}>Marketplace</NavLink>
              <NavLink to="/artisans" icon={FiUsers}>Artisans</NavLink>
              {isConnected && (
                <NavLink to="/create" icon={FiPlusCircle}>Create</NavLink>
              )}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={3} align="center">
              <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
                <IconButton
                  size="md"
                  fontSize="lg"
                  aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                  variant="ghost"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  onClick={toggleColorMode}
                  icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                />
              </Tooltip>

              {isConnected ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="outline"
                    colorScheme="brand"
                    px={4}
                    py={2}
                    rightIcon={<FiChevronDown />}
                    _hover={{
                      bg: useColorModeValue('brand.50', 'brand.900'),
                      borderColor: 'brand.500',
                    }}
                  >
                    <Flex align="center">
                      <Avatar
                        size="xs"
                        mr={2}
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account}`}
                        bg="brand.500"
                      />
                      <Text fontSize="sm" fontWeight="medium">
                        {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                      </Text>
                    </Flex>
                  </MenuButton>
                  <MenuList
                    shadow="lg"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <MenuItem
                      as={Link}
                      to="/profile"
                      icon={<Icon as={FiUser} />}
                      _hover={{ bg: useColorModeValue('brand.50', 'brand.900') }}
                    >
                      My Profile
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      to="/my-items"
                      _hover={{ bg: useColorModeValue('brand.50', 'brand.900') }}
                    >
                      My Items
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      to="/get-address"
                      _hover={{ bg: useColorModeValue('brand.50', 'brand.900') }}
                    >
                      Get Address
                    </MenuItem>
                    {isOwner && (
                      <>
                        <Divider />
                        <MenuItem
                          as={Link}
                          to="/admin"
                          color="red.500"
                          _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
                        >
                          Admin Panel
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  rounded="full"
                  colorScheme="brand"
                  onClick={connectWallet}
                  isLoading={isConnecting}
                  loadingText="Connecting..."
                  px={6}
                  fontWeight="medium"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                  }}
                  transition="all 0.2s"
                >
                  Connect Wallet
                </Button>
              )}
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={3} pt={2}>
              <NavLink to="/" icon={FiHome}>Home</NavLink>
              <NavLink to="/marketplace" icon={FiShoppingBag}>Marketplace</NavLink>
              <NavLink to="/artisans" icon={FiUsers}>Artisans</NavLink>

              {isConnected && (
                <>
                  <NavLink to="/create" icon={FiPlusCircle}>Create</NavLink>

                  {/* Profile Section */}
                  <Box
                    p={4}
                    mt={4}
                    rounded="lg"
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    boxShadow="sm"
                  >
                    <Flex align="center" mb={4}>
                      <Avatar
                        size="sm"
                        mr={3}
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account}`}
                        bg="brand.500"
                        boxShadow="sm"
                      />
                      <Text fontWeight="bold" fontSize="md">
                        {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                      </Text>
                    </Flex>

                    <Stack spacing={2} fontSize="sm">
                      <MobileNavLink
                        to="/profile"
                        icon={FiUser}
                        onClick={onClose}
                      >
                        My Profile
                      </MobileNavLink>

                      <MobileNavLink
                        to="/my-items"
                        icon={FiShoppingBag}
                        onClick={onClose}
                      >
                        My Items
                      </MobileNavLink>

                      <MobileNavLink
                        to="/get-address"
                        icon={FiUser}
                        onClick={onClose}
                      >
                        Get Address
                      </MobileNavLink>

                      {isOwner && (
                        <>
                          <Divider my={2} />
                          <MobileNavLink
                            to="/admin"
                            icon={FiUser}
                            onClick={onClose}
                            isAdmin={true}
                          >
                            Admin Panel
                          </MobileNavLink>
                        </>
                      )}
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}
