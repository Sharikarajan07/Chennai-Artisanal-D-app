import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, useToast, ChakraProvider, Spinner, Flex, Text, Center } from '@chakra-ui/react';
import { initBlockchain } from './utils/blockchain';
import { ARTISAN_REGISTRY_ADDRESS, CHENNAI_ARTISANAL_NFT_ADDRESS } from './utils/constants';
import theme from './theme';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import NFTDetails from './pages/NFTDetails';
import CreateNFT from './pages/CreateNFT';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import GetAddress from './pages/GetAddress';
import Artisans from './pages/Artisans';
import ArtisanDetails from './pages/ArtisanDetails';

function App() {
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const init = async () => {
      try {
        // Check if contract addresses are valid
        if (!ARTISAN_REGISTRY_ADDRESS || ARTISAN_REGISTRY_ADDRESS === '0x0000000000000000000000000000000000000000' ||
            !CHENNAI_ARTISANAL_NFT_ADDRESS || CHENNAI_ARTISANAL_NFT_ADDRESS === '0x0000000000000000000000000000000000000000') {
          console.error('Invalid contract addresses');
          toast({
            title: 'Configuration Error',
            description: 'Contract addresses are not properly configured.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          return;
        }

        // Initialize blockchain connection
        await initBlockchain();
        console.log('Blockchain initialized successfully');
      } catch (error) {
        console.error('Error initializing blockchain:', error);
        toast({
          title: 'Connection Error',
          description: error.message || 'Failed to connect to blockchain. Please install MetaMask.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [toast]);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Box minH="100vh" display="flex" flexDirection="column">
          <Navbar />
          <Box flex="1">
            {loading ? (
              <Center minH="80vh">
                <Flex direction="column" align="center">
                  <Spinner size="xl" color="brand.500" mb={4} thickness="4px" />
                  <Text fontSize="lg">Connecting to blockchain...</Text>
                </Flex>
              </Center>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/item/:tokenId" element={<NFTDetails />} />
                <Route path="/create" element={<CreateNFT />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-items" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/get-address" element={<GetAddress />} />
                <Route path="/artisans" element={<Artisans />} />
                <Route path="/artisan/:address" element={<ArtisanDetails />} />
                <Route path="*" element={<Home />} />
              </Routes>
            )}
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
