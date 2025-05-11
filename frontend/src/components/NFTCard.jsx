import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Image, Heading, Text, Stack, Badge, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { FiEyeOff } from 'react-icons/fi';
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
      boxShadow={'2xl'}
      rounded={'lg'}
      overflow={'hidden'}
      transition="transform 0.3s"
      _hover={{ transform: 'scale(1.03)' }}
    >
      {loading ? (
        <Box height="200px" bg="gray.100" />
      ) : (
        <Image
          h={'200px'}
          w={'full'}
          src={metadata?.image?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') || 'https://via.placeholder.com/300'}
          objectFit={'cover'}
          alt={metadata?.name || nft.name}
        />
      )}

      <Box p={6}>
        {nft.isHidden && (
          <Flex justify="center" mb={2}>
            <Badge
              colorScheme="gray"
              display="flex"
              alignItems="center"
              px={2}
              py={1}
            >
              <FiEyeOff style={{ marginRight: '4px' }} />
              Hidden
            </Badge>
          </Flex>
        )}

        <Stack spacing={0} align={'center'} mb={5}>
          <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
            {metadata?.name || nft.name}
          </Heading>
          <Text color={'gray.500'}>Created by {nft.artisan?.substring(0, 6)}...{nft.artisan?.substring(nft.artisan.length - 4)}</Text>
        </Stack>

        <Stack direction={'row'} justify={'center'} spacing={6} mb={4}>
          <Stack spacing={0} align={'center'}>
            <Text fontWeight={600}>Materials</Text>
            <Text fontSize={'sm'} color={'gray.500'}>
              {nft.materials?.length > 20 ? nft.materials?.substring(0, 20) + '...' : nft.materials}
            </Text>
          </Stack>
          <Stack spacing={0} align={'center'}>
            <Text fontWeight={600}>Created</Text>
            <Text fontSize={'sm'} color={'gray.500'}>
              {nft.creationDate}
            </Text>
          </Stack>
        </Stack>

        <Box mb={4}>
          <Text fontSize={'sm'} noOfLines={2}>
            {metadata?.description || nft.description}
          </Text>
        </Box>

        <Button
          as={Link}
          to={`/item/${nft.tokenId}`}
          w={'full'}
          mt={2}
          bg={useColorModeValue('teal.400', 'teal.800')}
          color={'white'}
          rounded={'md'}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default NFTCard;
