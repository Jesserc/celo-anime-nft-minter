// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct Anime {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    //tokenId => address => tip balance
    mapping(uint => mapping(address => uint)) public tokenOnwerTipBalance;

    mapping(uint256 => Anime) private animes;

    mapping(uint => mapping(address => bool)) private liked;

    mapping(uint => uint) public likes;

    constructor() ERC721("MyNFT", "MNFT") {}

    /// @dev mint function for arts
    function safeMint(address to, string calldata uri) public onlyOwner {
        require(to != address(0), "Invalid minter address");
        require(bytes(uri).length > 0);
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function makeTransfer(
        address from,
        address to,
        uint256 tokenId
    ) public {
        address tokenOwner = ownerOf(tokenId);
        _transfer(from, to, tokenId);
        animes[tokenId].owner = payable(to);
    }

    function createAnime(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        animes[tokenId] = Anime(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
    }

    function buyAnime(uint256 tokenId) public payable {
        uint256 price = animes[tokenId].price;
        address seller = animes[tokenId].seller;
        require(
            msg.value >= price,
            "Please submit the asking price in order to complete the purchase"
        );
        animes[tokenId].owner = payable(msg.sender);
        animes[tokenId].sold = true;
        animes[tokenId].seller = payable(address(0));
        _transfer(address(this), msg.sender, tokenId);

        payable(seller).transfer(msg.value);
    }

    /// @dev function to tip owner of an nft
    function tipNftOwner(uint256 tokenId)
        public
        payable
        returns (bool success)
    {
        require(owner() != msg.sender, "Owner can't tip his arts");
        require(msg.value == 0.05 ether, "You can tip only 0.5 CELO at a time");
        address tokenOwner = ownerOf(tokenId);

        tokenOnwerTipBalance[tokenId][tokenOwner] += msg.value;

        (success, ) = payable(tokenOwner).call{value: msg.value}("");
        require(success, "Failed to send");
    }

    /**
     * @dev allow users to like or dislike an art
     */
    function likeOrDislike(uint tokenId) public {
        require(owner() != msg.sender, "Owner can't like his arts");
        require(_exists(tokenId), "Query of nonexistent tokenId");
        if (liked[tokenId][msg.sender]) {
            liked[tokenId][msg.sender] = false;
            likes[tokenId]--;
        } else {
            liked[tokenId][msg.sender] = true;
            likes[tokenId]++;
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
