import {
  Box,
  Flex,
  Text,
  Badge,
  Avatar,
  useColorModeValue,
  Button,
  Heading,
  Icon,
  HStack,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiAward, FiArrowRight } from 'react-icons/fi';

const ArtisanCard = ({ artisan }) => {
  const { name, location, specialization, isVerified, registrationDate, address } = artisan;

  return (
    <Box
      maxW={'330px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'xl'}
      rounded={'xl'}
      overflow="hidden"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: '2xl',
      }}
    >
      {/* Header with background color */}
      <Box
        bg={useColorModeValue('brand.50', 'brand.900')}
        p={6}
        textAlign="center"
        position="relative"
      >
        {/* Verification badge */}
        {isVerified && (
          <Tooltip label="Verified Artisan" placement="top">
            <Badge
              position="absolute"
              top={4}
              right={4}
              colorScheme="green"
              display="flex"
              alignItems="center"
              px={2}
              py={1}
              borderRadius="full"
              boxShadow="md"
            >
              <Icon as={FiAward} mr={1} />
              Verified
            </Badge>
          </Tooltip>
        )}

        {/* Avatar */}
        <Avatar
          size={'xl'}
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`}
          mb={4}
          border="4px solid"
          borderColor={useColorModeValue('white', 'gray.800')}
          bg="brand.500"
          boxShadow="lg"
        />

        {/* Name and location */}
        <Heading
          as="h3"
          size="md"
          fontFamily="heading"
          mb={1}
        >
          {name}
        </Heading>

        <Flex align="center" justify="center" color={useColorModeValue('gray.600', 'gray.400')}>
          <Icon as={FiMapPin} mr={1} />
          <Text fontSize="sm">{location}</Text>
        </Flex>
      </Box>

      <Divider />

      {/* Content */}
      <Box p={6}>
        {/* Specialization */}
        <Box mb={4}>
          <Text
            fontWeight="medium"
            fontSize="sm"
            color={useColorModeValue('gray.500', 'gray.400')}
            mb={1}
          >
            SPECIALIZATION
          </Text>
          <Text
            fontWeight="semibold"
            color={useColorModeValue('brand.600', 'brand.300')}
          >
            {specialization}
          </Text>
        </Box>

        {/* Registration date */}
        <HStack spacing={2} mb={6} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          <Icon as={FiCalendar} />
          <Text>
            Registered on {new Date(registrationDate * 1000).toLocaleDateString()}
          </Text>
        </HStack>

        {/* Action button */}
        <Button
          as={Link}
          to={`/artisan/${address}`}
          w={'full'}
          colorScheme="brand"
          rightIcon={<Icon as={FiArrowRight} />}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          }}
          transition="all 0.2s"
          fontWeight="medium"
        >
          View Creations
        </Button>
      </Box>
    </Box>
  );
};

export default ArtisanCard;
