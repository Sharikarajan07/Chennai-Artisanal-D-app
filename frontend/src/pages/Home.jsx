import { Box, Heading, Text, Button, Stack, Flex, Image, Container, SimpleGrid, Icon, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getAllNFTs } from '../utils/blockchain';
import NFTCard from '../components/NFTCard';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'teal.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function Home() {
  const [featuredNFTs, setFeaturedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedNFTs = async () => {
      try {
        setLoading(true);
        const nfts = await getAllNFTs(0, 3);
        setFeaturedNFTs(nfts);
      } catch (error) {
        console.error('Error fetching featured NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNFTs();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
      >
        <Container maxW={'7xl'} py={12}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text
                  as={'span'}
                  position={'relative'}
                  _after={{
                    content: "''",
                    width: 'full',
                    height: '30%',
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: 'teal.400',
                    zIndex: -1,
                  }}
                >
                  Chennai Artisanal
                </Text>
                <br />
                <Text as={'span'} color={'teal.400'}>
                  Goods Provenance
                </Text>
              </Heading>
              <Text color={'gray.500'}>
                Discover authentic artisanal goods from Chennai's finest craftspeople.
                Our blockchain-based platform ensures transparency and authenticity,
                connecting you directly with local artisans and their unique creations.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  as={Link}
                  to="/marketplace"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  colorScheme={'teal'}
                  bg={'teal.400'}
                  _hover={{ bg: 'teal.500' }}
                >
                  Explore Marketplace
                </Button>
                <Button
                  as={Link}
                  to="/artisans"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  leftIcon={<FiUsers />}
                >
                  Meet the Artisans
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
            >
              <Box
                position={'relative'}
                height={'300px'}
                rounded={'2xl'}
                boxShadow={'2xl'}
                width={'full'}
                overflow={'hidden'}
              >
                <Image
                  alt={'Hero Image'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={'https://images.unsplash.com/photo-1603197788269-c76935142cb7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'}
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={12}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>How It Works</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Our platform connects artisans with buyers through blockchain technology,
            ensuring authenticity and transparency.
          </Text>
        </Stack>

        <Container maxW={'6xl'} mt={10}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={FiCheckCircle} w={10} h={10} />}
              title={'Verified Artisans'}
              text={'All artisans are verified to ensure authenticity and quality of craftsmanship.'}
            />
            <Feature
              icon={<Icon as={FiShoppingBag} w={10} h={10} />}
              title={'Transparent Marketplace'}
              text={'Every item comes with verifiable provenance on the blockchain.'}
            />
            <Feature
              icon={<Icon as={FiUsers} w={10} h={10} />}
              title={'Direct Connection'}
              text={'Connect directly with artisans and learn about their craft and story.'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Featured Items Section */}
      <Box py={12} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW={'7xl'}>
          <Heading fontSize={'3xl'} mb={6} textAlign={'center'}>
            Featured Artisanal Goods
          </Heading>

          {loading ? (
            <Text textAlign="center">Loading featured items...</Text>
          ) : featuredNFTs.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {featuredNFTs.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text mb={4}>No items available yet.</Text>
              <Button
                as={Link}
                to="/create"
                colorScheme="teal"
                size="md"
              >
                Create the first item
              </Button>
            </Box>
          )}

          <Box textAlign="center" mt={10}>
            <Button
              as={Link}
              to="/marketplace"
              size="lg"
              colorScheme="teal"
              variant="outline"
            >
              View All Items
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
