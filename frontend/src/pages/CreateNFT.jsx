import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import FileUpload from '../components/FileUpload';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '../utils/ipfs';
import { getCurrentAccount, isVerifiedArtisan, mintNFT } from '../utils/blockchain';

const CreateNFT = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [account, setAccount] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkArtisanStatus = async () => {
      try {
        const address = await getCurrentAccount();
        setAccount(address);

        const verified = await isVerifiedArtisan(address);
        setIsVerified(verified);
      } catch (error) {
        console.error('Error checking artisan status:', error);
        toast({
          title: 'Error',
          description: 'Failed to check artisan verification status.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    checkArtisanStatus();
  }, [toast]);

  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);

      // Upload image to IPFS
      const result = await uploadFileToIPFS(file);

      if (result.success) {
        setImageUrl(`ipfs://${result.ipfsHash}`);

        toast({
          title: 'Success',
          description: 'Image uploaded to IPFS successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image to IPFS.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !materials || !imageUrl) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all fields and upload an image.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create metadata
      const metadata = {
        name,
        description,
        materials,
        image: imageUrl,
        attributes: [
          {
            trait_type: 'Materials',
            value: materials,
          },
          {
            trait_type: 'Creator',
            value: account,
          },
          {
            trait_type: 'Creation Date',
            value: new Date().toISOString(),
          },
        ],
      };

      // Upload metadata to IPFS
      const metadataResult = await uploadMetadataToIPFS(metadata);

      if (!metadataResult.success) {
        throw new Error(metadataResult.message || 'Failed to upload metadata');
      }

      // Mint NFT
      const tx = await mintNFT(
        metadataResult.tokenURI,
        name,
        description,
        materials
      );

      toast({
        title: 'Success',
        description: 'Your artisanal item has been minted as an NFT!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate to the user's items page
      navigate('/my-items');
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast({
        title: 'Error',
        description: 'Failed to create NFT. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVerified) {
    return (
      <Container maxW="3xl" py={8}>
        <Alert
          status="warning"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="md"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Verification Required
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Only verified artisans can create NFTs. Please register as an artisan and wait for verification.
          </AlertDescription>
          <Button
            mt={4}
            colorScheme="teal"
            onClick={() => navigate('/profile')}
          >
            Go to Profile
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="3xl" py={8}>
      <Heading as="h1" mb={2}>
        Create Artisanal NFT
      </Heading>
      <Text mb={8} color={useColorModeValue('gray.600', 'gray.400')}>
        Mint your handcrafted item as an NFT with verifiable provenance
      </Text>

      <Box
        as="form"
        onSubmit={handleSubmit}
        bg={useColorModeValue('white', 'gray.700')}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={6} align="stretch">
          <FileUpload onFileUpload={handleFileUpload} />

          <Divider />

          <FormControl isRequired>
            <FormLabel>Item Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Traditional Clay Pot"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your handcrafted item, its significance, and unique features..."
              rows={4}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Materials Used</FormLabel>
            <Input
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="e.g., Clay, Natural dyes, Cotton"
            />
          </FormControl>

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isLoading || isUploading}
            loadingText={isUploading ? "Uploading..." : "Creating..."}
            type="submit"
            size="lg"
            w="full"
          >
            Create NFT
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default CreateNFT;
