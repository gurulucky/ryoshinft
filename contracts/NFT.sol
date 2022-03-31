// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RyoToken.sol";

contract RyoshiNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    using Strings for uint256;
    uint256 private _mintingFee = 0.001 ether;
    uint256 private _buyTokenValue = 1000 ether;
    
    IERC20 public ryoToken;
    
    // Optional mapping for token URIs
    mapping (uint256 => string) private _tokenURIs;

    // Base URI
    string private _baseURIextended;
    
    // uint256 private _totalSupply;   // total count to be minted
    
    constructor () ERC721 ("Ryoshi", "RYOSHI"){
        tokenCounter = 0;
        ryoToken = new RyoToken();
        // _totalSupply = totalSupply;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();
        
        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
    
    function setMintingFee(uint _fee) external onlyOwner {
        _mintingFee = _fee;
    }
    
    function setBuyTokenValue(uint value) external onlyOwner {
        _buyTokenValue = value;
    }

    function mintWiCry(uint256 tokenId, string memory tokenUri) public payable returns (uint256) {
        require(msg.value >= _mintingFee, "mintingFee isn't enough");
        // uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);
        tokenCounter = tokenCounter + 1;
        // buyToken(1000 ether);
        return tokenId;
    }
    
    function mintWiFia(uint256 tokenId, string memory tokenUri) public returns(uint256) {
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUri);
        tokenCounter = tokenCounter + 1;
        buyToken(_buyTokenValue);
        return tokenId;
    }
    
    function buyToken(uint256 value) public returns(bool) {
        uint256 dexBalance = ryoToken.balanceOf(address(this));
        require(value <= dexBalance, "Not enough tokens in the reserve");
        ryoToken.transfer(msg.sender, value);
        return true;
    }

}

