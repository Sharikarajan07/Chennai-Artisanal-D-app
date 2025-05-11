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
  Textarea,
  useToast,
  Divider,
  Badge,
  Avatar,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import {
  getCurrentAccount,
  getArtisanDetails,
  registerArtisan,
  updateArtisanInfo,
  getMyNFTs
} from '../utils/blockchain';
import NFTCard from '../components/NFTCard';

const Profile = () => {
  const [account, setAccount] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [artisanDetails, setArtisanDetails] = useState(null);
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Get current account
        try {
          const address = await getCurrentAccount();
          setAccount(address);

          // Get artisan details
          try {
            const details = await getArtisanDetails(address);

            if (details && details.name) {
              setIsRegistered(true);
              setIsVerified(details.isVerified);
              setArtisanDetails(details);

              // Pre-fill form fields for updates
              setName(details.name);
              setLocation(details.location);
              setSpecialization(details.specialization);
              setContactInfo(details.contactInfo);
            }
          } catch (artisanError) {
            console.log('Not registered as artisan yet:', artisanError.message);
            // This is expected for users who aren't registered yet, so we don't show an error toast
          }

          // Get user's NFTs
          try {
            const nfts = await getMyNFTs();
            setMyNFTs(nfts);
          } catch (nftError) {
            console.error('Error fetching NFTs:', nftError);
            toast({
              title: 'NFT Loading Error',
              description: 'Could not load your NFTs. Please try again later.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
            });
          }
        } catch (accountError) {
          console.error('Error getting account:', accountError);
          toast({
            title: 'Wallet Connection Error',
            description: 'Please make sure your wallet is connected and try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data. Please check your connection and try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location || !specialization || !contactInfo) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setRegistering(true);

      if (isRegistered) {
        // Update existing artisan information
        await updateArtisanInfo(name, location, specialization, contactInfo);

        // Set update success state
        setUpdateSuccess(true);

        // Clear success message after 5 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 5000);

        toast({
          title: 'Success',
          description: 'Your artisan information has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Register as a new artisan
        await registerArtisan(name, location, specialization, contactInfo);

        toast({
          title: 'Success',
          description: 'You have been registered as an artisan. Please wait for verification.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setIsRegistered(true);
      }

      // Refresh artisan details
      const details = await getArtisanDetails(account);
      setArtisanDetails(details);
    } catch (error) {
      console.error('Error updating artisan information:', error);
      toast({
        title: 'Error',
        description: isRegistered
          ? 'Failed to update artisan information. Please try again.'
          : 'Failed to register as artisan. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <Heading as="h1" mb={2}>
        My Profile
      </Heading>
      <Text mb={8} color={useColorModeValue('gray.600', 'gray.400')}>
        Manage your artisan profile and view your items
      </Text>

      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Profile</Tab>
          <Tab>My Items</Tab>
        </TabList>

        <TabPanels>
          {/* Profile Tab */}
          <TabPanel>
            <Box
              bg={bgColor}
              p={8}
              borderRadius="lg"
              boxShadow="lg"
            >
              <Flex
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'center', md: 'flex-start' }}
                mb={8}
              >
                <Avatar
                  size="2xl"
                  src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account}`}
                  mb={{ base: 4, md: 0 }}
                  mr={{ base: 0, md: 8 }}
                  bg="teal.500"
                />

                <VStack align="flex-start" spacing={3} flex={1}>
                  <Heading size="md">Wallet Address</Heading>
                  <Text wordBreak="break-all">{account}</Text>

                  {isRegistered && (
                    <>
                      <HStack>
                        <Heading size="md">Artisan Status:</Heading>
                        <Badge
                          colorScheme={isVerified ? 'green' : 'yellow'}
                          p={2}
                          borderRadius="full"
                        >
                          {isVerified ? 'Verified' : 'Pending Verification'}
                        </Badge>
                      </HStack>

                      {isVerified && (
                        <Flex align="center" color="green.500">
                          <FiCheckCircle style={{ marginRight: '8px' }} />
                          <Text>You can now create NFTs for your artisanal goods</Text>
                        </Flex>
                      )}
                    </>
                  )}
                </VStack>
              </Flex>

              <Divider my={6} />

              <Box as="form" onSubmit={handleSubmit}>
                <Heading size="md" mb={6}>
                  {isRegistered ? 'Update Artisan Information' : 'Register as an Artisan'}
                </Heading>

                <VStack spacing={4} align="stretch">
                  {updateSuccess && (
                    <Alert status="success" borderRadius="md">
                      <AlertIcon />
                      Your profile has been updated successfully!
                    </Alert>
                  )}

                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      isDisabled={registering}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Location in Chennai</FormLabel>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Mylapore, T. Nagar, etc."
                      isDisabled={registering}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Craft Specialization</FormLabel>
                    <Input
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g., Pottery, Textiles, Jewelry, etc."
                      isDisabled={registering}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contact Information</FormLabel>
                    <Textarea
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="Email, phone number, or other contact details"
                      rows={3}
                      isDisabled={registering}
                    />
                  </FormControl>

                  <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={registering}
                    loadingText="Submitting..."
                    type="submit"
                    size="lg"
                  >
                    {isRegistered ? 'Update Information' : 'Register as Artisan'}
                  </Button>
                </VStack>
              </Box>
            </Box>
          </TabPanel>

          {/* My Items Tab */}
          <TabPanel>
            <Box>
              <Heading size="md" mb={6}>
                My Artisanal NFTs
              </Heading>

              {loading ? (
                <Box textAlign="center" py={10}>
                  <Spinner size="xl" color="teal.500" mb={4} />
                  <Text>Loading your items...</Text>
                </Box>
              ) : myNFTs.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                  {myNFTs.map((nft) => (
                    <NFTCard key={nft.tokenId} nft={nft} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text mb={4}>You don't have any artisanal NFTs yet.</Text>
                  {isVerified ? (
                    <Button
                      colorScheme="teal"
                      as="a"
                      href="/create"
                    >
                      Create Your First NFT
                    </Button>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      Register as an artisan and get verified to create NFTs.
                    </Text>
                  )}
                </Box>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Profile;
