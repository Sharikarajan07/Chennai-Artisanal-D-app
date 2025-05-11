// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArtisanRegistry
 * @dev Contract for registering and verifying artisans in Chennai
 */
contract ArtisanRegistry is Ownable {
    struct Artisan {
        string name;
        string location;
        string specialization;
        string contactInfo;
        bool isVerified;
        uint256 registrationDate;
    }

    // Mapping from artisan address to Artisan struct
    mapping(address => Artisan) public artisans;
    
    // Array to keep track of all registered artisan addresses
    address[] public artisanAddresses;

    // Events
    event ArtisanRegistered(address indexed artisanAddress, string name, string specialization);
    event ArtisanVerified(address indexed artisanAddress);
    event ArtisanUpdated(address indexed artisanAddress);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new artisan
     * @param _name Name of the artisan
     * @param _location Location in Chennai
     * @param _specialization Craft specialization
     * @param _contactInfo Contact information
     */
    function registerArtisan(
        string memory _name,
        string memory _location,
        string memory _specialization,
        string memory _contactInfo
    ) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bytes(_specialization).length > 0, "Specialization cannot be empty");
        require(artisans[msg.sender].registrationDate == 0, "Artisan already registered");

        artisans[msg.sender] = Artisan({
            name: _name,
            location: _location,
            specialization: _specialization,
            contactInfo: _contactInfo,
            isVerified: false,
            registrationDate: block.timestamp
        });

        artisanAddresses.push(msg.sender);
        
        emit ArtisanRegistered(msg.sender, _name, _specialization);
    }

    /**
     * @dev Verify an artisan (only owner can call)
     * @param _artisanAddress Address of the artisan to verify
     */
    function verifyArtisan(address _artisanAddress) external onlyOwner {
        require(artisans[_artisanAddress].registrationDate > 0, "Artisan not registered");
        require(!artisans[_artisanAddress].isVerified, "Artisan already verified");

        artisans[_artisanAddress].isVerified = true;
        
        emit ArtisanVerified(_artisanAddress);
    }

    /**
     * @dev Update artisan information (only the artisan can update their own info)
     * @param _name Updated name
     * @param _location Updated location
     * @param _specialization Updated specialization
     * @param _contactInfo Updated contact information
     */
    function updateArtisanInfo(
        string memory _name,
        string memory _location,
        string memory _specialization,
        string memory _contactInfo
    ) external {
        require(artisans[msg.sender].registrationDate > 0, "Artisan not registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bytes(_specialization).length > 0, "Specialization cannot be empty");

        Artisan storage artisan = artisans[msg.sender];
        artisan.name = _name;
        artisan.location = _location;
        artisan.specialization = _specialization;
        artisan.contactInfo = _contactInfo;
        
        emit ArtisanUpdated(msg.sender);
    }

    /**
     * @dev Check if an address is a verified artisan
     * @param _artisanAddress Address to check
     * @return bool True if the address belongs to a verified artisan
     */
    function isVerifiedArtisan(address _artisanAddress) external view returns (bool) {
        return artisans[_artisanAddress].isVerified;
    }

    /**
     * @dev Get artisan details
     * @param _artisanAddress Address of the artisan
     * @return Artisan struct containing artisan details
     */
    function getArtisanDetails(address _artisanAddress) external view returns (Artisan memory) {
        return artisans[_artisanAddress];
    }

    /**
     * @dev Get the total number of registered artisans
     * @return uint256 Number of registered artisans
     */
    function getArtisanCount() external view returns (uint256) {
        return artisanAddresses.length;
    }

    /**
     * @dev Get a list of artisan addresses with pagination
     * @param _offset Starting index
     * @param _limit Maximum number of addresses to return
     * @return address[] Array of artisan addresses
     */
    function getArtisanAddresses(uint256 _offset, uint256 _limit) external view returns (address[] memory) {
        uint256 totalArtisans = artisanAddresses.length;
        
        if (_offset >= totalArtisans) {
            return new address[](0);
        }
        
        uint256 count = _limit;
        if (_offset + _limit > totalArtisans) {
            count = totalArtisans - _offset;
        }
        
        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = artisanAddresses[_offset + i];
        }
        
        return result;
    }
}
