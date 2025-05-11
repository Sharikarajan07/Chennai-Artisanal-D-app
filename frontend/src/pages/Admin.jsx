import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Divider,
  Badge,
  Flex,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { ethers } from 'ethers';
import ArtisanRegistryABI from '../contracts/ArtisanRegistry.json';
import { ARTISAN_REGISTRY_ADDRESS } from '../utils/constants';

const Admin = () => {
  const [artisanAddress, setArtisanAddress] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [account, setAccount] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  
  useEffect(() => {
    const checkOwner = async () => {
      try {
        setLoading(true);
        
        // Connect to MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const currentAccount = await signer.getAddress();
        setAccount(currentAccount);
        
        // Initialize contract
        const artisanRegistry = new ethers.Contract(
          ARTISAN_REGISTRY_ADDRESS,
          ArtisanRegistryABI.abi,
          signer
        );
        
        // Check if current user is the contract owner
        const owner = await artisanRegistry.owner();
        setIsOwner(owner.toLowerCase() === currentAccount.toLowerCase());
        
        // Get all artisans if user is owner
        if (owner.toLowerCase() === currentAccount.toLowerCase()) {
          const artisanCount = await artisanRegistry.getArtisanCount();
          const artisanList = [];
          
          for (let i = 0; i < artisanCount; i++) {
            const artisanAddress = await artisanRegistry.artisanAddresses(i);
            const artisanDetails = await artisanRegistry.getArtisanDetails(artisanAddress);
            
            artisanList.push({
              address: artisanAddress,
              name: artisanDetails.name,
              location: artisanDetails.location,
              specialization: artisanDetails.specialization,
              isVerified: artisanDetails.isVerified,
              registrationDate: new Date(artisanDetails.registrationDate.toNumber() * 1000).toLocaleDateString()
            });
          }
          
          setArtisans(artisanList);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking owner status:', error);
        toast({
          title: 'Error',
          description: 'Failed to connect to the blockchain. Please make sure MetaMask is installed and connected.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    };
    
    checkOwner();
  }, [toast]);
  
  const handleVerifyArtisan = async (addressToVerify) => {
    try {
      setVerifying(true);
      
      // Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Initialize contract
      const artisanRegistry = new ethers.Contract(
        ARTISAN_REGISTRY_ADDRESS,
        ArtisanRegistryABI.abi,
        signer
      );
      
      // Verify the artisan
      const tx = await artisanRegistry.verifyArtisan(addressToVerify || artisanAddress);
      await tx.wait();
      
      toast({
        title: 'Success',
        description: 'Artisan verified successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error verifying artisan:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify artisan. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setVerifying(false);
    }
  };
  
  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }
  
  if (!isOwner) {
    return (
      <Container maxW="7xl" py={8}>
        <Heading as="h1" mb={2}>
          Admin Panel
        </Heading>
        <Text mb={8} color="red.500">
          You do not have permission to access this page. Only the contract owner can access the admin panel.
        </Text>
      </Container>
    );
  }
  
  return (
    <Container maxW="7xl" py={8}>
      <Heading as="h1" mb={2}>
        Admin Panel
      </Heading>
      <Text mb={8} color={useColorModeValue('gray.600', 'gray.400')}>
        Manage artisans and verify their accounts
      </Text>
      
      <Box
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        mb={8}
      >
        <Heading size="md" mb={6}>
          Verify Artisan
        </Heading>
        
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Artisan Wallet Address</FormLabel>
            <Input
              value={artisanAddress}
              onChange={(e) => setArtisanAddress(e.target.value)}
              placeholder="0x..."
            />
          </FormControl>
          
          <Button
            colorScheme="teal"
            isLoading={verifying}
            loadingText="Verifying..."
            onClick={() => handleVerifyArtisan()}
          >
            Verify Artisan
          </Button>
        </VStack>
      </Box>
      
      <Box
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading size="md" mb={6}>
          Registered Artisans
        </Heading>
        
        {artisans.length > 0 ? (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Address</Th>
                  <Th>Specialization</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {artisans.map((artisan) => (
                  <Tr key={artisan.address}>
                    <Td>{artisan.name}</Td>
                    <Td>{`${artisan.address.substring(0, 6)}...${artisan.address.substring(38)}`}</Td>
                    <Td>{artisan.specialization}</Td>
                    <Td>
                      <Badge
                        colorScheme={artisan.isVerified ? 'green' : 'yellow'}
                        p={2}
                        borderRadius="full"
                      >
                        {artisan.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </Td>
                    <Td>
                      {!artisan.isVerified && (
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => handleVerifyArtisan(artisan.address)}
                        >
                          Verify
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Text>No artisans registered yet.</Text>
        )}
      </Box>
    </Container>
  );
};

export default Admin;
