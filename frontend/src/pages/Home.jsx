import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  Container,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Divider,
  HStack,
  VStack,
  Badge,
  Skeleton,
  Avatar,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiShield,
  FiGlobe,
  FiTrendingUp
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getAllNFTs } from '../utils/blockchain';
import NFTCard from '../components/NFTCard';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack
      align={'center'}
      textAlign={'center'}
      bg={useColorModeValue('white', 'gray.800')}
      rounded={'xl'}
      boxShadow={'md'}
      p={6}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      height="100%"
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={useColorModeValue('brand.500', 'brand.400')}
        mb={4}
        boxShadow="md"
      >
        {icon}
      </Flex>
      <Heading as="h3" size="md" fontFamily="heading" mb={2}>
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {text}
      </Text>
    </Stack>
  );
};

// Testimonial component
const Testimonial = ({ name, role, content, avatar }) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      p={8}
      rounded="xl"
      shadow="md"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      className="scale-in"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
    >
      <Flex direction="column" h="full">
        <Icon
          as={FiStar}
          color="accent.500"
          boxSize={8}
          mb={4}
        />
        <Text
          fontSize="md"
          fontStyle="italic"
          mb={6}
          flex="1"
        >
          "{content}"
        </Text>
        <Flex align="center">
          <Avatar
            src={avatar}
            size="md"
            mr={4}
            bg="brand.500"
          />
          <Box>
            <Text fontWeight="bold">{name}</Text>
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
              {role}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
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
    <Box className="slide-up">
      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        bg={useColorModeValue('white', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}
      >
        {/* Background gradient */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="100%"
          bg={useColorModeValue(
            'linear-gradient(135deg, rgba(236,253,245,0.6) 0%, rgba(209,250,229,0.6) 100%)',
            'linear-gradient(135deg, rgba(45,55,72,0.8) 0%, rgba(26,32,44,0.8) 100%)'
          )}
          zIndex={0}
        />

        {/* Decorative elements */}
        <Box
          position="absolute"
          top="10%"
          left="5%"
          width="300px"
          height="300px"
          borderRadius="full"
          bg={useColorModeValue('brand.50', 'brand.900')}
          filter="blur(70px)"
          opacity="0.4"
          zIndex={0}
        />

        <Box
          position="absolute"
          bottom="10%"
          right="5%"
          width="250px"
          height="250px"
          borderRadius="full"
          bg={useColorModeValue('accent.50', 'accent.900')}
          filter="blur(70px)"
          opacity="0.4"
          zIndex={0}
        />

        <Container maxW={'7xl'} py={{ base: 16, md: 20 }} position="relative" zIndex={1}>
          <Stack
            align={'center'}
            spacing={{ base: 12, md: 16 }}
            py={{ base: 16, md: 24 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 6, md: 8 }} maxW={{ base: "100%", md: "600px" }}>
              <Badge
                alignSelf="start"
                colorScheme="brand"
                fontSize="sm"
                fontWeight="bold"
                px={4}
                py={1.5}
                rounded="full"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={2}
                boxShadow="sm"
              >
                Blockchain Verified
              </Badge>

              <Heading
                lineHeight={1.1}
                fontWeight={700}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
                fontFamily="heading"
              >
                <Text
                  as={'span'}
                  position={'relative'}
                  bgGradient="linear(to-r, brand.400, brand.600)"
                  bgClip="text"
                  display="inline-block"
                  mb={3}
                >
                  Chennai Artisanal
                </Text>
                <br />
                <Text
                  as={'span'}
                  fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
                  color={useColorModeValue('gray.800', 'gray.100')}
                  lineHeight={1.3}
                >
                  Authentic Craftsmanship with Blockchain Provenance
                </Text>
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={useColorModeValue('gray.600', 'gray.300')}
                lineHeight={1.6}
              >
                Discover authentic artisanal goods from Chennai's finest craftspeople.
                Our blockchain-based platform ensures transparency and authenticity,
                connecting you directly with local artisans and their unique creations.
              </Text>

              <Stack
                spacing={{ base: 5, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
                pt={6}
                mt={2}
              >
                <Button
                  as={Link}
                  to="/marketplace"
                  size={'lg'}
                  fontWeight={'medium'}
                  px={8}
                  py={7}
                  height="60px"
                  colorScheme={'brand'}
                  rightIcon={<Icon as={FiArrowRight} boxSize={5} />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                  fontSize="md"
                >
                  Explore Marketplace
                </Button>
                <Button
                  as={Link}
                  to="/artisans"
                  size={'lg'}
                  fontWeight={'medium'}
                  px={8}
                  py={7}
                  height="60px"
                  leftIcon={<Icon as={FiUsers} boxSize={5} />}
                  variant="outline"
                  colorScheme="brand"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'md',
                    bg: useColorModeValue('brand.50', 'brand.900'),
                  }}
                  transition="all 0.2s"
                  fontSize="md"
                >
                  Meet the Artisans
                </Button>
              </Stack>

              {/* Trust indicators */}
              <HStack spacing={6} pt={6} wrap="wrap" mt={2}>
                <Flex align="center" bg={useColorModeValue('white', 'gray.800')} px={4} py={2} rounded="full" boxShadow="sm">
                  <Icon as={FiShield} color="green.500" mr={2} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium">Secure Transactions</Text>
                </Flex>
                <Flex align="center" bg={useColorModeValue('white', 'gray.800')} px={4} py={2} rounded="full" boxShadow="sm">
                  <Icon as={FiCheckCircle} color="brand.500" mr={2} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium">Verified Artisans</Text>
                </Flex>
                <Flex align="center" bg={useColorModeValue('white', 'gray.800')} px={4} py={2} rounded="full" boxShadow="sm">
                  <Icon as={FiGlobe} color="accent.500" mr={2} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium">Global Shipping</Text>
                </Flex>
              </HStack>
            </Stack>

            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
              ml={{ base: 0, md: 6 }}
            >
              <Box
                position={'relative'}
                height={'450px'}
                rounded={'2xl'}
                boxShadow={'2xl'}
                width={'full'}
                overflow={'hidden'}
                transform="rotate(2deg)"
                transition="all 0.3s ease"
                _hover={{ transform: 'rotate(0deg) scale(1.02)' }}
                bg={useColorModeValue('gray.100', 'gray.700')}
              >
                {/* Fallback background color in case image doesn't load */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg={useColorModeValue('brand.50', 'brand.900')}
                  opacity={0.3}
                />

                {/* Multiple image sources for better reliability */}
                <Image
                  alt={'Handcrafted artisanal goods from Chennai'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                  fallbackSrc={'https://images.pexels.com/photos/4992669/pexels-photo-4992669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                  loading="eager"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/4992669/pexels-photo-4992669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                  }}
                />

                {/* Overlay with gradient */}
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  bg="linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)"
                  p={6}
                  color="white"
                >
                  <Text fontWeight="bold" fontSize="xl">Handcrafted Excellence</Text>
                  <Text fontSize="md">Traditional craftsmanship meets modern technology</Text>
                </Box>
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW={'7xl'}>
          <Stack spacing={8} as={Container} maxW={'3xl'} textAlign={'center'} mb={16}>
            <Heading
              fontSize={'4xl'}
              fontFamily="heading"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
            >
              How It Works
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize={'xl'} maxW="800px" mx="auto">
              Our platform connects artisans with buyers through blockchain technology,
              ensuring authenticity and transparency at every step of the process.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={FiCheckCircle} w={8} h={8} />}
              title={'Verified Artisans'}
              text={'All artisans undergo a thorough verification process to ensure authenticity and quality of craftsmanship before they can list their creations.'}
            />
            <Feature
              icon={<Icon as={FiShoppingBag} w={8} h={8} />}
              title={'Transparent Marketplace'}
              text={'Every item comes with verifiable provenance on the blockchain, allowing you to trace its origin, materials, and creation process.'}
            />
            <Feature
              icon={<Icon as={FiUsers} w={8} h={8} />}
              title={'Direct Connection'}
              text={'Connect directly with artisans to learn about their craft, story, and the cultural significance behind their unique creations.'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW={'7xl'}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={16}>
            <Heading
              fontSize={'4xl'}
              fontFamily="heading"
              bgGradient="linear(to-r, accent.400, accent.600)"
              bgClip="text"
            >
              What Our Community Says
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize={'xl'}>
              Hear from artisans and collectors who are part of our growing community.
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Testimonial
              name="Priya Sharma"
              role="Textile Artisan, Chennai"
              content="Being part of Chennai Artisanal has transformed my business. I can now reach customers globally while maintaining the authenticity of my craft."
              avatar="https://api.dicebear.com/7.x/personas/svg?seed=Priya"
            />
            <Testimonial
              name="Rajiv Mehta"
              role="Art Collector"
              content="The blockchain verification gives me confidence that I'm purchasing authentic pieces. I love being able to directly connect with the artisans."
              avatar="https://api.dicebear.com/7.x/personas/svg?seed=Rajiv"
            />
            <Testimonial
              name="Ananya Patel"
              role="Jewelry Designer"
              content="This platform has helped me showcase the traditional techniques behind my jewelry. Customers appreciate knowing the story and provenance of each piece."
              avatar="https://api.dicebear.com/7.x/personas/svg?seed=Ananya"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Featured Items Section */}
      <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW={'7xl'}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={16}>
            <Heading
              fontSize={'4xl'}
              fontFamily="heading"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
            >
              Featured Artisanal Goods
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize={'xl'}>
              Discover unique handcrafted items with verified provenance
            </Text>
          </Stack>

          {loading ? (
            <Stack spacing={8}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                {[1, 2, 3].map((i) => (
                  <Box
                    key={i}
                    bg={useColorModeValue('white', 'gray.800')}
                    boxShadow={'md'}
                    rounded={'xl'}
                    overflow={'hidden'}
                    height="450px"
                  >
                    <Skeleton height="220px" width="100%" />
                    <Box p={6}>
                      <Skeleton height="30px" width="80%" mb={4} />
                      <Skeleton height="20px" width="90%" mb={2} />
                      <Skeleton height="20px" width="60%" mb={4} />
                      <Skeleton height="40px" width="100%" mt={6} />
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </Stack>
          ) : featuredNFTs.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              {featuredNFTs.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </SimpleGrid>
          ) : (
            <Box
              textAlign="center"
              py={10}
              bg={useColorModeValue('gray.50', 'gray.700')}
              rounded="xl"
              p={10}
              boxShadow="md"
            >
              <Icon as={FiShoppingBag} boxSize={12} color="brand.400" mb={4} />
              <Heading as="h3" size="lg" mb={4} fontFamily="heading">
                No items available yet
              </Heading>
              <Text mb={6} maxW="500px" mx="auto">
                Be the first to create an artisanal item with verified blockchain provenance.
              </Text>
              <Button
                as={Link}
                to="/create"
                colorScheme="brand"
                size="lg"
                rightIcon={<Icon as={FiArrowRight} />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
              >
                Create the first item
              </Button>
            </Box>
          )}

          {featuredNFTs.length > 0 && (
            <Flex justify="center" mt={16}>
              <Button
                as={Link}
                to="/marketplace"
                size="lg"
                colorScheme="brand"
                variant="outline"
                rightIcon={<Icon as={FiArrowRight} />}
                px={8}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                  bg: useColorModeValue('brand.50', 'brand.900'),
                }}
                transition="all 0.2s"
              >
                Explore All Items
              </Button>
            </Flex>
          )}
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={16} bg={useColorModeValue('brand.50', 'brand.900')}>
        <Container maxW={'7xl'}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            <VStack align="center">
              <Heading
                fontSize="5xl"
                fontFamily="heading"
                color={useColorModeValue('brand.500', 'brand.200')}
              >
                100+
              </Heading>
              <Text fontWeight="medium">Verified Artisans</Text>
            </VStack>

            <VStack align="center">
              <Heading
                fontSize="5xl"
                fontFamily="heading"
                color={useColorModeValue('brand.500', 'brand.200')}
              >
                500+
              </Heading>
              <Text fontWeight="medium">Unique Creations</Text>
            </VStack>

            <VStack align="center">
              <Heading
                fontSize="5xl"
                fontFamily="heading"
                color={useColorModeValue('brand.500', 'brand.200')}
              >
                50+
              </Heading>
              <Text fontWeight="medium">Traditional Crafts</Text>
            </VStack>

            <VStack align="center">
              <Heading
                fontSize="5xl"
                fontFamily="heading"
                color={useColorModeValue('brand.500', 'brand.200')}
              >
                1000+
              </Heading>
              <Text fontWeight="medium">Happy Customers</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg={useColorModeValue('white', 'gray.800')}>
        <Container maxW={'5xl'} textAlign="center">
          <Heading
            fontSize={'4xl'}
            fontFamily="heading"
            mb={6}
          >
            Ready to discover authentic{' '}
            <Text
              as="span"
              bgGradient="linear(to-r, brand.400, accent.500)"
              bgClip="text"
            >
              artisanal treasures
            </Text>
            ?
          </Heading>

          <Text fontSize="xl" mb={10} maxW="800px" mx="auto">
            Join our community of artisans and collectors passionate about preserving traditional craftsmanship with modern technology.
          </Text>

          <Wrap spacing={6} justify="center">
            <WrapItem>
              <Button
                as={Link}
                to="/marketplace"
                size="lg"
                colorScheme="brand"
                px={8}
                py={7}
                rightIcon={<Icon as={FiShoppingBag} />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Browse Marketplace
              </Button>
            </WrapItem>

            <WrapItem>
              <Button
                as={Link}
                to="/artisans"
                size="lg"
                colorScheme="accent"
                px={8}
                py={7}
                rightIcon={<Icon as={FiUsers} />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Meet Our Artisans
              </Button>
            </WrapItem>
          </Wrap>
        </Container>
      </Box>
    </Box>
  );
}
