import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useToast,
  useColorModeValue,
  Code,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { ethers } from 'ethers';

const GetAddress = () => {
  const [account, setAccount] = useState('');
  const [copied, setCopied] = useState(false);

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const getAccount = async () => {
      try {
        // Connect to MetaMask
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
        } else {
          toast({
            title: 'MetaMask not found',
            description: 'Please install MetaMask to use this feature.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error getting account:', error);
        toast({
          title: 'Error',
          description: 'Failed to get your account. Please make sure MetaMask is connected.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    getAccount();
  }, [toast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    toast({
      title: 'Address copied',
      description: 'Your address has been copied to clipboard.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Container maxW="7xl" py={8}>
      <Heading as="h1" mb={2}>
        Your Wallet Address
      </Heading>
      <Text mb={8} color={useColorModeValue('gray.600', 'gray.400')}>
        Use this address to verify your artisan account
      </Text>

      <Box
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="md" mb={4}>Your MetaMask Address</Heading>
            <Flex>
              <Code p={4} borderRadius="md" flex="1" fontSize="md">
                {account || 'Loading...'}
              </Code>
              <Button
                ml={4}
                colorScheme="teal"
                onClick={copyToClipboard}
                isDisabled={!account}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Flex>
          </Box>

          <Divider />

          <Box>
            <Heading size="md" mb={4}>Verification Instructions</Heading>
            <Text mb={4}>
              To verify your artisan account on Sepolia testnet, follow these steps:
            </Text>
            <Text mb={2} fontWeight="bold">
              1. Add your artisan address to the .env file:
            </Text>
            <Code p={4} borderRadius="md" display="block" whiteSpace="pre-wrap" mb={4}>
              # Open the .env file in the chennai-artisanal-dapp directory
              # Add or update this line with your address:
              ARTISAN_ADDRESS={account}
            </Code>
            <Text mb={2} fontWeight="bold">
              2. Run the verification script:
            </Text>
            <Code p={4} borderRadius="md" display="block" whiteSpace="pre-wrap" mb={4}>
              cd chennai-artisanal-dapp
              npx hardhat run scripts/verify-artisan-sepolia.js --network sepolia
            </Code>
            <Text mb={4}>
              This will verify your artisan account, allowing you to mint NFTs for your artisanal goods.
            </Text>
            <Text fontWeight="bold" color="red.500">
              Note: Only the contract owner can verify artisans. Make sure you're using the account with private key from the .env file.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default GetAddress;
