<!-- ABOUT THE PROJECT -->
# <h1 align="center">AnimeCollectibles</h1>
```

```


## About The Project
Celo Anime Collection is an NFT collection for minting your favourite anime/anime character as an NFT. It is deployed on the alfajores celo network.
Users are able to:
1. Mint an anime NFT
2. Tip other users for their minted anime NFT(cost 0.05 celo), this tip amount is automatically transferred to the NFT creator, hence this is another way to make passive income😍

[Live demo](https://jesserc.github.io/celo-anime-nft-minter/)

## :man_technologist: Languages/tools used for this project includes

* [React.js](https://reactjs.org/)
* [Hardhat](https://hardhat.org/getting-started/)
* [Solidity](https://docs.soliditylang.org/en/v0.8.11/)
* [Openzeppelin](https://openzeppelin.com/)
* [Bootstrap](https://getbootstrap.com)
* [Celo-tools](https://docs.celo.org/learn/developer-tools)


## :point_down: Getting Started

### Prerequisites

You will need node and yarn installed.

### Installation

Step-by-step guide to running this NFT minter locally;

1. Clone the repo
   ```sh
   git clone https://github.com/gaubrey1/winery.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

3. Run your application
   ```sh
   npm start
   ```
   
### Smart-Contract-Deployment

Compile the smart contract
   ```sh
   npx hardhat compile
   ```
Run tests on smart contract
   ```sh
   npx hardhat test
   ```
Update env file

* Create a file in the root directory called ".env"
* Create a key called MNEMONIC and paste in your mnemonic key. e.g
     ```
   MNEMONIC="xxxx xxxx xxxx xxxx xxxx xxxx"
   ```
You can get your MNEMONIC from Metamask Recovery security phrase in settings

Deploy the smart contract
   ```sh
    npx hardhat run scripts/deploy.js
   ```
Run the project
   ```sh
    npm start
   ```

