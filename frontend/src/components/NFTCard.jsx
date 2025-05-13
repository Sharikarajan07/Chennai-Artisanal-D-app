import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Image,
  Heading,
  Text,
  Stack,
  Badge,
  Button,
  Flex,
  useColorModeValue,
  Skeleton,
  HStack,
  Icon,
  Tag,
  Tooltip
} from '@chakra-ui/react';
import { FiEyeOff, FiInfo, FiCalendar, FiPackage, FiArrowRight } from 'react-icons/fi';
import { fetchFromIPFS } from '../utils/ipfs';

const NFTCard = ({ nft }) => {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMetadata = async () => {
      try {
        setLoading(true);
        const result = await fetchFromIPFS(nft.tokenURI);
        if (result.success) {
          setMetadata(result.data);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    getMetadata();
  }, [nft.tokenURI]);

  return (
    <Box
      maxW={'330px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'xl'}
      rounded={'xl'}
      overflow={'hidden'}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: '2xl',
      }}
      position="relative"
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
    >
      {/* Hidden badge - absolute positioned */}
      {nft.isHidden && (
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme="gray"
          display="flex"
          alignItems="center"
          px={2}
          py={1}
          borderRadius="full"
          zIndex={1}
          boxShadow="md"
        >
          <Icon as={FiEyeOff} mr={1} />
          Hidden
        </Badge>
      )}

      {/* Image section */}
      <Box position="relative">
        <Skeleton isLoaded={!loading} height="220px" width="100%">
          <Image
            h={'220px'}
            w={'full'}
            src={metadata?.image?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') || 'https://via.placeholder.com/300'}
            objectFit={'cover'}
            alt={metadata?.name || nft.name}
            transition="transform 0.3s ease"
            _hover={{ transform: 'scale(1.05)' }}
          />
        </Skeleton>

        {/* Artisan badge */}
        <Tooltip label={`Created by ${nft.artisan}`} placement="top">
          <Tag
            size="sm"
            position="absolute"
            bottom={2}
            left={2}
            colorScheme="brand"
            boxShadow="md"
            borderRadius="full"
          >
            Artisan: {nft.artisan?.substring(0, 6)}...{nft.artisan?.substring(nft.artisan.length - 4)}
          </Tag>
        </Tooltip>
      </Box>

      <Box p={6}>
        {/* Title */}
        <Heading
          fontSize={'xl'}
          fontWeight={600}
          fontFamily={'heading'}
          mb={2}
          noOfLines={1}
          color={useColorModeValue('gray.800', 'white')}
        >
          {metadata?.name || nft.name}
        </Heading>

        {/* Description */}
        <Text
          fontSize={'sm'}
          color={useColorModeValue('gray.600', 'gray.300')}
          mb={4}
          noOfLines={2}
          height="40px"
        >
          {metadata?.description || nft.description}
        </Text>

        {/* Details */}
        <HStack spacing={4} mb={5} wrap="wrap">
          <Flex align="center">
            <Icon as={FiPackage} color="brand.500" mr={1} />
            <Text fontSize="xs" fontWeight="medium">
              {nft.materials?.length > 15 ? nft.materials?.substring(0, 15) + '...' : nft.materials}
            </Text>
          </Flex>

          <Flex align="center">
            <Icon as={FiCalendar} color="brand.500" mr={1} />
            <Text fontSize="xs" fontWeight="medium">
              {nft.creationDate}
            </Text>
          </Flex>
        </HStack>

        {/* Action button */}
        <Button
          as={Link}
          to={`/item/${nft.tokenId}`}
          w={'full'}
          colorScheme="brand"
          rightIcon={<Icon as={FiArrowRight} />}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          }}
          transition="all 0.2s"
          fontWeight="medium"
          size="md"
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default NFTCard;
