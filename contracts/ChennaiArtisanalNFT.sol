// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ArtisanRegistry.sol";

/**
 * @title ChennaiArtisanalNFT
 * @dev NFT contract for Chennai artisanal goods with provenance tracking
 */
contract ChennaiArtisanalNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    // Token ID counter
    uint256 private _nextTokenId;

    // Reference to the ArtisanRegistry contract
    ArtisanRegistry public artisanRegistry;

    // Struct to store item details
    struct ItemDetails {
        string name;
        string description;
        string materials;
        address artisan;
        uint256 creationDate;
        string[] provenanceHistory;
    }

    // Mapping from token ID to ItemDetails
    mapping(uint256 => ItemDetails) public items;

    // Events
    event ItemMinted(uint256 indexed tokenId, address indexed artisan, string name);
    event ProvenanceAdded(uint256 indexed tokenId, string provenanceRecord);
    event MetadataUpdated(uint256 indexed tokenId, string newTokenURI);
    event ItemBurned(uint256 indexed tokenId, address indexed owner);

    constructor(address _artisanRegistryAddress) ERC721("Chennai Artisanal Goods", "CAG") Ownable(msg.sender) {
        artisanRegistry = ArtisanRegistry(_artisanRegistryAddress);
    }

    /**
     * @dev Mint a new NFT representing an artisanal item
     * @param _to Address to mint the token to (usually the artisan)
     * @param _tokenURI URI for the token metadata on IPFS
     * @param _name Name of the item
     * @param _description Description of the item
     * @param _materials Materials used in the item
     * @return uint256 The ID of the newly minted token
     */
    function mintItem(
        address _to,
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        string memory _materials
    ) external returns (uint256) {
        // Only verified artisans can mint
        require(artisanRegistry.isVerifiedArtisan(msg.sender), "Only verified artisans can mint");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_materials).length > 0, "Materials cannot be empty");

        // Get the next token ID
        uint256 tokenId = _nextTokenId++;

        // Mint the token
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        // Initialize provenance history
        string[] memory initialProvenance = new string[](1);
        initialProvenance[0] = string(abi.encodePacked(
            "Created by ",
            artisanRegistry.getArtisanDetails(msg.sender).name,
            " on ",
            _uint2str(block.timestamp)
        ));

        // Store item details
        items[tokenId] = ItemDetails({
            name: _name,
            description: _description,
            materials: _materials,
            artisan: msg.sender,
            creationDate: block.timestamp,
            provenanceHistory: initialProvenance
        });

        emit ItemMinted(tokenId, msg.sender, _name);

        return tokenId;
    }

    /**
     * @dev Add a provenance record to an item's history
     * @param _tokenId ID of the token
     * @param _record Provenance record to add
     */
    function addProvenanceRecord(uint256 _tokenId, string memory _record) external {
        require(_isTokenValid(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender || items[_tokenId].artisan == msg.sender, "Not authorized");
        require(bytes(_record).length > 0, "Record cannot be empty");

        items[_tokenId].provenanceHistory.push(_record);

        emit ProvenanceAdded(_tokenId, _record);
    }

    /**
     * @dev Check if a token exists
     * @param _tokenId ID of the token to check
     * @return bool True if the token exists
     */
    function _isTokenValid(uint256 _tokenId) internal view returns (bool) {
        return _tokenId < _nextTokenId && _ownerOf(_tokenId) != address(0);
    }

    /**
     * @dev Get all provenance records for an item
     * @param _tokenId ID of the token
     * @return string[] Array of provenance records
     */
    function getProvenanceHistory(uint256 _tokenId) external view returns (string[] memory) {
        require(_isTokenValid(_tokenId), "Token does not exist");
        return items[_tokenId].provenanceHistory;
    }

    /**
     * @dev Get item details
     * @param _tokenId ID of the token
     * @return ItemDetails struct containing item details
     */
    function getItemDetails(uint256 _tokenId) external view returns (ItemDetails memory) {
        require(_isTokenValid(_tokenId), "Token does not exist");
        return items[_tokenId];
    }

    /**
     * @dev Update the metadata URI and item details for an NFT
     * @param _tokenId ID of the token to update
     * @param _tokenURI New URI for the token metadata on IPFS
     * @param _name New name of the item
     * @param _description New description of the item
     * @param _materials New materials used in the item
     */
    function updateMetadata(
        uint256 _tokenId,
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        string memory _materials
    ) external {
        require(_isTokenValid(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender || items[_tokenId].artisan == msg.sender, "Not authorized");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_materials).length > 0, "Materials cannot be empty");

        // Update token URI
        _setTokenURI(_tokenId, _tokenURI);

        // Update item details
        items[_tokenId].name = _name;
        items[_tokenId].description = _description;
        items[_tokenId].materials = _materials;

        // Add provenance record for the update
        string memory record = string(abi.encodePacked(
            "Metadata updated by ",
            msg.sender == items[_tokenId].artisan ? "artisan" : "owner",
            " on ",
            _uint2str(block.timestamp)
        ));
        items[_tokenId].provenanceHistory.push(record);

        emit MetadataUpdated(_tokenId, _tokenURI);
    }

    /**
     * @dev Burn a token - permanently removes the token
     * @param _tokenId ID of the token to burn
     */
    function burnToken(uint256 _tokenId) external {
        require(_isTokenValid(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Only token owner can burn");

        // Record the burn event before burning
        emit ItemBurned(_tokenId, msg.sender);

        // Burn the token
        _burn(_tokenId);
    }

    /**
     * @dev Update the ArtisanRegistry address (only owner can call)
     * @param _newRegistryAddress New ArtisanRegistry contract address
     */
    function updateArtisanRegistry(address _newRegistryAddress) external onlyOwner {
        require(_newRegistryAddress != address(0), "Invalid address");
        artisanRegistry = ArtisanRegistry(_newRegistryAddress);
    }

    /**
     * @dev Convert uint to string
     * @param _i Unsigned integer to convert
     * @return string String representation of the unsigned integer
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }

        uint256 j = _i;
        uint256 length;

        while (j != 0) {
            length++;
            j /= 10;
        }

        bytes memory bstr = new bytes(length);
        uint256 k = length;

        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }

        return string(bstr);
    }

    // The following functions are overrides required by Solidity

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
