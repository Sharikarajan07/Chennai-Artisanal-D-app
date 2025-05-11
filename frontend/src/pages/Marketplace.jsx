import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Spinner,
  Switch,
  FormControl,
  FormLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiEye } from 'react-icons/fi';
import NFTCard from '../components/NFTCard';
import { getAllNFTs, getCurrentAccount } from '../utils/blockchain';

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [page, setPage] = useState(1);
  const [showHidden, setShowHidden] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);

        // Check if user is logged in to enable hidden NFT toggle
        try {
          await getCurrentAccount();
          setIsOwner(true);
        } catch (error) {
          setIsOwner(false);
        }

        // Fetch NFTs, including hidden ones if showHidden is true
        const allNfts = await getAllNFTs(0, 100, showHidden);
        setNfts(allNfts);
        setFilteredNfts(allNfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [showHidden]);

  useEffect(() => {
    // Filter and sort NFTs based on search term and sort option
    let filtered = [...nfts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          nft.materials.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
        break;
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredNfts(filtered);
    setPage(1); // Reset to first page when filters change
  }, [nfts, searchTerm, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredNfts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedNfts = filteredNfts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container maxW="7xl" py={8}>
      <Heading as="h1" mb={2}>
        Artisanal Marketplace
      </Heading>
      <Text mb={8} color={useColorModeValue('gray.600', 'gray.400')}>
        Discover authentic handcrafted items from Chennai's finest artisans
      </Text>

      {/* Filters and Search */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        mb={8}
        gap={4}
        align={{ base: 'stretch', md: 'center' }}
        wrap="wrap"
      >
        <InputGroup maxW={{ base: 'full', md: '400px' }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by name, description, or materials"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Select
          maxW={{ base: 'full', md: '200px' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="nameAsc">Name (A-Z)</option>
          <option value="nameDesc">Name (Z-A)</option>
        </Select>

        {/* Show Hidden NFTs Toggle (only for logged-in users) */}
        {isOwner && (
          <FormControl display="flex" alignItems="center" maxW={{ base: 'full', md: '250px' }}>
            <FormLabel htmlFor="show-hidden" mb="0" fontSize="sm" display="flex" alignItems="center">
              <FiEye style={{ marginRight: '8px' }} />
              Show Hidden NFTs
            </FormLabel>
            <Switch
              id="show-hidden"
              colorScheme="teal"
              isChecked={showHidden}
              onChange={() => setShowHidden(!showHidden)}
            />
          </FormControl>
        )}
      </Flex>

      {/* NFT Grid */}
      {loading ? (
        <Flex justify="center" align="center" minH="300px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : filteredNfts.length > 0 ? (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {paginatedNfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </SimpleGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Flex justify="center" mt={10} gap={2}>
              <Button
                onClick={() => setPage(page - 1)}
                isDisabled={page === 1}
                size="sm"
                colorScheme="teal"
                variant="outline"
              >
                Previous
              </Button>

              <Text alignSelf="center">
                Page {page} of {totalPages}
              </Text>

              <Button
                onClick={() => setPage(page + 1)}
                isDisabled={page === totalPages}
                size="sm"
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            </Flex>
          )}
        </>
      ) : (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" mb={4}>
            No items found matching your criteria.
          </Text>
          {searchTerm && (
            <Button onClick={() => setSearchTerm('')} colorScheme="teal" size="sm">
              Clear Search
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Marketplace;
