// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title NFTCertificate
 * @dev PolyBuilder Achievement & Certification NFTs
 * @notice Recognized by Web3 companies as proof of smart contract development skills
 */
contract NFTCertificate is ERC721, Ownable {
    uint256 private _tokenIds;

    // Certificate levels
    enum Level {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT,
        MASTER
    }

    struct Certificate {
        string name;
        Level level;
        uint256 issuedAt;
        string[] skills;
        string achievementType;
        string uri;
    }

    // Mapping from token ID to certificate data
    mapping(uint256 => Certificate) public certificates;

    // Mapping from address to earned certificates (by level)
    mapping(address => mapping(Level => bool)) public hasLevel;

    // Events
    event CertificateIssued(
        address indexed recipient,
        uint256 indexed tokenId,
        Level level,
        string name
    );

    constructor() ERC721("PolyBuilder Certificate", "PBC") Ownable(msg.sender) {}

    /**
     * @dev Issue a new certificate NFT
     */
    function issueCertificate(
        address recipient,
        string memory name,
        Level level,
        string[] memory skills,
        string memory achievementType,
        string memory uri
    ) public onlyOwner returns (uint256) {
        require(recipient != address(0), "Invalid recipient");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(recipient, newTokenId);

        certificates[newTokenId] = Certificate({
            name: name,
            level: level,
            issuedAt: block.timestamp,
            skills: skills,
            achievementType: achievementType,
            uri: uri
        });

        hasLevel[recipient][level] = true;

        emit CertificateIssued(recipient, newTokenId, level, name);

        return newTokenId;
    }

    /**
     * @dev Batch issue certificates
     */
    function batchIssueCertificates(
        address[] memory recipients,
        string memory name,
        Level level,
        string[] memory skills,
        string memory achievementType,
        string memory baseURI
    ) public onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            _tokenIds++;
            uint256 newTokenId = _tokenIds;

            _safeMint(recipients[i], newTokenId);

            certificates[newTokenId] = Certificate({
                name: name,
                level: level,
                issuedAt: block.timestamp,
                skills: skills,
                achievementType: achievementType,
                uri: string(abi.encodePacked(baseURI, Strings.toString(newTokenId)))
            });

            hasLevel[recipients[i]][level] = true;

            emit CertificateIssued(recipients[i], newTokenId, level, name);
        }
    }

    /**
     * @dev Get all token IDs owned by an address
     */
    function getCertificates(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 counter = 0;

        for (uint256 i = 1; i <= _tokenIds; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner) {
                    tokenIds[counter] = i;
                    counter++;
                }
            } catch {
                // Token doesn't exist, skip
            }
        }

        return tokenIds;
    }

    /**
     * @dev Get certificate details
     */
    function getCertificate(uint256 tokenId) public view returns (
        string memory name,
        Level level,
        uint256 issuedAt,
        string[] memory skills,
        string memory achievementType
    ) {
        require(ownerOf(tokenId) != address(0), "Certificate does not exist");
        Certificate memory cert = certificates[tokenId];
        return (cert.name, cert.level, cert.issuedAt, cert.skills, cert.achievementType);
    }

    /**
     * @dev Get highest level achieved by address
     */
    function getHighestLevel(address owner) public view returns (Level) {
        if (hasLevel[owner][Level.MASTER]) return Level.MASTER;
        if (hasLevel[owner][Level.EXPERT]) return Level.EXPERT;
        if (hasLevel[owner][Level.ADVANCED]) return Level.ADVANCED;
        if (hasLevel[owner][Level.INTERMEDIATE]) return Level.INTERMEDIATE;
        if (hasLevel[owner][Level.BEGINNER]) return Level.BEGINNER;
        revert("No certificates found");
    }

    /**
     * @dev Returns the URI for a given token ID
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return certificates[tokenId].uri;
    }

    /**
     * @dev Soulbound: Prevent transfers (certificates are non-transferable)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Certificates are soulbound and cannot be transferred");
        return super._update(to, tokenId, auth);
    }
}
