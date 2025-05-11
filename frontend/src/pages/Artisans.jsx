import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Spinner,
  useToast,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { getAllArtisans } from '../utils/blockchain';
import ArtisanCard from '../components/ArtisanCard';

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [error, setError] = useState(null);
  
  const toast = useToast();
  
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const artisanList = await getAllArtisans();
        setArtisans(artisanList);
        setFilteredArtisans(artisanList);
      } catch (error) {
        console.error('Error fetching artisans:', error);
        setError('Failed to load artisans. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load artisans. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtisans();
  }, [toast]);
  
  // Filter artisans when search term or specialization filter changes
  useEffect(() => {
    if (artisans.length === 0) return;
    
    let result = [...artisans];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        artisan => 
          artisan.name.toLowerCase().includes(term) || 
          artisan.location.toLowerCase().includes(term)
      );
    }
    
    // Filter by specialization
    if (filterSpecialization) {
      result = result.filter(
        artisan => artisan.specialization.toLowerCase() === filterSpecialization.toLowerCase()
      );
    }
    
    setFilteredArtisans(result);
  }, [searchTerm, filterSpecialization, artisans]);
  
  // Get unique specializations for the filter dropdown
  const specializations = [...new Set(artisans.map(artisan => artisan.specialization))];
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterSpecialization('');
  };
  
  return (
    <Container maxW="7xl" py={8}>
      <Heading as="h1" mb={2}>
        Chennai Artisans
      </Heading>
      <Text mb={8} color={useColorModeValue('gray.600', 'gray.400')}>
        Discover skilled artisans and their unique creations
      </Text>
      
      {/* Filters */}
      <Box mb={8}>
        <HStack spacing={4} mb={4} wrap="wrap">
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search by name or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select
            placeholder="Filter by specialization"
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            maxW="300px"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </Select>
          
          <Button
            variant="outline"
            onClick={clearFilters}
            isDisabled={!searchTerm && !filterSpecialization}
          >
            Clear Filters
          </Button>
        </HStack>
        
        {filteredArtisans.length > 0 && (
          <Text fontSize="sm" color="gray.500">
            Showing {filteredArtisans.length} of {artisans.length} artisans
          </Text>
        )}
      </Box>
      
      {/* Loading state */}
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
      ) : filteredArtisans.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {filteredArtisans.map((artisan) => (
            <ArtisanCard key={artisan.address} artisan={artisan} />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" mb={4}>
            {artisans.length > 0
              ? 'No artisans match your filters. Try adjusting your search criteria.'
              : 'No verified artisans found. Check back later!'}
          </Text>
          {artisans.length > 0 && (
            <Button colorScheme="teal" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Artisans;
