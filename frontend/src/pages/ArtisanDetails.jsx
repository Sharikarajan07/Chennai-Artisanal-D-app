import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Avatar,
  Badge,
  Divider,
  Button,
  Spinner,
  useToast,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { getArtisanDetails, getNFTsByArtisan } from '../utils/blockchain';
import NFTCard from '../components/NFTCard';

const ArtisanDetails = () => {
  const { address } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  
  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get artisan details
        try {
          const details = await getArtisanDetails(address);
          
          if (details && details.name) {
            setArtisan({
              address,
              name: details.name,
              location: details.location,
              specialization: details.specialization,
              contactInfo: details.contactInfo,
              isVerified: details.isVerified,
              registrationDate: details.registrationDate.toNumber()
            });
            
            // Only fetch NFTs if artisan is verified
            if (details.isVerified) {
              const artisanNfts = await getNFTsByArtisan(address);
              setNfts(artisanNfts);
            }
          }
        } catch (artisanError) {
          console.error('Error fetching artisan details:', artisanError);
          setError('Artisan not found or not registered.');
          toast({
            title: 'Error',
            description: 'Artisan not found or not registered.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching artisan data:', error);
        setError('Failed to load artisan data. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load artisan data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (address) {
      fetchArtisanData();
    }
  }, [address, toast]);
  
  return (
    <Container maxW="7xl" py={8}>
      <Button
        as={Link}
        to="/artisans"
        leftIcon={<FiArrowLeft />}
        mb={8}
        variant="outline"
      >
        Back to Artisans
      </Button>
      
      {loading ? (
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Flex>
      ) : error ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : artisan ? (
        <>
          <Box
            bg={bgColor}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            mb={8}
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'center', md: 'flex-start' }}
            >
              <Avatar
                size="2xl"
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`}
                mb={{ base: 4, md: 0 }}
                mr={{ base: 0, md: 8 }}
                bg="teal.500"
              />
              
              <VStack align="flex-start" spacing={3} flex={1}>
                <Heading size="lg">{artisan.name}</Heading>
                <HStack>
                  <Badge
                    colorScheme={artisan.isVerified ? 'green' : 'yellow'}
                    p={2}
                    borderRadius="full"
                  >
                    {artisan.isVerified ? 'Verified Artisan' : 'Pending Verification'}
                  </Badge>
                </HStack>
                
                <Text fontSize="lg">
                  <strong>Location:</strong> {artisan.location}
                </Text>
                <Text fontSize="lg">
                  <strong>Specialization:</strong> {artisan.specialization}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Registered on {new Date(artisan.registrationDate * 1000).toLocaleDateString()}
                </Text>
              </VStack>
            </Flex>
          </Box>
          
          <Divider my={8} />
          
          <Heading size="lg" mb={6}>
            Artisanal Creations
          </Heading>
          
          {nfts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
              {nfts.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" mb={4}>
                {artisan.isVerified
                  ? 'This artisan has not created any items yet.'
                  : 'This artisan needs to be verified before they can create items.'}
              </Text>
            </Box>
          )}
        </>
      ) : (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Not Found</AlertTitle>
          <AlertDescription>Artisan not found or not registered.</AlertDescription>
        </Alert>
      )}
    </Container>
  );
};

export default ArtisanDetails;
