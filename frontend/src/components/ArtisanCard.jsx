import { Box, Flex, Text, Badge, Avatar, useColorModeValue, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ArtisanCard = ({ artisan }) => {
  const { name, location, specialization, isVerified, registrationDate, address } = artisan;

  return (
    <Box
      maxW={'330px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'lg'}
      p={6}
      textAlign={'center'}
      transition="transform 0.3s"
      _hover={{ transform: 'scale(1.03)' }}
    >
      <Avatar
        size={'xl'}
        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`}
        mb={4}
        pos={'relative'}
        bg="teal.500"
      />
      <Flex justify="center" mt={-4} mb={4}>
        {isVerified && (
          <Badge
            px={2}
            py={1}
            bg={useColorModeValue('teal.300', 'teal.800')}
            fontWeight={'400'}
            color={'white'}
            rounded="full"
          >
            Verified Artisan
          </Badge>
        )}
      </Flex>
      <Flex direction="column" align="center" justify="center" mb={4}>
        <Text fontWeight={600} fontSize="xl">
          {name}
        </Text>
        <Text color={'gray.500'} fontSize="sm">
          {location}
        </Text>
      </Flex>

      <Text
        textAlign={'center'}
        color={useColorModeValue('gray.700', 'gray.400')}
        px={3}
        mb={4}
      >
        Specializes in <strong>{specialization}</strong>
      </Text>

      <Text fontSize="sm" color="gray.500" mb={4}>
        Registered on {new Date(registrationDate * 1000).toLocaleDateString()}
      </Text>

      <Button
        as={Link}
        to={`/artisan/${address}`}
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
        View Creations
      </Button>
    </Box>
  );
};

export default ArtisanCard;
