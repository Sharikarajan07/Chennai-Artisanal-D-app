import { Box, Container, SimpleGrid, Stack, Text, Flex, Heading, Link, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({ children, label, href }) => {
  return (
    <Link
      href={href}
      isExternal
      rounded={'full'}
      w={8}
      h={8}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('brand.100', 'brand.700'),
        color: useColorModeValue('brand.500', 'brand.300'),
        transform: 'translateY(-2px)',
      }}
    >
      <span>{children}</span>
    </Link>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTopWidth={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container as={Stack} maxW={'7xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Heading
                as="h2"
                fontSize="2xl"
                fontFamily="heading"
                bgGradient="linear(to-r, brand.500, accent.500)"
                bgClip="text"
              >
                Chennai Artisanal
              </Heading>
            </Box>
            <Text fontSize={'sm'}>
              Connecting artisans with global markets through blockchain technology.
              Preserving traditional craftsmanship with modern provenance solutions.
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'#'}>
                <Icon as={FiTwitter} />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <Icon as={FiInstagram} />
              </SocialButton>
              <SocialButton label={'GitHub'} href={'#'}>
                <Icon as={FiGithub} />
              </SocialButton>
              <SocialButton label={'LinkedIn'} href={'#'}>
                <Icon as={FiLinkedin} />
              </SocialButton>
              <SocialButton label={'Email'} href={'mailto:info@chennaiartisanal.com'}>
                <Icon as={FiMail} />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Platform</ListHeader>
            <Link as={RouterLink} to="/">Home</Link>
            <Link as={RouterLink} to="/marketplace">Marketplace</Link>
            <Link as={RouterLink} to="/artisans">Artisans</Link>
            <Link as={RouterLink} to="/create">Create NFT</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Support</ListHeader>
            <Link href={'#'}>Help Center</Link>
            <Link href={'#'}>Terms of Service</Link>
            <Link href={'#'}>Privacy Policy</Link>
            <Link href={'#'}>Contact Us</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Resources</ListHeader>
            <Link href={'#'}>Documentation</Link>
            <Link href={'#'}>Blockchain Guide</Link>
            <Link href={'#'}>Artisan Stories</Link>
            <Link href={'#'}>Blog</Link>
          </Stack>
        </SimpleGrid>
      </Container>
      <Box
        borderTopWidth={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container
          as={Stack}
          maxW={'7xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text>© {currentYear} Chennai Artisanal. All rights reserved</Text>
          <Flex direction={{ base: 'column', sm: 'row' }} align="center" gap={4}>
            <Text>Powered by</Text>
            <Text fontWeight="bold">Ethereum Blockchain</Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
