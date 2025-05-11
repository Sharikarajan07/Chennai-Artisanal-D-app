import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Flex,
  Badge,
  Button,
  VStack,
  HStack,
  Divider,
  Spinner,
  Input,
  Textarea,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiExternalLink, FiArrowLeft, FiEdit, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import {
  getNFTDetails,
  getCurrentAccount,
  addProvenanceRecord,
  updateNFTMetadata,
  burnNFT,
  hideNFT,
  showNFT,
  isNFTHidden
} from '../utils/blockchain';
import { fetchFromIPFS, uploadFileToIPFS, uploadMetadataToIPFS } from '../utils/ipfs';

const NFTDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const [nft, setNft] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(false);
  const [artisan, setArtisan] = useState(false);
  const [newRecord, setNewRecord] = useState('');
  const [addingRecord, setAddingRecord] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMaterials, setEditMaterials] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Modal controls
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose
  } = useDisclosure();

  const {
    isOpen: isBurnAlertOpen,
    onOpen: onBurnAlertOpen,
    onClose: onBurnAlertClose
  } = useDisclosure();

  const cancelRef = useRef();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchNFTDetails = async () => {
      try {
        setLoading(true);

        // Get NFT details from blockchain
        const details = await getNFTDetails(tokenId);
        setNft(details);

        // Get metadata from IPFS
        if (details.tokenURI) {
          const metadataResult = await fetchFromIPFS(details.tokenURI);
          if (metadataResult.success) {
            setMetadata(metadataResult.data);
          }
        }

        // Check if current user is owner or artisan
        const account = await getCurrentAccount();
        setOwner(details.owner.toLowerCase() === account.toLowerCase());
        setArtisan(details.artisan.toLowerCase() === account.toLowerCase());

        // Check if NFT is hidden
        setIsHidden(isNFTHidden(tokenId));

        // Initialize edit form with current values
        setEditName(details.name);
        setEditDescription(details.description);
        setEditMaterials(details.materials);

        // Set image preview if available
        if (metadataResult?.data?.image) {
          const imageUrl = metadataResult.data.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching NFT details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load NFT details.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (tokenId) {
      fetchNFTDetails();
    }
  }, [tokenId, toast]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle metadata update
  const handleUpdateMetadata = async () => {
    if (!editName.trim() || !editDescription.trim() || !editMaterials.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsUpdating(true);

      let tokenURI = nft.tokenURI;

      // If a new image was uploaded, update the metadata with the new image
      if (editImage) {
        // Upload image to IPFS
        setUploadingImage(true);
        const imageResult = await uploadFileToIPFS(editImage);
        setUploadingImage(false);

        if (!imageResult.success) {
          throw new Error('Failed to upload image to IPFS');
        }

        // Create new metadata
        const metadata = {
          name: editName,
          description: editDescription,
          materials: editMaterials,
          image: `ipfs://${imageResult.ipfsHash}`,
          attributes: [
            {
              trait_type: 'Materials',
              value: editMaterials,
            },
            {
              trait_type: 'Creator',
              value: nft.artisan,
            },
            {
              trait_type: 'Last Updated',
              value: new Date().toISOString(),
            },
          ],
        };

        // Upload metadata to IPFS
        const metadataResult = await uploadMetadataToIPFS(metadata);

        if (!metadataResult.success) {
          throw new Error('Failed to upload metadata to IPFS');
        }

        tokenURI = metadataResult.tokenURI;
      }

      // Update metadata on the blockchain
      await updateNFTMetadata(
        tokenId,
        tokenURI,
        editName,
        editDescription,
        editMaterials
      );

      toast({
        title: 'Success',
        description: 'NFT metadata updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh NFT details
      const details = await getNFTDetails(tokenId);
      setNft(details);

      // If a new image was uploaded, refresh metadata
      if (editImage) {
        const metadataResult = await fetchFromIPFS(tokenURI);
        if (metadataResult.success) {
          setMetadata(metadataResult.data);
        }
      }

      // Close the modal
      onEditModalClose();
    } catch (error) {
      console.error('Error updating NFT metadata:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update NFT metadata.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle NFT visibility toggle
  const handleToggleVisibility = () => {
    try {
      if (isHidden) {
        showNFT(tokenId);
        setIsHidden(false);
        toast({
          title: 'NFT Visible',
          description: 'This NFT is now visible in your collection.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        hideNFT(tokenId);
        setIsHidden(true);
        toast({
          title: 'NFT Hidden',
          description: 'This NFT is now hidden from your collection.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error toggling NFT visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update NFT visibility.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle NFT burning
  const handleBurnNFT = async () => {
    try {
      setIsBurning(true);

      await burnNFT(tokenId);

      toast({
        title: 'NFT Burned',
        description: 'The NFT has been permanently removed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Navigate back to marketplace
      navigate('/marketplace');
    } catch (error) {
      console.error('Error burning NFT:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to burn NFT.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsBurning(false);
      onBurnAlertClose();
    }
  };

  const handleAddProvenanceRecord = async () => {
    if (!newRecord.trim()) {
      toast({
        title: 'Empty Record',
        description: 'Please enter a provenance record.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setAddingRecord(true);

      await addProvenanceRecord(tokenId, newRecord);

      toast({
        title: 'Success',
        description: 'Provenance record added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refresh NFT details
      const details = await getNFTDetails(tokenId);
      setNft(details);
      setNewRecord('');
    } catch (error) {
      console.error('Error adding provenance record:', error);
      toast({
        title: 'Error',
        description: 'Failed to add provenance record.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setAddingRecord(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="7xl" py={12}>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      </Container>
    );
  }

  if (!nft) {
    return (
      <Container maxW="7xl" py={12}>
        <Box textAlign="center" py={10}>
          <Heading mb={4}>NFT Not Found</Heading>
          <Text mb={6}>The NFT you're looking for doesn't exist or has been removed.</Text>
          <Button as={Link} to="/marketplace" leftIcon={<FiArrowLeft />} colorScheme="teal">
            Back to Marketplace
          </Button>
        </Box>
      </Container>
    );
  }

  const imageUrl = metadata?.image?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/') || 'https://via.placeholder.com/500';

  return (
    <Container maxW="7xl" py={12}>
      <Button
        as={Link}
        to="/marketplace"
        leftIcon={<FiArrowLeft />}
        mb={8}
        variant="outline"
      >
        Back to Marketplace
      </Button>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {/* Left Column - Image */}
        <Box>
          <Box
            borderRadius="lg"
            overflow="hidden"
            boxShadow="2xl"
            mb={6}
            bg={bgColor}
          >
            <Image
              src={imageUrl}
              alt={nft.name}
              w="full"
              h={{ base: '300px', md: '400px' }}
              objectFit="cover"
            />
          </Box>

          <Accordion allowToggle mt={6}>
            <AccordionItem border="1px" borderColor={borderColor} borderRadius="md">
              <h2>
                <AccordionButton py={4}>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    Provenance History
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={4}>
                  {nft.provenanceHistory.map((record, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderRadius="md"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                    >
                      <Text>{record}</Text>
                    </Box>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        {/* Right Column - Details */}
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            {nft.name}
          </Heading>

          <HStack spacing={4} mb={6}>
            <Badge colorScheme="teal" fontSize="sm" px={2} py={1} borderRadius="full">
              Token ID: {tokenId}
            </Badge>
            <Badge colorScheme="purple" fontSize="sm" px={2} py={1} borderRadius="full">
              Chennai Artisanal
            </Badge>
          </HStack>

          <Text fontSize="lg" mb={6}>
            {nft.description}
          </Text>

          <SimpleGrid columns={2} spacing={4} mb={6}>
            <Box>
              <Text fontWeight="bold">Materials</Text>
              <Text>{nft.materials}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Creation Date</Text>
              <Text>{nft.creationDate}</Text>
            </Box>
          </SimpleGrid>

          <Divider my={6} />

          <Box mb={6}>
            <Text fontWeight="bold" mb={2}>
              Artisan
            </Text>
            <Link to={`/artisan/${nft.artisan}`}>
              <Button variant="outline" size="sm" rightIcon={<FiExternalLink />}>
                {nft.artisan.substring(0, 6)}...{nft.artisan.substring(nft.artisan.length - 4)}
              </Button>
            </Link>
          </Box>

          <Box mb={6}>
            <Text fontWeight="bold" mb={2}>
              Current Owner
            </Text>
            <Button variant="outline" size="sm">
              {nft.owner.substring(0, 6)}...{nft.owner.substring(nft.owner.length - 4)}
            </Button>
          </Box>

          <Divider my={6} />

          {/* Management Actions */}
          {(owner || artisan) && (
            <Box mb={6}>
              <Text fontWeight="bold" mb={4}>
                Management Actions
              </Text>
              <HStack spacing={4}>
                {/* Edit Button */}
                <Button
                  leftIcon={<FiEdit />}
                  colorScheme="blue"
                  onClick={onEditModalOpen}
                  size="sm"
                >
                  Edit Details
                </Button>

                {/* Hide/Show Button */}
                {owner && (
                  <Button
                    leftIcon={isHidden ? <FiEye /> : <FiEyeOff />}
                    colorScheme={isHidden ? "green" : "gray"}
                    onClick={handleToggleVisibility}
                    size="sm"
                  >
                    {isHidden ? "Show NFT" : "Hide NFT"}
                  </Button>
                )}

                {/* Burn Button */}
                {owner && (
                  <Button
                    leftIcon={<FiTrash2 />}
                    colorScheme="red"
                    onClick={onBurnAlertOpen}
                    size="sm"
                  >
                    Burn NFT
                  </Button>
                )}
              </HStack>
            </Box>
          )}

          {/* Add Provenance Record (only for owner or artisan) */}
          {(owner || artisan) && (
            <Box mt={6}>
              <Text fontWeight="bold" mb={2}>
                Add Provenance Record
              </Text>
              <Flex>
                <Input
                  value={newRecord}
                  onChange={(e) => setNewRecord(e.target.value)}
                  placeholder="e.g., Quality check performed, Transferred to exhibition..."
                  mr={2}
                />
                <Button
                  colorScheme="teal"
                  onClick={handleAddProvenanceRecord}
                  isLoading={addingRecord}
                >
                  Add
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      </SimpleGrid>

      {/* Edit Metadata Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit NFT Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Item name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Item description"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Materials</FormLabel>
                <Input
                  value={editMaterials}
                  onChange={(e) => setEditMaterials(e.target.value)}
                  placeholder="Materials used"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image (Optional)</FormLabel>
                <Box mb={4}>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    p={1}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Leave empty to keep the current image
                  </Text>
                </Box>

                {imagePreview && (
                  <Box mt={2} borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      maxH="200px"
                      mx="auto"
                    />
                  </Box>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpdateMetadata}
              isLoading={isUpdating || uploadingImage}
              loadingText={uploadingImage ? "Uploading Image..." : "Updating..."}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Burn NFT Confirmation Dialog */}
      <AlertDialog
        isOpen={isBurnAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onBurnAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Burn NFT
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to burn this NFT? This action is irreversible and will permanently remove the token.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onBurnAlertClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleBurnNFT}
                ml={3}
                isLoading={isBurning}
                loadingText="Burning..."
              >
                Burn NFT
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default NFTDetails;
