const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Chennai Artisanal Goods Provenance DApp", function () {
  let artisanRegistry;
  let chennaiArtisanalNFT;
  let owner;
  let artisan1;
  let artisan2;
  let buyer;

  beforeEach(async function () {
    // Get signers
    [owner, artisan1, artisan2, buyer] = await ethers.getSigners();

    // Deploy ArtisanRegistry
    const ArtisanRegistry = await ethers.getContractFactory("ArtisanRegistry");
    artisanRegistry = await ArtisanRegistry.deploy();
    await artisanRegistry.waitForDeployment();

    // Deploy ChennaiArtisanalNFT
    const ChennaiArtisanalNFT = await ethers.getContractFactory("ChennaiArtisanalNFT");
    chennaiArtisanalNFT = await ChennaiArtisanalNFT.deploy(await artisanRegistry.getAddress());
    await chennaiArtisanalNFT.waitForDeployment();
  });

  describe("ArtisanRegistry", function () {
    it("Should allow artisans to register", async function () {
      await artisanRegistry.connect(artisan1).registerArtisan(
        "Ravi Kumar",
        "Mylapore, Chennai",
        "Pottery",
        "ravi@example.com"
      );

      const artisanDetails = await artisanRegistry.getArtisanDetails(artisan1.address);
      expect(artisanDetails.name).to.equal("Ravi Kumar");
      expect(artisanDetails.specialization).to.equal("Pottery");
      expect(artisanDetails.isVerified).to.equal(false);
    });

    it("Should allow owner to verify artisans", async function () {
      await artisanRegistry.connect(artisan1).registerArtisan(
        "Ravi Kumar",
        "Mylapore, Chennai",
        "Pottery",
        "ravi@example.com"
      );

      await artisanRegistry.connect(owner).verifyArtisan(artisan1.address);
      
      const artisanDetails = await artisanRegistry.getArtisanDetails(artisan1.address);
      expect(artisanDetails.isVerified).to.equal(true);
    });

    it("Should not allow non-owners to verify artisans", async function () {
      await artisanRegistry.connect(artisan1).registerArtisan(
        "Ravi Kumar",
        "Mylapore, Chennai",
        "Pottery",
        "ravi@example.com"
      );

      await expect(
        artisanRegistry.connect(artisan2).verifyArtisan(artisan1.address)
      ).to.be.reverted;
    });
  });

  describe("ChennaiArtisanalNFT", function () {
    beforeEach(async function () {
      // Register and verify artisan1
      await artisanRegistry.connect(artisan1).registerArtisan(
        "Ravi Kumar",
        "Mylapore, Chennai",
        "Pottery",
        "ravi@example.com"
      );
      await artisanRegistry.connect(owner).verifyArtisan(artisan1.address);
    });

    it("Should allow verified artisans to mint NFTs", async function () {
      const tokenURI = "ipfs://QmExample";
      
      await expect(
        chennaiArtisanalNFT.connect(artisan1).mintItem(
          artisan1.address,
          tokenURI,
          "Traditional Clay Pot",
          "Handcrafted traditional clay pot with intricate designs",
          "Clay, Natural dyes"
        )
      ).to.emit(chennaiArtisanalNFT, "ItemMinted").withArgs(0, artisan1.address, "Traditional Clay Pot");

      expect(await chennaiArtisanalNFT.ownerOf(0)).to.equal(artisan1.address);
      expect(await chennaiArtisanalNFT.tokenURI(0)).to.equal(tokenURI);
      
      const itemDetails = await chennaiArtisanalNFT.getItemDetails(0);
      expect(itemDetails.name).to.equal("Traditional Clay Pot");
      expect(itemDetails.materials).to.equal("Clay, Natural dyes");
      expect(itemDetails.artisan).to.equal(artisan1.address);
    });

    it("Should not allow unverified artisans to mint NFTs", async function () {
      // Register artisan2 but don't verify
      await artisanRegistry.connect(artisan2).registerArtisan(
        "Priya Sharma",
        "T. Nagar, Chennai",
        "Textiles",
        "priya@example.com"
      );

      await expect(
        chennaiArtisanalNFT.connect(artisan2).mintItem(
          artisan2.address,
          "ipfs://QmExample2",
          "Handloom Saree",
          "Traditional handloom cotton saree",
          "Cotton, Natural dyes"
        )
      ).to.be.revertedWith("Only verified artisans can mint");
    });

    it("Should allow adding provenance records", async function () {
      // Mint an NFT
      await chennaiArtisanalNFT.connect(artisan1).mintItem(
        artisan1.address,
        "ipfs://QmExample",
        "Traditional Clay Pot",
        "Handcrafted traditional clay pot with intricate designs",
        "Clay, Natural dyes"
      );

      // Add provenance record
      await chennaiArtisanalNFT.connect(artisan1).addProvenanceRecord(
        0,
        "Quality checked and certified authentic"
      );

      // Check provenance history
      const history = await chennaiArtisanalNFT.getProvenanceHistory(0);
      expect(history.length).to.equal(2); // Initial + new record
      expect(history[1]).to.equal("Quality checked and certified authentic");
    });

    it("Should allow NFT transfers", async function () {
      // Mint an NFT
      await chennaiArtisanalNFT.connect(artisan1).mintItem(
        artisan1.address,
        "ipfs://QmExample",
        "Traditional Clay Pot",
        "Handcrafted traditional clay pot with intricate designs",
        "Clay, Natural dyes"
      );

      // Transfer to buyer
      await chennaiArtisanalNFT.connect(artisan1).transferFrom(
        artisan1.address,
        buyer.address,
        0
      );

      expect(await chennaiArtisanalNFT.ownerOf(0)).to.equal(buyer.address);
    });
  });
});
