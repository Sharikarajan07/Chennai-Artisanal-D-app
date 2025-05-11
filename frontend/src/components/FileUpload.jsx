import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  Input,
  FormControl,
  FormLabel,
  Image,
  useColorModeValue,
  Flex,
  Icon,
  Progress,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
      
      // Call the parent component's upload function
      await onFileUpload(file);
      
      // Complete the progress
      clearInterval(interval);
      setUploadProgress(100);
      
      // Reset after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>Upload Image</FormLabel>
        <Box
          border="2px dashed"
          borderColor={useColorModeValue('gray.300', 'gray.600')}
          borderRadius="md"
          p={6}
          textAlign="center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          cursor="pointer"
          bg={useColorModeValue('gray.50', 'gray.700')}
          _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
        >
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
            ref={fileInputRef}
          />
          
          {preview ? (
            <Box>
              <Image
                src={preview}
                alt="Preview"
                maxH="200px"
                mx="auto"
                borderRadius="md"
                mb={4}
              />
              <Text fontSize="sm" color="gray.500">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Text>
            </Box>
          ) : (
            <Flex direction="column" align="center" justify="center" py={10}>
              <Icon as={FiUpload} w={10} h={10} color="gray.400" mb={4} />
              <Text mb={2}>Drag and drop your image here or click to browse</Text>
              <Text fontSize="sm" color="gray.500">
                Supported formats: JPG, PNG, GIF (Max 5MB)
              </Text>
            </Flex>
          )}
        </Box>
      </FormControl>
      
      {uploadProgress > 0 && (
        <Progress
          value={uploadProgress}
          size="sm"
          colorScheme="teal"
          mt={4}
          borderRadius="md"
        />
      )}
      
      {file && (
        <Button
          mt={4}
          colorScheme="teal"
          onClick={handleUpload}
          isLoading={uploading}
          loadingText="Uploading..."
          w="full"
        >
          Upload to IPFS
        </Button>
      )}
    </Box>
  );
};

export default FileUpload;
