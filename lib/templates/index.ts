export interface Template {
  name: string
  description: string
  files: Record<string, string>
}

export const templates: Record<string, Template> = {
  erc20: {
    name: "ERC-20 Token",
    description: "Create a fungible token with mint, burn, and pause capabilities",
    files: {
      "contracts/Token.sol": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev ERC20 Token with minting, burning, and pausing capabilities
 */
contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens

    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
        Ownable(msg.sender)
    {
        // Mint initial supply to contract deployer
        _mint(msg.sender, 100000 * 10**18); // 100k tokens
    }

    /**
     * @dev Mint new tokens
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        _mint(to, amount);
    }

    /**
     * @dev Pause all token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause all token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    // Required override for multiple inheritance
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}`,
      "contracts/TokenSale.sol": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TokenSale
 * @dev Simple token sale contract
 */
contract TokenSale is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public rate; // tokens per ETH
    uint256 public minPurchase;
    uint256 public maxPurchase;
    bool public saleActive;

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event SaleStatusChanged(bool active);

    constructor(
        address _token,
        uint256 _rate,
        uint256 _minPurchase,
        uint256 _maxPurchase
    ) Ownable(msg.sender) {
        token = IERC20(_token);
        rate = _rate;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        saleActive = true;
    }

    function buyTokens() public payable nonReentrant {
        require(saleActive, "Sale is not active");
        require(msg.value >= minPurchase, "Below minimum purchase");
        require(msg.value <= maxPurchase, "Above maximum purchase");

        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount, "Insufficient tokens");

        token.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, tokenAmount, msg.value);
    }

    function setSaleStatus(bool _active) public onlyOwner {
        saleActive = _active;
        emit SaleStatusChanged(_active);
    }

    function withdrawETH() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawTokens() public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
    }
}`,
      "frontend/App.tsx": `import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import TokenInfo from './TokenInfo'

function App() {
  const [account, setAccount] = useState<string>('')
  const [balance, setBalance] = useState<string>('0')

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setAccount(accounts[0])
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          My Token dApp
        </h1>
        
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <p className="text-sm text-gray-600">Connected Account</p>
              <p className="font-mono text-sm">{account}</p>
            </div>
            
            <TokenInfo account={account} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App`,
      "frontend/TokenInfo.tsx": `import React from 'react'

interface TokenInfoProps {
  account: string
}

function TokenInfo({ account }: TokenInfoProps) {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Token Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="font-semibold">My Token</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Symbol</p>
          <p className="font-semibold">MTK</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Your Balance</p>
          <p className="font-semibold">0 MTK</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Supply</p>
          <p className="font-semibold">100,000 MTK</p>
        </div>
      </div>
      
      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
        Transfer Tokens
      </button>
    </div>
  )
}

export default TokenInfo`,
      "scripts/deploy.ts": `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying MyToken contract...");

  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy("My Token", "MTK");

  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log(\`MyToken deployed to: \${address}\`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });`,
      "hardhat.config.ts": `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};

export default config;`,
      "package.json": `{
  "name": "my-token-dapp",
  "version": "1.0.0",
  "scripts": {
    "compile": "hardhat compile",
    "deploy": "hardhat run scripts/deploy.ts --network mumbai",
    "test": "hardhat test"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0",
    "ethers": "^6.9.0",
    "hardhat": "^2.19.0"
  }
}`
    }
  },
  
  nft: {
    name: "NFT Collection",
    description: "Launch your own NFT collection with metadata and minting",
    files: {
      "contracts/NFT.sol": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyNFT
 * @dev ERC721 NFT Collection with minting and metadata
 */
contract MyNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.01 ether;
    bool public publicMintEnabled = false;

    event NFTMinted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("My NFT Collection", "MNFT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new NFT
     */
    function mint(string memory uri) public payable {
        require(publicMintEnabled, "Public mint not enabled");
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(msg.sender, tokenId);
    }

    /**
     * @dev Owner mint (no cost)
     */
    function ownerMint(address to, string memory uri) public onlyOwner {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit NFTMinted(to, tokenId);
    }

    function setPublicMintEnabled(bool enabled) public onlyOwner {
        publicMintEnabled = enabled;
    }

    function setMintPrice(uint256 price) public onlyOwner {
        mintPrice = price;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    // Required overrides
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
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}`,
      "contracts/Marketplace.sol": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @dev Simple NFT marketplace for buying and selling
 */
contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event NFTListed(address indexed nft, uint256 indexed tokenId, uint256 price);
    event NFTSold(address indexed nft, uint256 indexed tokenId, address buyer, uint256 price);
    event ListingCancelled(address indexed nft, uint256 indexed tokenId);

    function listNFT(address nft, uint256 tokenId, uint256 price) public {
        require(IERC721(nft).ownerOf(tokenId) == msg.sender, "Not owner");
        require(IERC721(nft).isApprovedForAll(msg.sender, address(this)), "Not approved");
        require(price > 0, "Price must be greater than 0");

        listings[nft][tokenId] = Listing(msg.sender, price, true);
        emit NFTListed(nft, tokenId, price);
    }

    function buyNFT(address nft, uint256 tokenId) public payable nonReentrant {
        Listing memory listing = listings[nft][tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        listings[nft][tokenId].active = false;

        IERC721(nft).safeTransferFrom(listing.seller, msg.sender, tokenId);
        payable(listing.seller).transfer(msg.value);

        emit NFTSold(nft, tokenId, msg.sender, listing.price);
    }

    function cancelListing(address nft, uint256 tokenId) public {
        require(listings[nft][tokenId].seller == msg.sender, "Not seller");
        require(listings[nft][tokenId].active, "Not listed");

        listings[nft][tokenId].active = false;
        emit ListingCancelled(nft, tokenId);
    }
}`,
      "frontend/App.tsx": `import React, { useState } from 'react'
import MintNFT from './MintNFT'
import Gallery from './Gallery'

function App() {
  const [account, setAccount] = useState<string>('')
  const [view, setView] = useState<'mint' | 'gallery'>('mint')

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setAccount(accounts[0])
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          My NFT Collection
        </h1>
        
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setView('mint')}
                className={\`px-4 py-2 rounded-lg \${view === 'mint' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}\`}
              >
                Mint NFT
              </button>
              <button
                onClick={() => setView('gallery')}
                className={\`px-4 py-2 rounded-lg \${view === 'gallery' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'}\`}
              >
                Gallery
              </button>
            </div>
            
            {view === 'mint' ? <MintNFT /> : <Gallery account={account} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default App`,
      "frontend/MintNFT.tsx": `import React, { useState } from 'react'

function MintNFT() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const handleMint = async () => {
    // Minting logic here
    console.log('Minting NFT...', { name, description, image })
  }

  return (
    <div className="bg-white rounded-lg p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Mint Your NFT</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="My Amazing NFT"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            placeholder="Describe your NFT..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        
        <button
          onClick={handleMint}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
        >
          Mint NFT (0.01 MATIC)
        </button>
      </div>
    </div>
  )
}

export default MintNFT`,
      "frontend/Gallery.tsx": `import React from 'react'

interface GalleryProps {
  account: string
}

function Gallery({ account }: GalleryProps) {
  // Mock NFTs for demo
  const nfts = [
    { id: 1, name: 'NFT #1', image: 'https://via.placeholder.com/300' },
    { id: 2, name: 'NFT #2', image: 'https://via.placeholder.com/300' },
    { id: 3, name: 'NFT #3', image: 'https://via.placeholder.com/300' },
  ]

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div key={nft.id} className="border rounded-lg p-4">
            <img src={nft.image} alt={nft.name} className="w-full rounded-lg mb-2" />
            <p className="font-semibold">{nft.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery`,
      "scripts/deploy.ts": `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying NFT contracts...");

  const NFT = await ethers.getContractFactory("MyNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();

  const nftAddress = await nft.getAddress();
  console.log(\`MyNFT deployed to: \${nftAddress}\`);

  const Marketplace = await ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.waitForDeployment();

  const marketplaceAddress = await marketplace.getAddress();
  console.log(\`Marketplace deployed to: \${marketplaceAddress}\`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });`,
      "hardhat.config.ts": `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};

export default config;`,
      "package.json": `{
  "name": "my-nft-collection",
  "version": "1.0.0",
  "scripts": {
    "compile": "hardhat compile",
    "deploy": "hardhat run scripts/deploy.ts --network mumbai",
    "test": "hardhat test"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0",
    "ethers": "^6.9.0",
    "hardhat": "^2.19.0"
  }
}`
    }
  },

  dao: {
    name: "DAO Governance",
    description: "Build a decentralized autonomous organization with voting",
    files: {
      "contracts/Governor.sol": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract MyGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor(IVotes _token, TimelockController _timelock)
        Governor("MyGovernor")
        GovernorSettings(1, 50400, 100e18)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.proposalNeedsQueuing(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}`,
      "contracts/GovernanceToken.sol": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovernanceToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    constructor() 
        ERC20("Governance Token", "GOV") 
        ERC20Permit("Governance Token")
        Ownable(msg.sender)
    {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}`,
      "contracts/Timelock.sol": `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

// The TimelockController is already complete, we just need to deploy it
// with the right parameters`,
      "frontend/App.tsx": `import React, { useState } from 'react'
import Proposals from './Proposals'
import Voting from './Voting'

function App() {
  const [account, setAccount] = useState<string>('')

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        setAccount(accounts[0])
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          DAO Governance
        </h1>
        
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Your Voting Power</h2>
              <p className="text-4xl font-bold text-purple-600">1,000 GOV</p>
            </div>
            
            <Proposals />
            <Voting />
          </div>
        )}
      </div>
    </div>
  )
}

export default App`,
      "frontend/Proposals.tsx": `import React from 'react'

function Proposals() {
  const proposals = [
    {
      id: 1,
      title: 'Increase Treasury Allocation',
      description: 'Proposal to increase treasury allocation by 10%',
      status: 'Active',
      votes: { for: 1500, against: 500 }
    },
    {
      id: 2,
      title: 'Add New Feature',
      description: 'Proposal to implement new governance feature',
      status: 'Pending',
      votes: { for: 0, against: 0 }
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Active Proposals</h2>
      
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{proposal.title}</h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {proposal.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{proposal.description}</p>
            <div className="flex space-x-4 text-sm">
              <div>For: {proposal.votes.for}</div>
              <div>Against: {proposal.votes.against}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Proposals`,
      "frontend/Voting.tsx": `import React, { useState } from 'react'

function Voting() {
  const [proposalId, setProposalId] = useState('')

  const handleVote = (support: boolean) => {
    console.log('Voting...', { proposalId, support })
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Cast Your Vote</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Proposal ID</label>
          <input
            type="text"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter proposal ID"
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => handleVote(true)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Vote For
          </button>
          <button
            onClick={() => handleVote(false)}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Vote Against
          </button>
        </div>
      </div>
    </div>
  )
}

export default Voting`,
      "scripts/deploy.ts": `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DAO contracts...");

  // Deploy GovernanceToken
  const Token = await ethers.getContractFactory("GovernanceToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("GovernanceToken deployed to:", await token.getAddress());

  // Deploy Timelock
  const Timelock = await ethers.getContractFactory("TimelockController");
  const timelock = await Timelock.deploy(
    2 * 24 * 60 * 60, // 2 days
    [], // proposers
    [], // executors
    ethers.ZeroAddress // admin
  );
  await timelock.waitForDeployment();
  console.log("Timelock deployed to:", await timelock.getAddress());

  // Deploy Governor
  const Governor = await ethers.getContractFactory("MyGovernor");
  const governor = await Governor.deploy(
    await token.getAddress(),
    await timelock.getAddress()
  );
  await governor.waitForDeployment();
  console.log("Governor deployed to:", await governor.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });`,
      "hardhat.config.ts": `import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};

export default config;`,
      "package.json": `{
  "name": "dao-governance",
  "version": "1.0.0",
  "scripts": {
    "compile": "hardhat compile",
    "deploy": "hardhat run scripts/deploy.ts --network mumbai",
    "test": "hardhat test"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.0.0",
    "ethers": "^6.9.0",
    "hardhat": "^2.19.0"
  }
}`
    }
  }
}

